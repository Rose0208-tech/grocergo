import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiService, UserProfile } from '../services/api.js';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (payload: any) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const token = localStorage.getItem('grocergo_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await ApiService.getMe();
      setUser(res.data.data.user);
    } catch {
      localStorage.removeItem('grocergo_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: any) => {
    const res = await ApiService.login(credentials);
    const { token, user: loggedUser } = res.data.data;
    localStorage.setItem('grocergo_token', token);
    setUser(loggedUser);
  };

  const register = async (payload: any) => {
    const res = await ApiService.register(payload);
    const { token, user: registeredUser } = res.data.data;
    localStorage.setItem('grocergo_token', token);
    setUser(registeredUser);
  };

  const logout = async () => {
    try {
      await ApiService.logout();
    } catch {}
    localStorage.removeItem('grocergo_token');
    setUser(null);
  };

  const updateProfile = async (payload: any) => {
    const res = await ApiService.updateProfile(payload);
    setUser(res.data.data.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
