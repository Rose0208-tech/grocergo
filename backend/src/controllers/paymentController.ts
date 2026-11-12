import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import prisma from '../config/prisma.js';
import { AuthenticatedRequest } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { uploadDirs } from '../config/multer.js';

export const getActivePaymentSettings = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let settings = await prisma.paymentSettings.findUnique({
      where: { id: 'default-settings' }
    });

    if (!settings) {
      settings = await prisma.paymentSettings.create({
        data: {
          id: 'default-settings',
          upiId: 'grocergo@upi',
          accountName: 'GrocerGo Rural Direct',
          instructions: 'Scan QR code using GPay, PhonePe, Paytm, or BHIM. Pay the exact order amount and upload the screenshot with the 12-digit UTR reference.',
          isActive: true
        }
      });
    }

    res.status(200).json({
      success: true,
      data: { settings }
    });
  } catch (error) {
    next(error);
  }
};

export const updatePaymentSettings = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { upiId, accountName, instructions, isActive, qrImageUrl } = req.body;

    const settings = await prisma.paymentSettings.upsert({
      where: { id: 'default-settings' },
      update: {
        upiId,
        accountName,
        instructions,
        ...(qrImageUrl !== undefined ? { qrImageUrl } : {}),
        isActive: isActive !== undefined ? Boolean(isActive) : undefined
      },
      create: {
        id: 'default-settings',
        upiId: upiId || 'grocergo@upi',
        accountName: accountName || 'GrocerGo Rural Direct',
        instructions: instructions || 'Scan QR code and complete payment.',
        qrImageUrl: qrImageUrl || null,
        isActive: isActive !== undefined ? Boolean(isActive) : true
      }
    });

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          userId: req.user.userId,
          action: 'UPDATE_PAYMENT_SETTINGS',
          entity: 'PaymentSettings',
          entityId: settings.id,
          details: JSON.stringify({ upiId, accountName, isActive })
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment settings updated successfully',
      data: { settings }
    });
  } catch (error) {
    next(error);
  }
};

export const uploadQrCodeImage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      throw new AppError('No QR image file was uploaded', 400);
    }

    const qrImageUrl = `/uploads/qr-codes/${req.file.filename}`;

    const settings = await prisma.paymentSettings.upsert({
      where: { id: 'default-settings' },
      update: {
        qrImageUrl
      },
      create: {
        id: 'default-settings',
        qrImageUrl,
        upiId: 'grocergo@upi',
        accountName: 'GrocerGo Rural Direct',
        instructions: 'Scan QR and submit payment screenshot.',
        isActive: true
      }
    });

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          userId: req.user.userId,
          action: 'UPLOAD_QR_CODE',
          entity: 'PaymentSettings',
          entityId: settings.id,
          details: JSON.stringify({ qrImageUrl })
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'QR code uploaded successfully',
      data: { qrImageUrl, settings }
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentProofSecure = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const filename = String(req.params.filename);
    // Sanitize filename to prevent directory traversal
    const safeFilename = path.basename(filename);
    const filePath = path.join(uploadDirs.paymentProofs, safeFilename);

    if (!fs.existsSync(filePath)) {
      throw new AppError('Payment proof image not found', 404);
    }

    // Verify user authorization: find associated proof
    const proof = await prisma.paymentProof.findFirst({
      where: {
        imageUrl: { contains: safeFilename }
      },
      include: { order: true }
    });

    if (req.user.role !== 'ADMIN') {
      if (!proof || proof.order.userId !== req.user.userId) {
        throw new AppError('Access denied: You do not have permission to view this payment proof.', 403);
      }
    }

    res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
};
