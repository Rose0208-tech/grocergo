import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '../config/prisma.js';
import { AuthenticatedRequest } from '../types/index.js';
import { signToken, setAuthCookie, clearAuthCookie } from '../utils/jwt.js';
import { AppError } from '../middleware/errorHandler.js';

// Development password reset token store: email -> { token, expiresAt }
const resetTokens = new Map<string, { token: string; expiresAt: Date }>();

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      password,
      preferredLanguage = 'en',
      villageTown,
      address,
      landmark
    } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // Check duplicate email
    const existingEmail = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });
    if (existingEmail) {
      throw new AppError('An account with this email address already exists', 409);
    }

    // Check duplicate phone
    const existingPhone = await prisma.user.findUnique({
      where: { phone }
    });
    if (existingPhone) {
      throw new AppError('An account with this phone number already exists', 409);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user and initial address
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          name,
          phone,
          role: 'CUSTOMER',
          preferredLanguage,
          villageTown,
          address,
          landmark
        }
      });

      // If address provided, create Address record
      if (address && villageTown) {
        await tx.address.create({
          data: {
            userId: user.id,
            streetAddress: address,
            villageTown,
            landmark,
            pincode: '600001',
            isDefault: true
          }
        });
      }

      // Initialize empty cart
      await tx.cart.create({
        data: {
          userId: user.id
        }
      });

      return user;
    });

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role as any,
      name: newUser.name
    });

    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: {
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          preferredLanguage: newUser.preferredLanguage,
          villageTown: newUser.villageTown,
          address: newUser.address,
          landmark: newUser.landmark
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      throw new AppError('Invalid email or password credentials', 401);
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError('Invalid email or password credentials', 401);
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role as any,
      name: user.name
    });

    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          preferredLanguage: user.preferredLanguage,
          villageTown: user.villageTown,
          address: user.address,
          landmark: user.landmark
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  _req: Request,
  res: Response
): Promise<void> => {
  clearAuthCookie(res);
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

export const getMe = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        addresses: {
          orderBy: { isDefault: 'desc' }
        }
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          preferredLanguage: user.preferredLanguage,
          villageTown: user.villageTown,
          address: user.address,
          landmark: user.landmark,
          addresses: user.addresses
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { name, phone, preferredLanguage, villageTown, address, landmark } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        name,
        phone,
        preferredLanguage,
        villageTown,
        address,
        landmark
      }
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          role: updatedUser.role,
          preferredLanguage: updatedUser.preferredLanguage,
          villageTown: updatedUser.villageTown,
          address: updatedUser.address,
          landmark: updatedUser.landmark
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAddresses = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const addresses = await prisma.address.findMany({
      where: { userId: req.user.userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }]
    });

    res.status(200).json({
      success: true,
      data: { addresses }
    });
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { streetAddress, villageTown, landmark, pincode, isDefault } = req.body;

    if (isDefault) {
      // Unset previous defaults
      await prisma.address.updateMany({
        where: { userId: req.user.userId },
        data: { isDefault: false }
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: req.user.userId,
        streetAddress,
        villageTown,
        landmark,
        pincode,
        isDefault: Boolean(isDefault)
      }
    });

    res.status(201).json({
      success: true,
      message: 'Address saved successfully',
      data: { address: newAddress }
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new AppError('Email is required', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      // Don't disclose if email exists
      res.status(200).json({
        success: true,
        message: 'If an account with that email exists, password reset instructions have been generated.'
      });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    resetTokens.set(user.email, { token: resetToken, expiresAt });

    res.status(200).json({
      success: true,
      message: 'Password reset token generated.',
      // In development, return the token directly so user/testers can reset immediately
      data: {
        devResetToken: resetToken,
        expiresInMinutes: 15
      }
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword) {
      throw new AppError('Email, reset token, and new password are required', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const stored = resetTokens.get(normalizedEmail);

    if (!stored || stored.token !== token) {
      throw new AppError('Invalid or expired password reset token', 400);
    }

    if (new Date() > stored.expiresAt) {
      resetTokens.delete(normalizedEmail);
      throw new AppError('Password reset token has expired. Please request a new one.', 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email: normalizedEmail },
      data: { passwordHash }
    });

    resetTokens.delete(normalizedEmail);

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.'
    });
  } catch (error) {
    next(error);
  }
};
