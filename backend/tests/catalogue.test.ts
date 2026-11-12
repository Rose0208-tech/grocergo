import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Catalogue, Categories & Search API Tests', () => {
  it('should return exactly 20 categories in the system', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.categories.length).toBe(20);
  });

  it('should return translated category names when lang=ta (Tamil) is requested', async () => {
    const res = await request(app).get('/api/categories?lang=ta');
    expect(res.status).toBe(200);
    const vegCategory = res.body.data.categories.find((c: any) => c.slug === 'vegetables');
    expect(vegCategory).toBeDefined();
    expect(vegCategory.name).toBe('காய்கறிகள்');
  });

  it('should return products with pagination and total count equal to 51', async () => {
    const res = await request(app).get('/api/products?limit=60');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.pagination.total).toBe(51);
    expect(res.body.data.products.length).toBe(51);
  });

  it('should filter products by category', async () => {
    const res = await request(app).get('/api/products?category=rice-and-grains');
    expect(res.status).toBe(200);
    expect(res.body.data.products.length).toBeGreaterThanOrEqual(1);
    res.body.data.products.forEach((p: any) => {
      expect(p.category.slug).toBe('rice-and-grains');
    });
  });

  it('should search products by text', async () => {
    const res = await request(app).get('/api/products?search=Rice');
    expect(res.status).toBe(200);
    expect(res.body.data.products.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.products[0].name).toContain('Rice');
  });
});
