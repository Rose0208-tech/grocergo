import { Response, NextFunction } from 'express';
import prisma from '../config/prisma.js';
import { AuthenticatedRequest } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

export const getDashboardStats = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [
      totalProducts,
      totalCategories,
      totalCustomers,
      totalOrders,
      pendingOrders,
      pendingProofs,
      lowStockProducts,
      outOfStockProducts,
      approvedOrders,
      pendingPaymentOrders,
      recentOrders
    ] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.category.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.count(),
      prisma.order.count({ where: { orderStatus: 'Pending Confirmation' } }),
      prisma.paymentProof.count({ where: { status: 'Proof Submitted' } }),
      prisma.product.count({ where: { stock: { gt: 0, lte: 10 }, isActive: true } }),
      prisma.product.count({ where: { stock: 0, isActive: true } }),
      prisma.order.findMany({
        where: { paymentStatus: 'Approved' },
        select: { total: true }
      }),
      prisma.order.findMany({
        where: { paymentStatus: { in: ['Awaiting Payment', 'Proof Submitted', 'Under Verification'] } },
        select: { total: true }
      }),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          user: { select: { name: true, phone: true } }
        }
      })
    ]);

    const approvedRevenue = approvedOrders.reduce((sum, o) => sum + o.total, 0);
    const pendingPaymentAmount = pendingPaymentOrders.reduce((sum, o) => sum + o.total, 0);

    // Calculate last 7 days order trends
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const ordersPastWeek = await prisma.order.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true, total: true, paymentStatus: true }
    });

    const dailyTrendsMap: { [dateStr: string]: { date: string; orders: number; revenue: number } } = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);
      dailyTrendsMap[key] = { date: key, orders: 0, revenue: 0 };
    }

    ordersPastWeek.forEach((ord) => {
      const key = ord.createdAt.toISOString().slice(0, 10);
      if (dailyTrendsMap[key]) {
        dailyTrendsMap[key].orders += 1;
        if (ord.paymentStatus === 'Approved') {
          dailyTrendsMap[key].revenue += ord.total;
        }
      }
    });

    const dailyTrends = Object.values(dailyTrendsMap);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalProducts,
          totalCategories,
          totalCustomers,
          totalOrders,
          pendingOrders,
          pendingProofs,
          lowStockProducts,
          outOfStockProducts,
          approvedRevenue: Number(approvedRevenue.toFixed(2)),
          pendingPaymentAmount: Number(pendingPaymentAmount.toFixed(2))
        },
        dailyTrends,
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminProducts = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = '1', limit = '50', search, categoryId, stockStatus } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const take = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 50));
    const skip = (pageNum - 1) * take;

    const where: any = {};

    if (categoryId) {
      where.categoryId = String(categoryId);
    }

    if (stockStatus === 'low') {
      where.stock = { gt: 0, lte: 10 };
    } else if (stockStatus === 'out') {
      where.stock = 0;
    } else if (stockStatus === 'in') {
      where.stock = { gt: 10 };
    }

    if (search && String(search).trim()) {
      const term = String(search).trim();
      where.OR = [
        { name: { contains: term } },
        { sku: { contains: term } },
        { description: { contains: term } }
      ];
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { id: true, name: true } },
          translations: true
        }
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page: pageNum,
          limit: take,
          totalPages: Math.ceil(total / take)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      sku,
      name,
      description,
      categoryId,
      price,
      originalPrice,
      discountPercent = 0,
      unit,
      packSize,
      stock = 0,
      imageUrl,
      isFeatured = false,
      isActive = true,
      translations
    } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existingSku = await prisma.product.findUnique({ where: { sku } });
    if (existingSku) {
      throw new AppError(`A product with SKU "${sku}" already exists.`, 409);
    }

    const product = await prisma.$transaction(async (tx) => {
      const newProd = await tx.product.create({
        data: {
          sku,
          name,
          slug,
          description,
          categoryId,
          price: Number(price),
          originalPrice: originalPrice ? Number(originalPrice) : Number(price),
          discountPercent: Number(discountPercent),
          unit,
          packSize,
          stock: Number(stock),
          imageUrl,
          isFeatured: Boolean(isFeatured),
          isActive: Boolean(isActive)
        }
      });

      // Handle translations if provided: { ta: { name, description }, hi: { name, description } }
      if (translations && typeof translations === 'object') {
        for (const [lang, t] of Object.entries(translations as any)) {
          if (t && typeof t === 'object' && (t as any).name) {
            await tx.productTranslation.create({
              data: {
                productId: newProd.id,
                language: lang,
                name: (t as any).name,
                description: (t as any).description || null
              }
            });
          }
        }
      }

      // Initial inventory movement log
      if (stock > 0) {
        await tx.inventoryMovement.create({
          data: {
            productId: newProd.id,
            quantityChange: stock,
            quantityBefore: 0,
            quantityAfter: stock,
            reason: 'Initial Admin Stock Setup',
            userId: req.user?.userId
          }
        });
      }

      await tx.auditLog.create({
        data: {
          userId: req.user?.userId,
          action: 'CREATE_PRODUCT',
          entity: 'Product',
          entityId: newProd.id,
          details: JSON.stringify({ sku, name, price, stock })
        }
      });

      return newProd;
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const {
      name,
      description,
      categoryId,
      price,
      originalPrice,
      discountPercent,
      unit,
      packSize,
      stock,
      imageUrl,
      isFeatured,
      isActive,
      translations
    } = req.body;

    const currentProd = await prisma.product.findUnique({ where: { id } });
    if (!currentProd) {
      throw new AppError('Product not found', 404);
    }

    const updated = await prisma.$transaction(async (tx) => {
      // Stock change detection
      if (stock !== undefined && stock !== currentProd.stock) {
        const delta = stock - currentProd.stock;
        await tx.inventoryMovement.create({
          data: {
            productId: id,
            quantityChange: delta,
            quantityBefore: currentProd.stock,
            quantityAfter: stock,
            reason: 'Admin Product Edit Stock Adjustment',
            userId: req.user?.userId
          }
        });
      }

      const prod = await tx.product.update({
        where: { id },
        data: {
          name,
          description,
          categoryId,
          price: price !== undefined ? Number(price) : undefined,
          originalPrice: originalPrice !== undefined ? Number(originalPrice) : undefined,
          discountPercent: discountPercent !== undefined ? Number(discountPercent) : undefined,
          unit,
          packSize,
          stock: stock !== undefined ? Number(stock) : undefined,
          imageUrl,
          isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
          isActive: isActive !== undefined ? Boolean(isActive) : undefined
        }
      });

      // Update translations
      if (translations && typeof translations === 'object') {
        for (const [lang, t] of Object.entries(translations as any)) {
          if (t && typeof t === 'object' && (t as any).name) {
            await tx.productTranslation.upsert({
              where: {
                productId_language: {
                  productId: id,
                  language: lang
                }
              },
              update: {
                name: (t as any).name,
                description: (t as any).description || null
              },
              create: {
                productId: id,
                language: lang,
                name: (t as any).name,
                description: (t as any).description || null
              }
            });
          }
        }
      }

      await tx.auditLog.create({
        data: {
          userId: req.user?.userId,
          action: 'UPDATE_PRODUCT',
          entity: 'Product',
          entityId: id,
          details: JSON.stringify({ name, price, stock, isActive })
        }
      });

      return prod;
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: { product: updated }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params.id);

    // Check if product has past order items
    const hasOrders = await prisma.orderItem.count({ where: { productId: id } });

    if (hasOrders > 0) {
      // Soft-delete / deactivate to preserve historical integrity
      await prisma.product.update({
        where: { id },
        data: { isActive: false, stock: 0 }
      });
      res.status(200).json({
        success: true,
        message: 'Product is attached to existing orders. It has been deactivated and removed from store catalog.'
      });
      return;
    }

    await prisma.product.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.userId,
        action: 'DELETE_PRODUCT',
        entity: 'Product',
        entityId: id
      }
    });

    res.status(200).json({
      success: true,
      message: 'Product deleted permanently.'
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminOrders = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = '1', limit = '30', orderStatus, paymentStatus, search } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const take = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 30));
    const skip = (pageNum - 1) * take;

    const where: any = {};

    if (orderStatus) {
      where.orderStatus = String(orderStatus);
    }
    if (paymentStatus) {
      where.paymentStatus = String(paymentStatus);
    }
    if (search && String(search).trim()) {
      const term = String(search).trim();
      where.OR = [
        { orderNumber: { contains: term } },
        { customerName: { contains: term } },
        { customerPhone: { contains: term } }
      ];
    }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          paymentProofs: {
            orderBy: { createdAt: 'desc' }
          },
          statusHistory: {
            orderBy: { createdAt: 'desc' }
          }
        }
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          page: pageNum,
          limit: take,
          totalPages: Math.ceil(total / take)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const { orderStatus, note } = req.body;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id },
        data: { orderStatus }
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: id,
          fromStatus: order.orderStatus,
          toStatus: orderStatus,
          note: note || `Status updated to ${orderStatus} by administrator`,
          changedBy: req.user!.userId
        }
      });

      await tx.auditLog.create({
        data: {
          userId: req.user!.userId,
          action: 'UPDATE_ORDER_STATUS',
          entity: 'Order',
          entityId: id,
          details: JSON.stringify({ from: order.orderStatus, to: orderStatus, note })
        }
      });
    });

    res.status(200).json({
      success: true,
      message: `Order status updated to "${orderStatus}".`
    });
  } catch (error) {
    next(error);
  }
};

