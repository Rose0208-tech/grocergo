import { Router } from 'express';
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from '../controllers/cartController.js';
import { optionalAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { cartItemSchema, updateCartItemSchema } from '../utils/validation.js';

const router = Router();

// Apply optionalAuth to handle authenticated user or guest sessions
router.use(optionalAuth);

router.get('/', getCart);
router.post('/items', validateBody(cartItemSchema), addItemToCart);
router.patch('/items/:itemId', validateBody(updateCartItemSchema), updateCartItem);
router.delete('/items/:itemId', removeCartItem);
router.delete('/', clearCart);

export default router;
