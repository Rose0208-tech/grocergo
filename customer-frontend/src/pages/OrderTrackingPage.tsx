import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  Check,
  AlertCircle,
  ArrowLeft,
  XCircle,
  Upload
} from 'lucide-react';
import { ApiService, Order } from '../services/api.js';

const ORDER_STEPS = [
  'Pending Confirmation',
  'Confirmed',
  'Preparing',
  'Ready for Pickup',
  'Out for Delivery',
  'Delivered'
];

export const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { t } = useTranslation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        const res = await ApiService.getOrderById(orderId);
        setOrder(res.data.data.order);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!orderId || !window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      await ApiService.cancelOrder(orderId);
      setCancelMessage('Order cancelled successfully.');
      const res = await ApiService.getOrderById(orderId);
      setOrder(res.data.data.order);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <div className="h-96 bg-white rounded-3xl animate-pulse" />;
  }

  if (!order) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center">
        <h2 className="text-lg font-bold text-gray-800">Order not found</h2>
        <Link to="/orders" className="text-xs text-[#218838] font-bold mt-2 inline-block">
          Back to My Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = ORDER_STEPS.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'Cancelled';
  const latestProof = order.paymentProofs && order.paymentProofs[0];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        to="/orders"
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#218838] hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to My Orders</span>
      </Link>

      {/* Header Card */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Order Status & Timeline
          </span>
          <h1 className="text-2xl font-extrabold text-[#14532D]">
            Order #{order.orderNumber}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="text-right sm:text-right">
          <div className="text-xs text-gray-500">Order Total</div>
          <div className="text-2xl font-extrabold text-[#14532D]">₹{order.total}</div>
        </div>
      </div>

      {cancelMessage && (
        <div className="bg-green-50 text-green-800 border border-green-200 p-4 rounded-2xl text-xs font-bold">
          {cancelMessage}
        </div>
      )}

      {/* Payment Verification Card */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-3">
        <h3 className="text-sm font-extrabold text-gray-900 flex items-center space-x-2">
          <span>Manual UPI Payment Status:</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              order.paymentStatus === 'Approved'
                ? 'bg-green-100 text-green-800'
                : order.paymentStatus === 'Rejected'
                ? 'bg-red-100 text-red-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {order.paymentStatus}
          </span>
        </h3>

        {order.paymentStatus === 'Approved' && (
          <p className="text-xs text-green-800 bg-green-50 p-3 rounded-xl border border-green-200">
            ✓ Your manual payment proof has been verified and approved by the administrator. Your groceries are being processed.
          </p>
        )}

        {(order.paymentStatus === 'Proof Submitted' || order.paymentStatus === 'Under Verification') && (
          <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
            ⏳ Your screenshot has been received and is currently under review by the store administrator.
          </p>
        )}

        {order.paymentStatus === 'Rejected' && (
          <div className="bg-red-50 text-red-800 p-3.5 rounded-xl border border-red-200 text-xs space-y-2">
            <p className="font-bold">
              Payment was not approved: {latestProof?.rejectionReason || 'Receipt was unclear or transaction mismatch.'}
            </p>
            <Link
              to={`/payment/${order.id}`}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-red-600 text-white font-bold rounded-lg"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Re-upload Payment Proof</span>
            </Link>
          </div>
        )}

        {order.paymentStatus === 'Awaiting Payment' && (
          <div className="bg-amber-50 text-amber-800 p-3.5 rounded-xl border border-amber-200 text-xs space-y-2 flex justify-between items-center">
            <span>Payment has not been completed yet.</span>
            <Link
              to={`/payment/${order.id}`}
              className="px-3.5 py-1.5 bg-[#218838] text-white font-bold rounded-lg"
            >
              Complete Payment / COD
            </Link>
          </div>
        )}
      </div>

      {/* Timeline Steps (Unless Cancelled) */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-sm font-extrabold text-gray-900">
          Delivery Journey
        </h3>

        {isCancelled ? (
          <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl text-center space-y-2">
            <XCircle className="w-8 h-8 text-gray-400 mx-auto" />
            <h4 className="font-bold text-gray-800 text-sm">Order Cancelled</h4>
            <p className="text-xs text-gray-500">This order has been cancelled and stock was restored.</p>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
            {ORDER_STEPS.map((step, idx) => {
              const isPastOrCurrent = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div key={step} className="relative flex items-center space-x-3">
                  <div
                    className={`absolute -left-[30px] sm:-left-[38px] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                      isPastOrCurrent
                        ? 'bg-[#218838] border-white text-white shadow-sm'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {isPastOrCurrent ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <div>
                    <h4
                      className={`text-xs sm:text-sm font-bold ${
                        isCurrent
                          ? 'text-[#218838]'
                          : isPastOrCurrent
                          ? 'text-gray-900'
                          : 'text-gray-400'
                      }`}
                    >
                      {step}
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] text-green-700 font-medium">
                        Current Stage
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cancellation button if order is in Pending or Confirmed state */}
        {!isCancelled && ['Pending Confirmation', 'Confirmed'].includes(order.orderStatus) && (
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          </div>
        )}
      </div>

      {/* Items Breakdown */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-gray-900">Ordered Items</h3>
        <div className="divide-y divide-gray-100 text-xs">
          {order.items?.map((it) => (
            <div key={it.id} className="py-2.5 flex justify-between items-center">
              <div>
                <span className="font-bold text-gray-800">{it.productName}</span>
                <span className="text-gray-400 ml-2">({it.packSize})</span>
                <div className="text-[10px] text-gray-500">
                  {it.quantity} x ₹{it.price}
                </div>
              </div>
              <span className="font-extrabold text-gray-900">₹{it.total}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
