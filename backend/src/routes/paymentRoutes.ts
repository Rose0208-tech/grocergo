import { Router } from 'express';
import {
  getActivePaymentSettings,
  updatePaymentSettings,
  uploadQrCodeImage,
  getPaymentProofSecure
} from '../controllers/paymentController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { uploadQrImage } from '../config/multer.js';

const router = Router();

// Public: Get active store QR & payment instructions
router.get('/settings/active', getActivePaymentSettings);

// Protected: View private payment proof image
router.get('/proofs/file/:filename', requireAuth, getPaymentProofSecure);

// Admin only: Update settings and upload new QR
router.put('/settings', requireAuth, requireRole('ADMIN'), updatePaymentSettings);
router.post('/settings/qr', requireAuth, requireRole('ADMIN'), uploadQrImage.single('qrImage'), uploadQrCodeImage);

export default router;
