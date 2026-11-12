import { Response, NextFunction } from 'express';
import crypto from 'crypto';
import prisma from '../config/prisma.js';
import { AuthenticatedRequest } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

const FREE_DELIVERY_THRESHOLD = 300;
const STANDARD_DELIVERY_CHARGE = 30;

export const createOrder = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required to place an order', 401);
    }

    const userId = req.user.userId;
    const { customerName, customerPhone, deliveryAddress, villageTown, landmark, notes, paymentMethod = 'UPI' } = req.body;

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      throw new AppError('Your shopping cart is empty. Please add items before checking out.', 400);
    }

    // Execute atomic order placement transaction
    const order = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      let totalDiscount = 0;

      // 1. Validate all stock and calculate fresh server-side prices
      for (const item of cart.items) {
        const prod = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (!prod || !prod.isActive) {
          throw new AppError(`Item "${item.product.name}" is no longer available.`, 400);
        }

        if (prod.stock < item.quantity) {
          throw new AppError(
            `Insufficient stock for "${prod.name}". Available: ${prod.stock}, requested: ${item.quantity}. Please update your cart.`,
            400
          );
        }

        const itemTotal = prod.price * item.quantity;
        const originalItemTotal = (prod.originalPrice || prod.price) * item.quantity;

        subtotal += itemTotal;
        totalDiscount += Math.max(0, originalItemTotal - itemTotal);
      }

      const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_CHARGE;
      const finalTotal = subtotal + deliveryCharge;

      // 2. Generate unique human-readable order number
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
      const orderNumber = `GG-${dateStr}-${randomSuffix}`;

      const isCod = paymentMethod === 'Cash on Delivery' || paymentMethod === 'COD';
      const initialPaymentStatus = isCod ? 'Cash on Delivery' : 'Awaiting Payment';
      const initialOrderStatus = isCod ? 'Confirmed' : 'Pending Confirmation';

      // 3. Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          subtotal: Number(subtotal.toFixed(2)),
          deliveryCharge,
          discount: Number(totalDiscount.toFixed(2)),
          total: Number(finalTotal.toFixed(2)),
          paymentMethod: isCod ? 'Cash on Delivery' : 'UPI',
          paymentStatus: initialPaymentStatus,
          orderStatus: initialOrderStatus,
          customerName,
          customerPhone,
          deliveryAddress,
          villageTown,
          landmark,
          notes
        }
      });

      // 4. Create OrderItems snapshot & deduct stock & log inventory movement
      for (const item of cart.items) {
        const prod = item.product;
        const itemTotal = prod.price * item.quantity;

        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: prod.id,
            productName: prod.name,
            unit: prod.unit,
            packSize: prod.packSize,
            price: prod.price,
            quantity: item.quantity,
            total: Number(itemTotal.toFixed(2))
          }
        });

        const updatedStock = prod.stock - item.quantity;
        await tx.product.update({
          where: { id: prod.id },
          data: { stock: updatedStock }
        });

        await tx.inventoryMovement.create({
          data: {
            productId: prod.id,
            quantityChange: -item.quantity,
            quantityBefore: prod.stock,
            quantityAfter: updatedStock,
            reason: `Order Placed (#${orderNumber})`,
            userId
          }
        });
      }

      // 5. Add initial status history
      await tx.orderStatusHistory.create({
        data: {
          orderId: newOrder.id,
          fromStatus: 'NONE',
          toStatus: initialOrderStatus,
          note: isCod
            ? 'Order placed by customer with Cash on Delivery option.'
            : 'Order placed by customer. Awaiting UPI QR payment completion.',
          changedBy: userId
        }
      });

      // 6. Clear user cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return newOrder;
    });

    const isCod = paymentMethod === 'Cash on Delivery' || paymentMethod === 'COD';
    res.status(201).json({
      success: true,
      message: isCod
        ? 'Order placed successfully with Cash on Delivery.'
        : 'Order created successfully. Please scan the QR code to complete payment.',
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const orders = await prisma.order.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        paymentProofs: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: { orders }
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const id = String(req.params.id);

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }]
      },
      include: {
        items: true,
        paymentProofs: {
          orderBy: { createdAt: 'desc' }
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Customer privacy enforcement: regular customers can only view their own orders
    if (req.user.role !== 'ADMIN' && order.userId !== req.user.userId) {
      throw new AppError('Access denied: You cannot view orders placed by other customers.', 403);
    }

    res.status(200).json({
      success: true,
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

export const uploadPaymentProof = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const id = String(req.params.id);
    const { transactionRef } = req.body;

    if (!req.file) {
      throw new AppError('Please select a payment screenshot or receipt image to upload.', 400);
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }]
      }
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Customer privacy check
    if (req.user.role !== 'ADMIN' && order.userId !== req.user.userId) {
      throw new AppError('Access denied: You cannot upload payment proof for another customer\'s order.', 403);
    }

    const relativePath = `/uploads/payment-proofs/${req.file.filename}`;

    const proof = await prisma.$transaction(async (tx) => {
      const newProof = await tx.paymentProof.create({
        data: {
          orderId: order.id,
          imageUrl: relativePath,
          transactionRef: transactionRef || null,
          status: 'Proof Submitted'
        }
      });

      await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'Proof Submitted'
        }
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          fromStatus: order.orderStatus,
          toStatus: order.orderStatus,
          note: `Payment proof uploaded by customer. Reference: ${transactionRef || 'N/A'}. Awaiting admin manual verification.`,
          changedBy: req.user!.userId
        }
      });

      return newProof;
    });

    res.status(200).json({
      success: true,
      message: 'Payment proof submitted successfully. The administrator will review and verify it.',
      data: { proof }
    });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const id = String(req.params.id);

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }]
      },
      include: { items: true }
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (req.user.role !== 'ADMIN' && order.userId !== req.user.userId) {
      throw new AppError('Access denied', 403);
    }

    if (['Delivered', 'Cancelled', 'Out for Delivery'].includes(order.orderStatus)) {
      throw new AppError(`Cannot cancel order in "${order.orderStatus}" status.`, 400);
    }

    await prisma.$transaction(async (tx) => {
      // 1. Restore product stock
      for (const item of order.items) {
        const prod = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (prod) {
          const restoredStock = prod.stock + item.quantity;
          await tx.product.update({
            where: { id: prod.id },
            data: { stock: restoredStock }
          });

          await tx.inventoryMovement.create({
            data: {
              productId: prod.id,
              quantityChange: item.quantity,
              quantityBefore: prod.stock,
              quantityAfter: restoredStock,
              reason: `Order Cancelled (#${order.orderNumber}) - Stock Restored`,
              userId: req.user!.userId
            }
          });
        }
      }

      // 2. Update order status
      await tx.order.update({
        where: { id: order.id },
        data: {
          orderStatus: 'Cancelled'
        }
      });

      // 3. Status history
      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          fromStatus: order.orderStatus,
          toStatus: 'Cancelled',
          note: `Order cancelled by ${req.user!.role === 'ADMIN' ? 'administrator' : 'customer'}. Stock safely restored.`,
          changedBy: req.user!.userId
        }
      });
    });

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully and inventory stock restored.'
    });
  } catch (error) {
    next(error);
  }
};

