import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Authentication & Access Separation API Tests', () => {
  const testCustomerEmail = `customer_${Date.now()}@test.com`;

  it('should register a new customer successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Murugan Test',
        email: testCustomerEmail,
        phone: `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        password: 'Password@123',
        confirmPassword: 'Password@123',
        preferredLanguage: 'ta',
        villageTown: 'Pollachi',
        address: '45, Coconut Farm Road',
        landmark: 'Near Water Tank'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testCustomerEmail);
    expect(res.body.data.user.role).toBe('CUSTOMER');
    expect(res.body.data.token).toBeDefined();
  });

  it('should reject registration if email is already registered', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Duplicate Murugan',
        email: testCustomerEmail,
        phone: '+91 9999999999',
        password: 'Password@123',
        confirmPassword: 'Password@123'
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should authenticate admin user and grant admin token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@grocergo.com',
        password: 'Admin@123'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('ADMIN');
    expect(res.body.data.token).toBeDefined();
  });

  it('should deny regular customer access to admin routes (HTTP 403)', async () => {
    // 1. Log in as customer
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: testCustomerEmail,
        password: 'Password@123'
      });

    const customerToken = loginRes.body.data.token;

    // 2. Try accessing admin dashboard
    const adminRes = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(adminRes.status).toBe(403);
    expect(adminRes.body.success).toBe(false);
  });
});
