import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AdminAuthProvider, useAdminAuth } from './contexts/AdminAuthContext.js';
import { AdminLayout } from './components/AdminLayout.js';

import { DashboardPage } from './pages/DashboardPage.js';
import { ProductsPage } from './pages/ProductsPage.js';
import { CategoriesPage } from './pages/CategoriesPage.js';
import { InventoryPage } from './pages/InventoryPage.js';
import { OrdersPage } from './pages/OrdersPage.js';
import { PaymentVerificationPage } from './pages/PaymentVerificationPage.js';
import { CustomersPage } from './pages/CustomersPage.js';
import { QRSettingsPage } from './pages/QRSettingsPage.js';
import { ReportsPage } from './pages/ReportsPage.js';
import { ActivityLogsPage } from './pages/ActivityLogsPage.js';
import { AdminLoginPage } from './pages/AdminLoginPage.js';

// Route guard requiring authenticated admin user
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { adminUser, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F291E] flex items-center justify-center text-white text-xs font-bold">
        Loading GrocerGo Console...
      </div>
    );
  }

  if (!adminUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          <Route path="/login" element={<AdminLoginPage />} />

          <Route
            path="/"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="payments" element={<PaymentVerificationPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="qr-settings" element={<QRSettingsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="activity-logs" element={<ActivityLogsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
};

export default App;
