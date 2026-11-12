import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
  preferredLanguage: z.enum(['en', 'ta', 'hi', 'te', 'kn', 'ml']).default('en'),
  villageTown: z.string().optional(),
  address: z.string().optional(),
  landmark: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
  preferredLanguage: z.enum(['en', 'ta', 'hi', 'te', 'kn', 'ml']).optional(),
  villageTown: z.string().optional(),
  address: z.string().optional(),
  landmark: z.string().optional()
});

export const addressSchema = z.object({
  streetAddress: z.string().min(3, 'Address is required'),
  villageTown: z.string().min(2, 'Village/Town is required'),
  landmark: z.string().optional(),
  pincode: z.string().min(6, 'Pincode must be 6 digits'),
  isDefault: z.boolean().default(false)
});

export const cartItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1')
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0, 'Quantity cannot be negative')
});

export const createOrderSchema = z.object({
  customerName: z.string().min(2, 'Customer name is required'),
  customerPhone: z.string().min(10, 'Valid phone number is required'),
  deliveryAddress: z.string().min(5, 'Delivery address is required'),
  villageTown: z.string().optional(),
  landmark: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.string().optional()
});

export const paymentProofSchema = z.object({
  transactionRef: z.string().min(3, 'Valid UTR/transaction reference is required')
});

export const updateOrderStatusSchema = z.object({
  orderStatus: z.enum([
    'Pending Confirmation',
    'Confirmed',
    'Preparing',
    'Ready for Pickup',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
  ]),
  note: z.string().optional()
});

export const paymentDecisionSchema = z.object({
  status: z.enum(['Approved', 'Rejected', 'Under Verification']),
  rejectionReason: z.string().optional()
});

export const adjustStockSchema = z.object({
  quantityChange: z.number().int(),
  reason: z.string().min(3, 'Adjustment reason is required')
});

export const productSchema = z.object({
  sku: z.string().min(2, 'SKU is required'),
  name: z.string().min(2, 'Product name is required'),
  description: z.string().min(5, 'Description is required'),
  categoryId: z.string().uuid('Invalid category ID'),
  price: z.number().positive('Price must be positive'),
  originalPrice: z.number().positive().optional(),
  discountPercent: z.number().min(0).max(100).default(0),
  unit: z.string().min(1, 'Unit is required'),
  packSize: z.string().min(1, 'Pack size is required'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  imageUrl: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true)
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true)
});
