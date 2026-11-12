import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { ApiService, Order } from '../services/api.js';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-xl mx-auto space-y-6 text-center my-6">
      <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 shadow-sm space-y-5">
        <div className="w-16 h-16 rounded-full bg-green-100 text-[#218838] flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#218838]">
            Order Successfully Placed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14532D] mt-1">
            Thank You for Your Order!
          </h1>
          <p className="text-xs text-gray-500 mt-2 max-w-sm mx-auto">
            {order?.paymentMethod === 'Cash on Delivery' || order?.paymentStatus === 'Cash on Delivery'
              ? 'Your order has been confirmed with Cash on Delivery. Please keep the exact amount ready when your delivery arrives.'
              : 'Your order has been placed successfully via UPI QR. Our team is packing your fresh essentials for prompt delivery.'}
          </p>
        </div>

        {order && (
          <div className="bg-gray-50 rounded-2xl p-4 text-xs space-y-2 border border-gray-100 text-left">
            <div className="flex justify-between">
              <span className="text-gray-500">Order Number:</span>
              <strong className="text-gray-800 font-mono">{order.orderNumber}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Order Total:</span>
              <strong className="text-[#14532D] font-extrabold text-sm">₹{order.total}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Payment Method:</span>
              <span className="bg-emerald-50 text-[#218838] border border-emerald-200 px-2 py-0.5 rounded font-extrabold">
                {order.paymentMethod || 'UPI QR'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Payment Status:</span>
              <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-bold">
                {order.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Order Status:</span>
              <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded font-bold">
                {order.orderStatus}
              </span>
            </div>
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            to={`/orders/${orderId}`}
            className="flex-1 py-3 px-4 bg-[#218838] hover:bg-[#14532D] text-white text-xs font-extrabold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            <Package className="w-4 h-4" />
            <span>Track Order Timeline</span>
          </Link>
          <Link
            to="/products"
            className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};
