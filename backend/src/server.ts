import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import prisma from './config/prisma.js';

const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, async () => {
  console.log(`===============================================`);
  console.log(` GrocerGo Unified API Server`);
  console.log(` Listening on: http://${HOST}:${PORT}/api`);
  console.log(` Customer Portal Target: http://localhost:5173`);
  console.log(` Admin Portal Target:    http://localhost:5174`);
  console.log(`===============================================`);

  try {
    await prisma.$connect();
    console.log('✓ Connected to Database successfully via Prisma ORM.');
  } catch (err) {
    console.error('✗ Database connection failed:', err);
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Gracefully shutting down GrocerGo API server...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server terminated.');
    process.exit(0);
  });
});