export const updatePaymentDecision = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params.id); // order id or proof id
    const { status, rejectionReason } = req.body; // "Approved" | "Rejected" | "Under Verification"

    // Find order
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }]
      },
      include: {
        paymentProofs: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    const latestProof = order.paymentProofs[0];

    await prisma.$transaction(async (tx) => {
      if (latestProof) {
        await tx.paymentProof.update({
          where: { id: latestProof.id },
          data: {
            status,
            rejectionReason: status === 'Rejected' ? rejectionReason : null,
            reviewedBy: req.user!.userId,
            reviewedAt: new Date()
          }
        });
      }

      // Update Order payment status
      const updatedOrderData: any = {
        paymentStatus: status
      };

      // If approved, advance order status to Confirmed automatically
      let newOrderStatus = order.orderStatus;
      if (status === 'Approved' && order.orderStatus === 'Pending Confirmation') {
        updatedOrderData.orderStatus = 'Confirmed';
        newOrderStatus = 'Confirmed';
      }

      await tx.order.update({
        where: { id: order.id },
        data: updatedOrderData
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          fromStatus: order.orderStatus,
          toStatus: newOrderStatus,
          note: `Manual payment verification result: ${status}. ${status === 'Rejected' ? `Reason: ${rejectionReason}` : ''}`,
          changedBy: req.user!.userId
        }
      });

      await tx.auditLog.create({
        data: {
          userId: req.user!.userId,
          action: status === 'Approved' ? 'APPROVE_PAYMENT' : 'REJECT_PAYMENT',
          entity: 'Order',
          entityId: order.id,
          details: JSON.stringify({
            paymentStatus: status,
            rejectionReason,
            proofId: latestProof?.id
          })
        }
      });
    });

    res.status(200).json({
      success: true,
      message: `Payment status updated to "${status}".`
    });
  } catch (error) {
    next(error);
  }
};

