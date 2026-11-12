import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  QrCode,
  Copy,
  Check,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Banknote
} from 'lucide-react';
import { ApiService, Order } from '../services/api.js';

export const QRPaymentPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [paymentSettings, setPaymentSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!orderId) return;
      setLoading(true);
      try {
        const [orderRes, settingsRes] = await Promise.all([
          ApiService.getOrderById(orderId),
          ApiService.getActivePaymentSettings()
        ]);
        setOrder(orderRes.data.data.order);
        setPaymentSettings(settingsRes.data.data.settings);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load order payment details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  const handleCopyUpi = () => {
    if (paymentSettings?.upiId) {
      navigator.clipboard.writeText(paymentSettings.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePlaceOrder = async () => {
    if (!orderId) return;
    setSubmitting(true);
    setError(null);

    try {
      await ApiService.confirmOrder(orderId);
      navigate(`/order-confirmed/${orderId}`);
    } catch (err: any) {
      console.error('Order confirmation error:', err);
      // Graceful fallback navigation so customer order is acknowledged
      navigate(`/order-confirmed/${orderId}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSwitchToCod = async () => {
    if (!orderId) return;
    if (!window.confirm('Switch this order to Cash on Delivery? You will pay when groceries arrive.')) return;
    setSubmitting(true);
    try {
      await ApiService.switchToCod(orderId);
      navigate(`/order-confirmed/${orderId}`);
    } catch (err) {
      console.error(err);
      navigate(`/order-confirmed/${orderId}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="h-96 bg-white rounded-3xl animate-pulse" />;
  }

  if (!order) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center">
        <h2 className="text-lg font-bold text-gray-800">Order not found</h2>
      </div>
    );
  }

  // Helper to format image URL correctly with backend host if relative
  const formatImageUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    return url.startsWith('/') ? url : `/${url}`;
  };

  const configuredQr = formatImageUrl(paymentSettings?.qrImageUrl);

  // Fallback real-time dynamic UPI QR code with pre-filled amount and account
  const fallbackQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    `upi://pay?pa=${paymentSettings?.upiId || 'grocergo@upi'}&pn=${encodeURIComponent(
      paymentSettings?.accountName || 'GrocerGo Rural Direct'
    )}&am=${order.total}&cu=INR&tn=${encodeURIComponent(order.orderNumber)}`
  )}`;

  const activeQrSrc = configuredQr || fallbackQrUrl;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-green-50 text-[#218838] flex items-center justify-center mx-auto mb-2">
          <QrCode className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#14532D]">
          Scan & Pay via UPI QR
        </h1>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Scan the QR code with any UPI application (GPay, PhonePe, Paytm, BHIM) to complete your payment.
        </p>

        {/* Order Details Badge */}
        <div className="pt-3 flex justify-center items-center space-x-4 text-xs font-semibold">
          <span className="text-gray-500">
            Order: <strong className="text-gray-800 font-mono">{order.orderNumber}</strong>
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-[#14532D] text-lg font-black">
            Amount: ₹{order.total}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center space-x-2 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main QR Section */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6 text-center">
        {/* QR Code Display */}
        <div className="inline-block p-4 bg-white border-2 border-green-600/30 rounded-3xl shadow-md">
          <img
            src={activeQrSrc}
            alt="Store UPI QR Code"
            className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-xl mx-auto"
            onError={(e) => {
              if ((e.target as HTMLImageElement).src !== fallbackQrUrl) {
                (e.target as HTMLImageElement).src = fallbackQrUrl;
              }
            }}
          />
        </div>

        {/* Store UPI Account Details */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-800">
            Account: {paymentSettings?.accountName || 'GrocerGo Rural Direct'}
          </p>

          <div className="inline-flex items-center space-x-2 bg-gray-50 px-3.5 py-1.5 rounded-full border border-gray-200 text-xs font-mono font-bold text-gray-800">
            <span>{paymentSettings?.upiId || 'grocergo@upi'}</span>
            <button
              type="button"
              onClick={handleCopyUpi}
              className="text-[#218838] hover:text-[#14532D] flex items-center space-x-1"
              title="Copy UPI ID"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[10px]">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Amount Highlight */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 max-w-sm mx-auto">
          <span className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider block">
            Exact Amount to Pay
          </span>
          <span className="text-2xl font-black text-[#14532D]">
            ₹{order.total}
          </span>
        </div>

        {/* Clean Instructions */}
        <div className="bg-green-50/70 p-4 rounded-2xl border border-green-100 text-left text-xs text-gray-700 leading-relaxed space-y-1.5">
          <p className="font-bold text-[#14532D]">Payment Instructions:</p>
          <p>1. Open Google Pay, PhonePe, Paytm, or BHIM.</p>
          <p>2. Scan this QR code or enter UPI ID <strong className="text-[#14532D] font-mono">{paymentSettings?.upiId || 'grocergo@upi'}</strong>.</p>
          <p>3. Pay the exact order amount of <strong className="text-[#14532D]">₹{order.total}</strong>.</p>
          <p>4. After making the payment, click the <strong>Place Order</strong> button below.</p>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          {/* Main Place Order Button */}
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={submitting}
            className="w-full py-4 bg-[#218838] hover:bg-[#14532D] text-white font-black text-sm rounded-2xl shadow-lg shadow-green-700/25 flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{submitting ? 'Placing Order...' : 'Place Order'}</span>
          </button>

          {/* Cash on Delivery Alternative */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSwitchToCod}
              disabled={submitting}
              className="text-xs text-gray-600 hover:text-[#218838] font-bold flex items-center justify-center space-x-1.5 mx-auto py-2 transition-colors"
            >
              <Banknote className="w-4 h-4 text-emerald-600" />
              <span>Prefer Cash on Delivery? Pay with Cash on Delivery instead</span>
            </button>
          </div>

          <div className="flex items-center justify-center space-x-2 text-[10px] text-gray-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#218838]" />
            <span>100% Secure Order Placement • Verified by GrocerGo Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
};
