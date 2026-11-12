import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminApiService } from '../services/adminApi.js';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('grocergo_admin_token');
    if (!token) {
      setAdminUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await AdminApiService.getMe();
      const user = res.data.data.user;
      if (user.role === 'ADMIN') {
        setAdminUser(user);
      } else {
        localStorage.removeItem('grocergo_admin_token');
        setAdminUser(null);
      }
    } catch {
      localStorage.removeItem('grocergo_admin_token');
      setAdminUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: any) => {
    const res = await AdminApiService.login(credentials);
    const { token, user } = res.data.data;
    if (user.role !== 'ADMIN') {
      throw new Error('Access denied: Only administrator accounts can access this portal.');
    }
    localStorage.setItem('grocergo_admin_token', token);
    setAdminUser(user);
  };

  const logout = async () => {
    try {
      await AdminApiService.logout();
    } catch {}
    localStorage.removeItem('grocergo_admin_token');
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
