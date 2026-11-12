import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lang = (req.query.lang as string) || 'en';

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        translations: lang !== 'en' ? {
          where: { language: lang }
        } : false,
        _count: {
          select: { products: true }
        }
      }
    });

    const transformed = categories.map((cat: any) => {
      const translation = cat.translations && cat.translations[0];
      return {
        id: cat.id,
        name: translation?.name || cat.name,
        originalName: cat.name,
        slug: cat.slug,
        description: translation?.description || cat.description,
        imageUrl: cat.imageUrl,
        sortOrder: cat.sortOrder,
        productCount: cat._count.products
      };
    });

    res.status(200).json({
      success: true,
      data: { categories: transformed }
    });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '20',
      category,
      search,
      featured,
      inStock,
      sortBy = 'newest',
      lang = 'en'
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const take = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));
    const skip = (pageNum - 1) * take;

    const where: any = {
      isActive: true
    };

    if (category) {
      // Find category by slug or id, with alias for merged category
      let categorySlug = String(category);
      if (categorySlug === 'rice-and-grains' || categorySlug === 'pulses-and-dals') {
        categorySlug = 'rice-grains-and-dals';
      }
      const cat = await prisma.category.findFirst({
        where: {
          OR: [{ slug: categorySlug }, { slug: String(category) }, { id: String(category) }]
        }
      });
      if (cat) {
        where.categoryId = cat.id;
      }
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (inStock === 'true') {
      where.stock = { gt: 0 };
    }

    if (search && String(search).trim()) {
      const searchTerm = String(search).trim();
      where.OR = [
        { name: { contains: searchTerm } },
        { description: { contains: searchTerm } },
        { sku: { contains: searchTerm } },
        { translations: { some: { name: { contains: searchTerm } } } }
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'price-asc') orderBy = { price: 'asc' };
    else if (sortBy === 'price-desc') orderBy = { price: 'desc' };
    else if (sortBy === 'name-asc') orderBy = { name: 'asc' };
    else if (sortBy === 'popular') orderBy = { isFeatured: 'desc' };

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              translations: lang !== 'en' ? {
                where: { language: String(lang) }
              } : false
            }
          },
          translations: lang !== 'en' ? {
            where: { language: String(lang) }
          } : false
        }
      })
    ]);

    const transformed = products.map((prod: any) => {
      const translation = prod.translations && prod.translations[0];
      const catTranslation = prod.category?.translations && prod.category.translations[0];
      return {
        id: prod.id,
        sku: prod.sku,
        name: translation?.name || prod.name,
        originalName: prod.name,
        slug: prod.slug,
        description: translation?.description || prod.description,
        categoryId: prod.categoryId,
        category: prod.category ? {
          id: prod.category.id,
          name: catTranslation?.name || prod.category.name,
          originalName: prod.category.name,
          slug: prod.category.slug
        } : undefined,
        price: prod.price,
        originalPrice: prod.originalPrice,
        discountPercent: prod.discountPercent,
        unit: prod.unit,
        packSize: prod.packSize,
        stock: prod.stock,
        imageUrl: prod.imageUrl,
        isFeatured: prod.isFeatured,
        isActive: prod.isActive
      };
    });

    res.status(200).json({
      success: true,
      data: {
        products: transformed,
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

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const lang = (req.query.lang as string) || 'en';

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        isActive: true
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            translations: lang !== 'en' ? {
              where: { language: lang }
            } : false
          }
        },
        translations: lang !== 'en' ? {
          where: { language: lang }
        } : false
      }
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const prodAny = product as any;
    const translation = prodAny.translations && prodAny.translations[0];
    const catTranslation = prodAny.category?.translations && prodAny.category.translations[0];

    res.status(200).json({
      success: true,
      data: {
        product: {
          id: product.id,
          sku: product.sku,
          name: translation?.name || product.name,
          originalName: product.name,
          slug: product.slug,
          description: translation?.description || product.description,
          categoryId: product.categoryId,
          category: prodAny.category ? {
            id: prodAny.category.id,
            name: catTranslation?.name || prodAny.category.name,
            originalName: prodAny.category.name,
            slug: prodAny.category.slug
          } : undefined,
          price: product.price,
          originalPrice: product.originalPrice,
          discountPercent: product.discountPercent,
          unit: product.unit,
          packSize: product.packSize,
          stock: product.stock,
          imageUrl: product.imageUrl,
          isFeatured: product.isFeatured,
          isActive: product.isActive
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
