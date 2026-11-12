import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';

import authRoutes from './routes/authRoutes.js';
import catalogueRoutes from './routes/catalogueRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { uploadDirs } from './config/multer.js';

const app = express();

// Security and utility middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CUSTOMER_FRONTEND_URL,
  process.env.ADMIN_FRONTEND_URL
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev for smooth local workflow
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id']
  })
);

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static file serving for public product and QR code images
app.use('/uploads/products', express.static(uploadDirs.products));
app.use('/uploads/qr-codes', express.static(uploadDirs.qrCodes));

// API Health Check
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'GrocerGo Backend API'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', catalogueRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Serve built customer-frontend for all non-API web routes
const frontendDist = path.resolve(__dirname, '../../customer-frontend/dist');
const altFrontendDist = path.resolve(process.cwd(), '../customer-frontend/dist');
const localDist = path.resolve(process.cwd(), 'customer-frontend/dist');
const resolvedDist = fs.existsSync(frontendDist)
  ? frontendDist
  : fs.existsSync(altFrontendDist)
  ? altFrontendDist
  : fs.existsSync(localDist)
  ? localDist
  : null;

if (resolvedDist) {
  app.use(express.static(resolvedDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(resolvedDist, 'index.html'));
  });
}

// Centralized error handling
app.use(errorHandler);

export default app;
