import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, User, FileText, ArrowRight, ShieldCheck, AlertCircle, Banknote, QrCode } from 'lucide-react';
import { ApiService } from '../services/api.js';
import { useCart } from '../contexts/CartContext.js';
import { useAuth } from '../contexts/AuthContext.js';

export const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [villageTown, setVillageTown] = useState('');
  const [landmark, setLandmark] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Cash on Delivery'>('UPI');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill fields if customer is logged in
  useEffect(() => {
    if (user) {
      setCustomerName(user.name || '');
      setCustomerPhone(user.phone || '');
      setDeliveryAddress(user.address || '');
      setVillageTown(user.villageTown || '');
      setLandmark(user.landmark || '');
    }
  }, [user]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !deliveryAddress) {
      setError('Please fill in your name, contact phone, and delivery address.');
      return;
    }

    if (!user) {
      // Prompt user to login or register first so order is safely associated with their account
      navigate('/login?redirect=/checkout');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await ApiService.createOrder({
        customerName,
        customerPhone,
        deliveryAddress,
        villageTown,
        landmark,
        notes,
        paymentMethod
      });

      const order = res.data.data.order;
      await refreshCart();
      if (paymentMethod === 'Cash on Delivery') {
        navigate(`/order-confirmed/${order.id}`);
      } else {
        navigate(`/payment/${order.id}`);
      }
    } catch (err: any) {
      console.error('Order creation error:', err);
      setError(
        err.response?.data?.message ||
          'Failed to place order. Please review your cart items and stock availability.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto">
        <p className="text-sm text-gray-600 mb-4">Your cart is empty.</p>
        <Link to="/products" className="px-4 py-2 bg-[#218838] text-white rounded-xl text-xs font-bold">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#14532D]">
          {t('checkout.title')}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Provide your local delivery address and contact details
        </p>
      </div>

      {!user && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between text-xs text-amber-800">
          <span>You need to be logged in to complete your checkout and track your order.</span>
          <Link
            to="/login?redirect=/checkout"
            className="px-3 py-1.5 bg-[#218838] text-white font-bold rounded-lg shadow-sm"
          >
            Log In Now
          </Link>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center space-x-2 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Customer & Address Details */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-5">
          <h2 className="text-base font-extrabold text-gray-900 pb-2 border-b border-gray-100 flex items-center space-x-2">
            <User className="w-4 h-4 text-[#218838]" />
            <span>{t('checkout.contactInfo')}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {t('checkout.fullName')} *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#218838] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {t('checkout.mobileNumber')} *
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="e.g. +91 9876543210"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#218838] focus:outline-none"
              />
            </div>
          </div>

          <h2 className="text-base font-extrabold text-gray-900 pt-4 pb-2 border-b border-gray-100 flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-[#218838]" />
            <span>Delivery Destination</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {t('checkout.deliveryAddress')} *
              </label>
              <textarea
                required
                rows={2}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="House number, Street name, Village or Ward"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#218838] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {t('checkout.town')}
                </label>
                <input
                  type="text"
                  value={villageTown}
                  onChange={(e) => setVillageTown(e.target.value)}
                  placeholder="e.g. Perur, Coimbatore"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#218838] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {t('checkout.landmark')}
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Murugan Temple / Water Tank"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#218838] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {t('checkout.notes')}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Call when entering the village"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#218838] focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <h2 className="text-base font-extrabold text-gray-900 pt-4 pb-2 border-b border-gray-100 flex items-center space-x-2">
            <Banknote className="w-4 h-4 text-[#218838]" />
            <span>Select Payment Method</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <label
              onClick={() => setPaymentMethod('UPI')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
                paymentMethod === 'UPI'
                  ? 'border-[#218838] bg-green-50/50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === 'UPI'}
                onChange={() => setPaymentMethod('UPI')}
                className="mt-1 text-[#218838] focus:ring-[#218838]"
              />
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5">
                  <QrCode className="w-4 h-4 text-[#218838]" />
                  <span className="text-xs font-black text-gray-900">UPI / QR Code</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Instant scan & pay via GPay, PhonePe, Paytm, or BHIM.
                </p>
              </div>
            </label>

            <label
              onClick={() => setPaymentMethod('Cash on Delivery')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
                paymentMethod === 'Cash on Delivery'
                  ? 'border-[#218838] bg-green-50/50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === 'Cash on Delivery'}
                onChange={() => setPaymentMethod('Cash on Delivery')}
                className="mt-1 text-[#218838] focus:ring-[#218838]"
              />
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5">
                  <Banknote className="w-4 h-4 text-[#218838]" />
                  <span className="text-xs font-black text-gray-900">Cash on Delivery (COD)</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Pay cash at your doorstep when your groceries are delivered.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4 h-fit">
          <h3 className="font-extrabold text-base text-[#14532D]">
            {t('checkout.orderSummary')}
          </h3>

          <div className="max-h-48 overflow-y-auto divide-y divide-gray-100 text-xs">
            {cart.items.map((it) => (
              <div key={it.id} className="py-2 flex justify-between">
                <div>
                  <span className="font-semibold text-gray-800">{it.name}</span>
                  <div className="text-[10px] text-gray-400">
                    {it.quantity} x ₹{it.price}
                  </div>
                </div>
                <span className="font-bold text-gray-900">₹{it.total}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold">₹{cart.subtotal}</span>
            </div>
            {cart.discount > 0 && (
              <div className="flex justify-between text-green-700 font-bold">
                <span>Discount</span>
                <span>-₹{cart.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span className="font-bold">
                {cart.deliveryCharge === 0 ? 'FREE' : `₹${cart.deliveryCharge}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-[#14532D] pt-2 border-t border-gray-100">
              <span>Total Payable</span>
              <span>₹{cart.total}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#218838] hover:bg-[#14532D] text-white font-extrabold text-xs rounded-2xl shadow-md shadow-green-700/20 flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <span>
              {loading
                ? t('checkout.placingOrder')
                : paymentMethod === 'Cash on Delivery'
                ? 'Place Order (Cash on Delivery)'
                : 'Proceed to UPI Payment'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2 text-[10px] text-gray-500 pt-2 text-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-[#218838]" />
            <span>Manual UPI QR Verification • No Card/PIN Needed</span>
          </div>
        </div>
      </form>
    </div>
  );
};