export const confirmOrderPayment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const id = String(req.params.id);

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }]
      }
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (req.user.role !== 'ADMIN' && order.userId !== req.user.userId) {
      throw new AppError('Access denied', 403);
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const ord = await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'Proof Submitted',
          orderStatus: 'Pending Confirmation'
        }
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          fromStatus: order.orderStatus,
          toStatus: 'Pending Confirmation',
          note: 'Customer confirmed UPI QR payment and placed the order. Awaiting admin verification.',
          changedBy: req.user!.userId
        }
      });

      return ord;
    });

    res.status(200).json({
      success: true,
      message: 'Order placed successfully! The administrator will review and dispatch your order.',
      data: { order: updatedOrder }
    });
  } catch (error) {
    next(error);
  }
};

export const switchToCashOnDelivery = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const id = String(req.params.id);

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }]
      }
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (req.user.role !== 'ADMIN' && order.userId !== req.user.userId) {
      throw new AppError('Access denied', 403);
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const ord = await tx.order.update({
        where: { id: order.id },
        data: {
          paymentMethod: 'Cash on Delivery',
          paymentStatus: 'Cash on Delivery',
          orderStatus: 'Confirmed'
        }
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          fromStatus: order.orderStatus,
          toStatus: 'Confirmed',
          note: 'Payment method updated to Cash on Delivery. Order confirmed for delivery.',
          changedBy: req.user!.userId
        }
      });

      return ord;
    });

    res.status(200).json({
      success: true,
      message: 'Payment mode switched to Cash on Delivery. Your order is confirmed!',
      data: { order: updatedOrder }
    });
  } catch (error) {
    next(error);
  }
};
