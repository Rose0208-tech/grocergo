import { Router } from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  getAddresses,
  addAddress,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  addressSchema
} from '../utils/validation.js';

const router = Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);
router.patch('/profile', requireAuth, validateBody(updateProfileSchema), updateProfile);
router.get('/addresses', requireAuth, getAddresses);
router.post('/addresses', requireAuth, validateBody(addressSchema), addAddress);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
