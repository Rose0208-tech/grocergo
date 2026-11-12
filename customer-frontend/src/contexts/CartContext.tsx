import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ApiService, CartSummary } from '../services/api.js';

interface CartContextType {
  cart: CartSummary | null;
  loading: boolean;
  refreshCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async (lang?: string) => {
    try {
      const activeLang = lang || localStorage.getItem('grocergo_lang') || 'en';
      const res = await ApiService.getCart(activeLang);
      setCart(res.data.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  }, []);

  useEffect(() => {
    refreshCart();
    const handleLang = (e: any) => {
      refreshCart(e.detail);
    };
    window.addEventListener('grocergo_language_changed', handleLang);
    return () => window.removeEventListener('grocergo_language_changed', handleLang);
  }, [refreshCart]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    setLoading(true);
    try {
      await ApiService.addToCart(productId, quantity);
      await refreshCart();
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await ApiService.updateCartItem(itemId, quantity);
      await refreshCart();
    } catch (err) {
      console.error('Error updating cart quantity:', err);
      throw err;
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await ApiService.removeCartItem(itemId);
      await refreshCart();
    } catch (err) {
      console.error('Error removing item from cart:', err);
    }
  };

  const clearCart = async () => {
    try {
      await ApiService.clearCart();
      await refreshCart();
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        refreshCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
