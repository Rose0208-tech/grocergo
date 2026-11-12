import { Router } from 'express';
import {
  getDashboardStats,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAdminOrders,
  updateOrderStatus,
  updatePaymentDecision,
  getInventory,
  adjustStock,
  getCustomers,
  getAuditLogs,
  exportCsv
} from '../controllers/adminController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { validateBody } from '../middleware/validate.js';
import {
  productSchema,
  categorySchema,
  updateOrderStatusSchema,
  paymentDecisionSchema,
  adjustStockSchema
} from '../utils/validation.js';
import { uploadProductImage } from '../config/multer.js';

const router = Router();

// Protect all admin routes: requireAuth + requireRole('ADMIN')
router.use(requireAuth, requireRole('ADMIN'));

// Dashboard metrics & chart trends
router.get('/dashboard', getDashboardStats);

// Products management
router.get('/products', getAdminProducts);
router.post('/products', validateBody(productSchema), createProduct);
router.patch('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.post('/products/upload-image', uploadProductImage.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'No image uploaded' });
    return;
  }
  const imageUrl = `/uploads/products/${req.file.filename}`;
  res.status(200).json({ success: true, data: { imageUrl } });
});

// Categories management
router.get('/categories', getAdminCategories);
router.post('/categories', validateBody(categorySchema), createCategory);
router.patch('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Orders management
router.get('/orders', getAdminOrders);
router.patch('/orders/:id/status', validateBody(updateOrderStatusSchema), updateOrderStatus);
router.patch('/payments/:id/status', validateBody(paymentDecisionSchema), updatePaymentDecision);

// Inventory
router.get('/inventory', getInventory);
router.post('/inventory/:productId/adjust', validateBody(adjustStockSchema), adjustStock);

// Customers & Audit Logs & Reports
router.get('/customers', getCustomers);
router.get('/audit-logs', getAuditLogs);
router.get('/reports/export-csv', exportCsv);

export default router;
