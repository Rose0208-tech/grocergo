import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

const baseUploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

// Ensure subdirectories exist
export const uploadDirs = {
  products: path.join(baseUploadDir, 'products'),
  qrCodes: path.join(baseUploadDir, 'qr-codes'),
  paymentProofs: path.join(baseUploadDir, 'payment-proofs')
};

Object.values(uploadDirs).forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storageFor = (subDir: string) =>
  multer.diskStorage({
    destination: (_req: Request, _file: Express.Multer.File, cb) => {
      cb(null, subDir);
    },
    filename: (_req: Request, file: Express.Multer.File, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const safeName = `${uuidv4()}${ext}`;
      cb(null, safeName);
    }
  });

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
  }
};

const limits = {
  fileSize: 5 * 1024 * 1024 // 5 MB
};

export const uploadProductImage = multer({
  storage: storageFor(uploadDirs.products),
  fileFilter,
  limits
});

export const uploadQrImage = multer({
  storage: storageFor(uploadDirs.qrCodes),
  fileFilter,
  limits
});

export const uploadPaymentProof = multer({
  storage: storageFor(uploadDirs.paymentProofs),
  fileFilter,
  limits
});
