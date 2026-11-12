import axios from 'axios';

// Unified API base URL routed cleanly via Vite proxy
const getApiBaseUrl = (): string => {
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

// Generate or fetch persistent guest session ID
function getSessionId(): string {
  let sessionId = localStorage.getItem('grocergo_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('grocergo_session_id', sessionId);
  }
  return sessionId;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('grocergo_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['x-session-id'] = getSessionId();
  return config;
});

export interface Category {
  id: string;
  name: string;
  originalName: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  productCount: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  originalName: string;
  slug: string;
  description: string;
  categoryId: string;
  category?: { id: string; name: string; slug: string };
  price: number;
  originalPrice?: number;
  discountPercent: number;
  unit: string;
  packSize: string;
  stock: number;
  imageUrl?: string;
  isFeatured: boolean;
  isActive: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  sku: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountPercent: number;
  unit: string;
  packSize: string;
  imageUrl?: string;
  stock: number;
  quantity: number;
  isAvailable: boolean;
  isExceedingStock: boolean;
  total: number;
}

export interface CartSummary {
  cartId: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  freeDeliveryThreshold: number;
  amountForFreeDelivery: number;
  total: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  preferredLanguage: string;
  villageTown?: string;
  address?: string;
  landmark?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  paymentMethod?: string;
  paymentStatus: string;
  orderStatus: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  villageTown?: string;
  landmark?: string;
  notes?: string;
  createdAt: string;
  items?: Array<{
    id: string;
    productName: string;
    unit: string;
    packSize: string;
    price: number;
    quantity: number;
    total: number;
  }>;
  paymentProofs?: Array<{
    id: string;
    imageUrl: string;
    transactionRef?: string;
    status: string;
    rejectionReason?: string;
    createdAt: string;
  }>;
  statusHistory?: Array<{
    id: string;
    fromStatus: string;
    toStatus: string;
    note?: string;
    createdAt: string;
  }>;
}

// API Methods
export const ApiService = {
  // Categories & Products
  getCategories: (lang: string = 'en') =>
    api.get<{ success: boolean; data: { categories: Category[] } }>(`/categories?lang=${lang}`),

  getProducts: (params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    featured?: boolean;
    inStock?: boolean;
    sortBy?: string;
    lang?: string;
  }) => api.get<{ success: boolean; data: { products: Product[]; pagination: any } }>('/products', { params }),

  getProductById: (id: string, lang: string = 'en') =>
    api.get<{ success: boolean; data: { product: Product } }>(`/products/${id}?lang=${lang}`),

  // Cart
  getCart: (lang?: string) => api.get<{ success: boolean; data: CartSummary }>(`/cart${lang ? `?lang=${lang}` : ''}`),
  addToCart: (productId: string, quantity: number = 1) =>
    api.post('/cart/items', { productId, quantity }),
  updateCartItem: (itemId: string, quantity: number) =>
    api.patch(`/cart/items/${itemId}`, { quantity }),
  removeCartItem: (itemId: string) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart'),

  // Orders & Payment
  createOrder: (payload: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    villageTown?: string;
    landmark?: string;
    notes?: string;
    paymentMethod?: string;
  }) => api.post<{ success: boolean; data: { order: Order } }>('/orders', payload),

  getMyOrders: () => api.get<{ success: boolean; data: { orders: Order[] } }>('/orders/my'),
  getOrderById: (id: string) => api.get<{ success: boolean; data: { order: Order } }>(`/orders/${id}`),

  getActivePaymentSettings: () =>
    api.get<{ success: boolean; data: { settings: any } }>('/payment/settings/active'),

  confirmOrder: (orderId: string) =>
    api.post<{ success: boolean; message: string; data: { order: Order } }>(`/orders/${orderId}/confirm`),

  switchToCod: (orderId: string) =>
    api.post<{ success: boolean; message: string; data: { order: Order } }>(`/orders/${orderId}/switch-to-cod`),

  uploadPaymentProof: (orderId: string, formData: FormData) =>
    api.post<{ success: boolean; data: { proof: any } }>(`/orders/${orderId}/payment-proof`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  cancelOrder: (orderId: string) => api.patch(`/orders/${orderId}/cancel`),

  // Auth
  register: (payload: any) => api.post('/auth/register', payload),
  login: (payload: any) => api.post('/auth/login', payload),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get<{ success: boolean; data: { user: UserProfile } }>('/auth/me'),
  updateProfile: (payload: any) => api.patch('/auth/profile', payload),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (payload: any) => api.post('/auth/reset-password', payload)
};

export default api;