export const adjustStock = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const productId = String(req.params.productId);
    const { quantityChange, reason } = req.body;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const updatedStock = product.stock + quantityChange;
    if (updatedStock < 0) {
      throw new AppError(`Cannot reduce stock by ${Math.abs(quantityChange)}. Current stock is only ${product.stock}.`, 400);
    }

    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: productId },
        data: { stock: updatedStock }
      });

      await tx.inventoryMovement.create({
        data: {
          productId,
          quantityChange,
          quantityBefore: product.stock,
          quantityAfter: updatedStock,
          reason,
          userId: req.user!.userId
        }
      });

      await tx.auditLog.create({
        data: {
          userId: req.user!.userId,
          action: 'ADJUST_STOCK',
          entity: 'Product',
          entityId: productId,
          details: JSON.stringify({ quantityChange, reason, before: product.stock, after: updatedStock })
        }
      });
    });

    res.status(200).json({
      success: true,
      message: `Stock updated. Current stock is now ${updatedStock}.`,
      data: { currentStock: updatedStock }
    });
  } catch (error) {
    next(error);
  }
};

export const getInventory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { filter = 'all' } = req.query;

    const where: any = { isActive: true };
    if (filter === 'low') {
      where.stock = { gt: 0, lte: 10 };
    } else if (filter === 'out') {
      where.stock = 0;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { stock: 'asc' },
      include: {
        category: { select: { name: true } },
        inventoryLogs: {
          take: 3,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    const movements = await prisma.inventoryMovement.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { name: true, sku: true } },
        user: { select: { name: true } }
      }
    });

    res.status(200).json({
      success: true,
      data: { products, movements }
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomers = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        preferredLanguage: true,
        villageTown: true,
        address: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            total: true,
            paymentStatus: true,
            createdAt: true
          }
        }
      }
    });

    const transformed = customers.map((c) => {
      const totalOrders = c.orders.length;
      const approvedOrders = c.orders.filter((o) => o.paymentStatus === 'Approved');
      const totalSpent = approvedOrders.reduce((sum, o) => sum + o.total, 0);

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        preferredLanguage: c.preferredLanguage,
        villageTown: c.villageTown,
        address: c.address,
        createdAt: c.createdAt,
        totalOrders,
        totalSpent: Number(totalSpent.toFixed(2))
      };
    });

    res.status(200).json({
      success: true,
      data: { customers: transformed }
    });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { limit = '50' } = req.query;

    const logs = await prisma.auditLog.findMany({
      take: Math.min(100, parseInt(limit as string, 10) || 50),
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true, role: true } }
      }
    });

    res.status(200).json({
      success: true,
      data: { logs }
    });
  } catch (error) {
    next(error);
  }
};

