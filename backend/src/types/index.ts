import { Request } from 'express';

export type UserRole = 'CUSTOMER' | 'ADMIN';

export type LanguageCode = 'en' | 'ta' | 'hi' | 'te' | 'kn' | 'ml';

export interface AuthUserPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}

export type PaymentStatus =
  | 'Awaiting Payment'
  | 'Proof Submitted'
  | 'Under Verification'
  | 'Approved'
  | 'Rejected';

export type OrderStatus =
  | 'Pending Confirmation'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready for Pickup'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';
