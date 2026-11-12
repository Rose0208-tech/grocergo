import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  uploadPaymentProof,
  cancelOrder,
  confirmOrderPayment,
  switchToCashOnDelivery
} from '../controllers/orderController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { createOrderSchema } from '../utils/validation.js';
import { uploadPaymentProof as uploadMiddleware } from '../config/multer.js';

const router = Router();

router.use(requireAuth);

router.post('/', validateBody(createOrderSchema), createOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);
router.post('/:id/payment-proof', uploadMiddleware.single('proofImage'), uploadPaymentProof);
router.post('/:id/confirm', confirmOrderPayment);
router.post('/:id/switch-to-cod', switchToCashOnDelivery);
router.patch('/:id/cancel', cancelOrder);

export default router;
