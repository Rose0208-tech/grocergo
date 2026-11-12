import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const adminApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('grocergo_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface DashboardData {
  summary: {
    totalProducts: number;
    totalCategories: number;
    totalCustomers: number;
    totalOrders: number;
    pendingOrders: number;
    pendingProofs: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    approvedRevenue: number;
    pendingPaymentAmount: number;
  };
  dailyTrends: Array<{ date: string; orders: number; revenue: number }>;
  recentOrders: any[];
}

export const AdminApiService = {
  // Auth
  login: (credentials: any) => adminApi.post('/auth/login', credentials),
  getMe: () => adminApi.get('/auth/me'),
  logout: () => adminApi.post('/auth/logout'),

  // Dashboard
  getDashboardStats: () => adminApi.get<{ success: boolean; data: DashboardData }>('/admin/dashboard'),

  // Products
  getProducts: (params: any) => adminApi.get('/admin/products', { params }),
  createProduct: (payload: any) => adminApi.post('/admin/products', payload),
  updateProduct: (id: string, payload: any) => adminApi.patch(`/admin/products/${id}`, payload),
  deleteProduct: (id: string) => adminApi.delete(`/admin/products/${id}`),
  uploadProductImage: (formData: FormData) =>
    adminApi.post('/admin/products/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  // Categories
  getCategories: () => adminApi.get('/admin/categories'),
  createCategory: (payload: any) => adminApi.post('/admin/categories', payload),
  updateCategory: (id: string, payload: any) => adminApi.patch(`/admin/categories/${id}`, payload),
  deleteCategory: (id: string) => adminApi.delete(`/admin/categories/${id}`),

  // Orders & Payment Verification
  getOrders: (params?: any) => adminApi.get('/admin/orders', { params }),
  updateOrderStatus: (id: string, payload: { orderStatus: string; note?: string }) =>
    adminApi.patch(`/admin/orders/${id}/status`, payload),
  updatePaymentDecision: (id: string, payload: { status: string; rejectionReason?: string }) =>
    adminApi.patch(`/admin/payments/${id}/status`, payload),

  // Inventory
  getInventory: (filter?: string) => adminApi.get('/admin/inventory', { params: { filter } }),
  adjustStock: (productId: string, payload: { quantityChange: number; reason: string }) =>
    adminApi.post(`/admin/inventory/${productId}/adjust`, payload),

  // Customers & Activity Logs
  getCustomers: () => adminApi.get('/admin/customers'),
  getAuditLogs: (limit?: number) => adminApi.get('/admin/audit-logs', { params: { limit } }),

  // QR Payment Settings
  getPaymentSettings: () => adminApi.get('/payment/settings/active'),
  updatePaymentSettings: (payload: any) => adminApi.put('/payment/settings', payload),
  uploadQrCode: (formData: FormData) =>
    adminApi.post('/payment/settings/qr', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  // Export CSV URL
  getCsvExportUrl: (type: 'orders' | 'inventory') =>
    `${API_BASE_URL}/admin/reports/export-csv?type=${type}`
};

export default adminApi;
