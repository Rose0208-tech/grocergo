import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Package, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { ApiService, Order } from '../services/api.js';

export const MyOrdersPage: React.FC = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await ApiService.getMyOrders();
        setOrders(res.data.data.orders);
      } catch (err) {
        console.error('Error fetching my orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#14532D]">
          {t('nav.myOrders')}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Review your order history, verification statuses, and delivery tracking
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
          <div className="w-12 h-12 rounded-full bg-green-50 text-[#218838] flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-800">No orders placed yet</h3>
          <p className="text-xs text-gray-500">
            You haven't placed any grocery orders yet. Start exploring our farm-fresh catalog.
          </p>
          <Link
            to="/products"
            className="inline-block mt-2 px-5 py-2.5 bg-[#218838] hover:bg-[#14532D] text-white text-xs font-bold rounded-xl"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-sm text-[#14532D]">
                    {ord.orderNumber}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="text-xs text-gray-500">
                  {ord.items?.length || 0} items • Total:{' '}
                  <strong className="text-gray-900 font-extrabold text-sm">
                    ₹{ord.total}
                  </strong>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2 text-[10px]">
                  <span
                    className={`px-2 py-0.5 rounded font-bold ${
                      ord.paymentStatus === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : ord.paymentStatus === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Payment: {ord.paymentStatus}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded font-bold ${
                      ord.orderStatus === 'Delivered'
                        ? 'bg-green-100 text-green-800'
                        : ord.orderStatus === 'Cancelled'
                        ? 'bg-gray-200 text-gray-700'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    Order: {ord.orderStatus}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2 sm:pt-0">
                {ord.paymentStatus === 'Awaiting Payment' && (
                  <Link
                    to={`/payment/${ord.id}`}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl"
                  >
                    Upload QR Proof
                  </Link>
                )}
                <Link
                  to={`/orders/${ord.id}`}
                  className="px-4 py-2 bg-[#218838] hover:bg-[#14532D] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors"
                >
                  <span>Track Order</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