export const exportCsv = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type = 'orders' } = req.query;

    if (type === 'orders') {
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: { items: true }
      });

      let csv = 'OrderNumber,CustomerName,CustomerPhone,Date,Subtotal,DeliveryCharge,Total,PaymentStatus,OrderStatus,ItemsCount\n';
      orders.forEach((o) => {
        csv += `"${o.orderNumber}","${o.customerName}","${o.customerPhone}","${o.createdAt.toISOString()}","${o.subtotal}","${o.deliveryCharge}","${o.total}","${o.paymentStatus}","${o.orderStatus}","${o.items.length}"\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="grocergo_orders_report.csv"');
      res.send(csv);
      return;
    }

    if (type === 'inventory') {
      const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { stock: 'asc' }
      });

      let csv = 'SKU,ProductName,Category,Price,Stock,Unit,PackSize,Active\n';
      products.forEach((p) => {
        csv += `"${p.sku}","${p.name.replace(/"/g, '""')}","${p.category.name}","${p.price}","${p.stock}","${p.unit}","${p.packSize}","${p.isActive}"\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="grocergo_inventory_report.csv"');
      res.send(csv);
      return;
    }

    throw new AppError('Invalid CSV export type. Must be "orders" or "inventory".', 400);
  } catch (error) {
    next(error);
  }
};

export const getAdminCategories = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        translations: true,
        _count: { select: { products: true } }
      }
    });

    res.status(200).json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description, imageUrl, sortOrder = 0, isActive = true, translations } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await prisma.category.findFirst({
      where: { OR: [{ name }, { slug }] }
    });
    if (existing) {
      throw new AppError('A category with that name or slug already exists', 409);
    }

    const category = await prisma.$transaction(async (tx) => {
      const cat = await tx.category.create({
        data: {
          name,
          slug,
          description,
          imageUrl,
          sortOrder: Number(sortOrder),
          isActive: Boolean(isActive)
        }
      });

      if (translations && typeof translations === 'object') {
        for (const [lang, transName] of Object.entries(translations as any)) {
          if (transName && typeof transName === 'string') {
            await tx.categoryTranslation.create({
              data: {
                categoryId: cat.id,
                language: lang,
                name: transName
              }
            });
          }
        }
      }

      await tx.auditLog.create({
        data: {
          userId: req.user?.userId,
          action: 'CREATE_CATEGORY',
          entity: 'Category',
          entityId: cat.id,
          details: JSON.stringify({ name, slug })
        }
      });

      return cat;
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const { name, description, imageUrl, sortOrder, isActive, translations } = req.body;

    const category = await prisma.$transaction(async (tx) => {
      const cat = await tx.category.update({
        where: { id },
        data: {
          name,
          description,
          imageUrl,
          sortOrder: sortOrder !== undefined ? Number(sortOrder) : undefined,
          isActive: isActive !== undefined ? Boolean(isActive) : undefined
        }
      });

      if (translations && typeof translations === 'object') {
        for (const [lang, transName] of Object.entries(translations as any)) {
          if (transName && typeof transName === 'string') {
            await tx.categoryTranslation.upsert({
              where: {
                categoryId_language: {
                  categoryId: id,
                  language: lang
                }
              },
              update: { name: transName },
              create: {
                categoryId: id,
                language: lang,
                name: transName
              }
            });
          }
        }
      }

      await tx.auditLog.create({
        data: {
          userId: req.user?.userId,
          action: 'UPDATE_CATEGORY',
          entity: 'Category',
          entityId: id,
          details: JSON.stringify({ name, isActive })
        }
      });

      return cat;
    });

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params.id);

    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      throw new AppError(`Cannot delete category. There are ${productCount} products assigned to it. Deactivate the category instead.`, 400);
    }

    await prisma.category.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.userId,
        action: 'DELETE_CATEGORY',
        entity: 'Category',
        entityId: id
      }
    });

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

