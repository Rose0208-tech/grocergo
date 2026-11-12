import { describe, it, expect } from 'vitest';
import request from 'supertest';
import path from 'path';
import fs from 'fs';
import app from '../src/app.js';
import prisma from '../src/config/prisma.js';

describe('Comprehensive GrocerGo End-to-End Workflow Test', () => {
  let adminToken: string;
  let customerToken: string;
  let customerId: string;
  let testProductId: string;
  let testProductInitialStock: number;
  let createdOrderId: string;
  let createdOrderNumber: string;

  it('1. Admin logs in successfully', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@grocergo.com',
        password: 'Admin@123'
      });

    expect(res.status).toBe(200);
    expect(res.body.data.user.role).toBe('ADMIN');
    adminToken = res.body.data.token;
    expect(adminToken).toBeDefined();
  });

  it('2. Admin configures QR code settings', async () => {
    const res = await request(app)
      .put('/api/payment/settings')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        upiId: 'grocergo.rural@upi',
        accountName: 'GrocerGo Farmer Collective Direct',
        instructions: 'Pay using PhonePe or GPay and upload screenshot receipt.',
        isActive: true
      });

    expect(res.status).toBe(200);
    expect(res.body.data.settings.upiId).toBe('grocergo.rural@upi');
  });

  it('3. Admin checks products and updates stock', async () => {
    const prodRes = await request(app).get('/api/products?limit=1');
    const product = prodRes.body.data.products[0];
    testProductId = product.id;
    testProductInitialStock = product.stock;

    // Admin updates product
    const updateRes = await request(app)
      .patch(`/api/admin/products/${testProductId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        stock: testProductInitialStock + 10
      });

    expect(updateRes.status).toBe(200);
    testProductInitialStock += 10;
  });

  it('4. Customer registers and logs in', async () => {
    const uniqueEmail = `tamil_customer_${Date.now()}@grocergo.com`;
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Selvi Annamalai',
        email: uniqueEmail,
        phone: `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        password: 'Password@123',
        confirmPassword: 'Password@123',
        preferredLanguage: 'ta',
        villageTown: 'Sulur, Coimbatore',
        address: '88, Anna Nagar Main Road',
        landmark: 'Opposite Primary Health Centre'
      });

    expect(regRes.status).toBe(201);
    customerToken = regRes.body.data.token;
    customerId = regRes.body.data.user.id;
    expect(customerToken).toBeDefined();
  });

  it('5. Customer switches language to Tamil and searches for groceries', async () => {
    const res = await request(app).get('/api/products?search=Tomatoes&lang=ta');
    expect(res.status).toBe(200);
    expect(res.body.data.products.length).toBeGreaterThan(0);
  });

  it('6. Customer adds products to cart and verifies stock limit', async () => {
    // Add valid quantity (2 units)
    const addRes = await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        productId: testProductId,
        quantity: 2
      });

    expect(addRes.status).toBe(200);

    // Try adding quantity exceeding available stock
    const exceedRes = await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        productId: testProductId,
        quantity: 99999
      });

    expect(exceedRes.status).toBe(400);
    expect(exceedRes.body.message).toContain('available in stock');
  });

  it('7. Customer places an order', async () => {
    const orderRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        customerName: 'Selvi Annamalai',
        customerPhone: '+91 9842109876',
        deliveryAddress: '88, Anna Nagar Main Road',
        villageTown: 'Sulur, Coimbatore',
        landmark: 'Opposite Primary Health Centre',
        notes: 'Call before delivery please'
      });

    expect(orderRes.status).toBe(201);
    expect(orderRes.body.success).toBe(true);
    createdOrderId = orderRes.body.data.order.id;
    createdOrderNumber = orderRes.body.data.order.orderNumber;
    expect(orderRes.body.data.order.paymentStatus).toBe('Awaiting Payment');
    expect(orderRes.body.data.order.orderStatus).toBe('Pending Confirmation');

    // Verify stock was deducted by 2
    const checkProduct = await prisma.product.findUnique({ where: { id: testProductId } });
    expect(checkProduct!.stock).toBe(testProductInitialStock - 2);
  });

  it('8. Customer uploads payment screenshot proof and UTR reference', async () => {
    // Create temporary dummy image buffer for upload test
    const dummyImagePath = path.join(process.cwd(), 'tests', 'dummy_receipt.png');
    fs.writeFileSync(dummyImagePath, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64'));

    const uploadRes = await request(app)
      .post(`/api/orders/${createdOrderId}/payment-proof`)
      .set('Authorization', `Bearer ${customerToken}`)
      .field('transactionRef', 'UPI2026102912345678')
      .attach('proofImage', dummyImagePath);

    if (fs.existsSync(dummyImagePath)) {
      fs.unlinkSync(dummyImagePath);
    }

    expect(uploadRes.status).toBe(200);
    expect(uploadRes.body.success).toBe(true);
    expect(uploadRes.body.data.proof.transactionRef).toBe('UPI2026102912345678');

    // Order payment status should now be "Proof Submitted"
    const orderCheck = await prisma.order.findUnique({ where: { id: createdOrderId } });
    expect(orderCheck!.paymentStatus).toBe('Proof Submitted');
  });

  it('9. Admin sees the order and reviews the proof', async () => {
    const adminOrdersRes = await request(app)
      .get(`/api/admin/orders?search=${createdOrderNumber}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(adminOrdersRes.status).toBe(200);
    expect(adminOrdersRes.body.data.orders.length).toBe(1);
    const order = adminOrdersRes.body.data.orders[0];
    expect(order.paymentStatus).toBe('Proof Submitted');
    expect(order.paymentProofs.length).toBeGreaterThan(0);
    expect(order.paymentProofs[0].transactionRef).toBe('UPI2026102912345678');
  });

  it('10. Admin approves payment proof and order advances to Confirmed', async () => {
    const decisionRes = await request(app)
      .patch(`/api/admin/payments/${createdOrderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'Approved'
      });

    expect(decisionRes.status).toBe(200);
    expect(decisionRes.body.success).toBe(true);

    // Verify in database
    const verifiedOrder = await prisma.order.findUnique({ where: { id: createdOrderId } });
    expect(verifiedOrder!.paymentStatus).toBe('Approved');
    expect(verifiedOrder!.orderStatus).toBe('Confirmed');
  });

  it('11. Customer sees updated Approved payment status and Confirmed order status', async () => {
    const custOrderRes = await request(app)
      .get(`/api/orders/${createdOrderId}`)
      .set('Authorization', `Bearer ${customerToken}`);

    expect(custOrderRes.status).toBe(200);
    expect(custOrderRes.body.data.order.paymentStatus).toBe('Approved');
    expect(custOrderRes.body.data.order.orderStatus).toBe('Confirmed');
  });

  it('12. Privacy Isolation: Another customer cannot access this order (HTTP 403)', async () => {
    // Register another customer
    const anotherCustomerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Another Customer',
        email: `other_${Date.now()}@test.com`,
        phone: `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        password: 'Password@123',
        confirmPassword: 'Password@123'
      });

    const otherToken = anotherCustomerRes.body.data.token;

    const intrusionAttempt = await request(app)
      .get(`/api/orders/${createdOrderId}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(intrusionAttempt.status).toBe(403);
    expect(intrusionAttempt.body.message).toContain('Access denied');
  });
});
