import { Response, NextFunction } from 'express';
import prisma from '../config/prisma.js';
import { AuthenticatedRequest } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

// Delivery charge rules
const FREE_DELIVERY_THRESHOLD = 300;
const STANDARD_DELIVERY_CHARGE = 30;

// Helper to resolve or create cart for user or guest session
async function getOrCreateCart(userId?: string, sessionId?: string) {
  if (userId) {
    let cart = await prisma.cart.findUnique({
      where: { userId }
    });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId }
      });
    }
    return cart;
  }

  if (sessionId) {
    let cart = await prisma.cart.findUnique({
      where: { sessionId }
    });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { sessionId }
      });
    }
    return cart;
  }

  throw new AppError('Unable to identify cart: missing user authentication or session ID', 400);
}

export const getCart = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const sessionId = req.headers['x-session-id'] as string;
    const lang = (req.query.lang as string) || (req.headers['accept-language'] as string) || 'en';

    const cart = await getOrCreateCart(userId, sessionId);

    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: {
        product: {
          include: {
            category: { select: { name: true } },
            translations: lang !== 'en' ? {
              where: { language: String(lang) }
            } : false
          }
        }
      }
    });

    let subtotal = 0;
    let originalSubtotal = 0;
    const validatedItems = [];

    for (const item of cartItems) {
      const prod = item.product as any;
      const translation = prod.translations && prod.translations[0];
      const isAvailable = prod.isActive && prod.stock > 0;
      const isExceedingStock = item.quantity > prod.stock;
      const effectiveQuantity = Math.min(item.quantity, prod.stock);

      const itemTotal = prod.price * item.quantity;
      const originalItemTotal = (prod.originalPrice || prod.price) * item.quantity;

      if (isAvailable) {
        subtotal += itemTotal;
        originalSubtotal += originalItemTotal;
      }

      validatedItems.push({
        id: item.id,
        productId: prod.id,
        sku: prod.sku,
        name: translation?.name || prod.name,
        originalName: prod.name,
        price: prod.price,
        originalPrice: prod.originalPrice,
        discountPercent: prod.discountPercent,
        unit: prod.unit,
        packSize: prod.packSize,
        imageUrl: prod.imageUrl,
        stock: prod.stock,
        quantity: item.quantity,
        isAvailable,
        isExceedingStock,
        total: itemTotal
      });
    }

    const discount = Math.max(0, originalSubtotal - subtotal);
    const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : STANDARD_DELIVERY_CHARGE;
    const finalTotal = subtotal + deliveryCharge;

    res.status(200).json({
      success: true,
      data: {
        cartId: cart.id,
        items: validatedItems,
        itemCount: validatedItems.reduce((acc, it) => acc + it.quantity, 0),
        subtotal: Number(subtotal.toFixed(2)),
        discount: Number(discount.toFixed(2)),
        deliveryCharge,
        freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
        amountForFreeDelivery: Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal),
        total: Number(finalTotal.toFixed(2))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const addItemToCart = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const sessionId = req.headers['x-session-id'] as string;
    const { productId, quantity = 1 } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product || !product.isActive) {
      throw new AppError('Product is currently not available', 404);
    }

    if (product.stock < 1) {
      throw new AppError('Product is currently out of stock', 400);
    }

    const cart = await getOrCreateCart(userId, sessionId);

    // Check existing item
    const existing = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: product.id
        }
      }
    });

    const targetQuantity = existing ? existing.quantity + quantity : quantity;

    if (targetQuantity > product.stock) {
      throw new AppError(
        `Cannot add ${quantity} more. Only ${product.stock} items are available in stock.`,
        400
      );
    }

    await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: product.id
        }
      },
      update: {
        quantity: targetQuantity
      },
      create: {
        cartId: cart.id,
        productId: product.id,
        quantity: targetQuantity
      }
    });

    res.status(200).json({
      success: true,
      message: `${product.name} added to cart.`
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const itemId = String(req.params.itemId);
    const { quantity } = req.body;

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true }
    });

    if (!item) {
      throw new AppError('Cart item not found', 404);
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: { id: itemId }
      });
      res.status(200).json({
        success: true,
        message: 'Item removed from cart'
      });
      return;
    }

    if (quantity > item.product.stock) {
      throw new AppError(`Cannot set quantity to ${quantity}. Available stock: ${item.product.stock}`, 400);
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    });

    res.status(200).json({
      success: true,
      message: 'Cart updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const itemId = String(req.params.itemId);

    await prisma.cartItem.delete({
      where: { id: itemId }
    });

    res.status(200).json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const sessionId = req.headers['x-session-id'] as string;

    const cart = await getOrCreateCart(userId, sessionId);

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    next(error);
  }
};
