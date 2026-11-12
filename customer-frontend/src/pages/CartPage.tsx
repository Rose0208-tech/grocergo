import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../contexts/CartContext.js';
import { getLocalizedProductName } from '../services/productTranslations.js';

export const CartPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { cart, loading, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 max-w-lg mx-auto my-12 space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-[#218838] mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-[#14532D]">
          {t('cart.empty')}
        </h2>
        <p className="text-xs text-gray-500">
          {t('cart.emptyPrompt')}
        </p>
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-[#218838] hover:bg-[#14532D] text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
        >
          <span>{t('cart.startShopping')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const hasExceedingItems = cart.items.some((i) => i.isExceedingStock);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-[#14532D]">
            {t('cart.title')}
          </h1>
          <p className="text-xs text-gray-500">
            {cart.itemCount} items in your basket
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center space-x-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t('cart.clearCart')}</span>
        </button>
      </div>

      {/* Free delivery progress meter */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <div className="text-xs">
            {cart.amountForFreeDelivery > 0 ? (
              <span className="text-gray-800">
                Add <strong className="text-[#218838]">₹{cart.amountForFreeDelivery}</strong> more to unlock <strong className="text-[#14532D]">FREE Delivery!</strong>
              </span>
            ) : (
              <span className="text-green-800 font-bold">
                🎉 Congratulations! You have unlocked FREE Delivery!
              </span>
            )}
          </div>
        </div>
        <span className="text-xs font-bold text-[#14532D]">
          Threshold: ₹{cart.freeDeliveryThreshold}
        </span>
      </div>

      {/* Exceeding stock warning alert */}
      {hasExceedingItems && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center space-x-2.5 text-xs">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>
            Some items in your cart exceed our current available stock. Please reduce the quantity to proceed to checkout.
          </span>
        </div>
      )}

      {/* Cart Grid: Items table & Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Items list */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
          {cart.items.map((item) => (
            <div key={item.id} className="p-4 sm:p-5 flex items-center space-x-4">
              <img
                src={item.imageUrl || '/placeholder.svg'}
                alt={item.name}
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain p-2 bg-gray-50 rounded-xl border border-gray-100 flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${item.productId}`}
                  className="text-xs sm:text-sm font-bold text-gray-800 hover:text-[#218838] line-clamp-1"
                >
                  {getLocalizedProductName({ sku: item.sku, name: item.name }, i18n.language)}
                </Link>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  Pack: {item.packSize} • ₹{item.price} each
                </div>

                {item.isExceedingStock && (
                  <span className="inline-block text-[10px] text-red-600 font-bold mt-1 bg-red-50 px-1.5 py-0.5 rounded">
                    Only {item.stock} available in stock!
                  </span>
                )}

                <div className="flex sm:hidden items-center justify-between mt-2">
                  <span className="text-xs font-extrabold text-[#14532D]">
                    ₹{item.total}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quantity buttons */}
              <div className="flex items-center border border-gray-200 rounded-xl bg-white">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1.5 text-gray-500 hover:text-gray-800"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-gray-800">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  className="p-1.5 text-gray-500 hover:text-gray-800 disabled:opacity-30"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Item Total (Desktop) */}
              <div className="hidden sm:block text-right min-w-[70px]">
                <span className="text-sm font-extrabold text-[#14532D]">
                  ₹{item.total}
                </span>
              </div>

              {/* Delete button (Desktop) */}
              <button
                onClick={() => removeItem(item.id)}
                className="hidden sm:block text-gray-400 hover:text-red-600 p-1.5 transition-colors"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Right: Order Summary Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-[#14532D]">
            {t('checkout.orderSummary')}
          </h3>

          <div className="space-y-2.5 text-xs text-gray-600 pb-4 border-b border-gray-100">
            <div className="flex justify-between">
              <span>{t('cart.subtotal')}</span>
              <span className="font-bold text-gray-800">₹{cart.subtotal}</span>
            </div>

            {cart.discount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>{t('cart.discount')}</span>
                <span className="font-bold">-₹{cart.discount}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>{t('cart.deliveryCharge')}</span>
              <span className="font-bold">
                {cart.deliveryCharge === 0 ? (
                  <span className="text-green-700 font-bold uppercase">{t('cart.freeDelivery')}</span>
                ) : (
                  `₹${cart.deliveryCharge}`
                )}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-baseline pt-1">
            <span className="text-sm font-bold text-gray-900">{t('cart.total')}</span>
            <span className="text-2xl font-extrabold text-[#14532D]">
              ₹{cart.total}
            </span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            disabled={hasExceedingItems || cart.itemCount === 0}
            className="w-full py-3.5 bg-[#218838] hover:bg-[#14532D] text-white font-extrabold text-xs rounded-2xl shadow-md shadow-green-700/20 flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>{t('cart.proceedToCheckout')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <Link
            to="/products"
            className="block text-center text-xs font-semibold text-gray-500 hover:text-[#218838]"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};
