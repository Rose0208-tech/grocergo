import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  X,
  AlertCircle
} from 'lucide-react';
import { AdminApiService } from '../services/adminApi.js';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  // Selected Order Detail Drawer/Modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [newOrderStatus, setNewOrderStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await AdminApiService.getOrders({
        search: search || undefined,
        orderStatus: orderStatus || undefined,
        paymentStatus: paymentStatus || undefined
      });
      setOrders(res.data.data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, orderStatus, paymentStatus]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    try {
      await AdminApiService.updateOrderStatus(selectedOrder.id, {
        orderStatus: newOrderStatus,
        note: statusNote || undefined
      });
      setMessage(`Order status updated to "${newOrderStatus}".`);
      fetchOrders();
      setSelectedOrder(null);
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update order status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const openDrawer = (ord: any) => {
    setSelectedOrder(ord);
    setNewOrderStatus(ord.orderStatus);
    setStatusNote('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Order Management
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review customer delivery details, itemized snapshots, and advance order fulfilment stages
        </p>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl flex items-center space-x-2 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number, customer name, or phone..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#218838] focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={orderStatus}
          onChange={(e) => setOrderStatus(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
        >
          <option value="">All Order Statuses</option>
          <option value="Pending Confirmation">Pending Confirmation</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Preparing">Preparing</option>
          <option value="Ready for Pickup">Ready for Pickup</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
        >
          <option value="">All Payment Statuses</option>
          <option value="Cash on Delivery">Cash on Delivery</option>
          <option value="Awaiting Payment">Awaiting Payment</option>
          <option value="Proof Submitted">Proof Submitted</option>
          <option value="Under Verification">Under Verification</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Delivery Location</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Order Stage</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No matching orders found.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {ord.orderNumber}
                      <span className="block text-[10px] text-slate-400 font-sans font-normal">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{ord.customerName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{ord.customerPhone}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-[200px] truncate">
                      {ord.villageTown ? `${ord.villageTown}, ` : ''}{ord.deliveryAddress}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-[#14532D]">
                      ₹{ord.total}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ord.paymentStatus === 'Cash on Delivery' || ord.paymentMethod === 'Cash on Delivery'
                            ? 'bg-purple-100 text-purple-800'
                            : ord.paymentStatus === 'Approved'
                            ? 'bg-green-100 text-green-800'
                            : ord.paymentStatus === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.paymentMethod === 'Cash on Delivery' ? 'Cash on Delivery' : ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openDrawer(ord)}
                        className="px-3 py-1 bg-slate-100 hover:bg-[#218838] hover:text-white text-slate-700 font-bold text-[11px] rounded-lg transition-colors inline-flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-[#0F291E] text-white p-5 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-base">
                  Order Details: {selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-green-200">
                  Customer: {selectedOrder.customerName} ({selectedOrder.customerPhone})
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
              {/* Delivery Address Details */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                  Delivery Destination
                </span>
                <p className="font-bold text-slate-800 text-sm">
                  {selectedOrder.customerName} • {selectedOrder.customerPhone}
                </p>
                <p className="text-slate-600">
                  {selectedOrder.deliveryAddress}
                </p>
                {selectedOrder.villageTown && (
                  <p className="text-slate-600">Town/Village: {selectedOrder.villageTown}</p>
                )}
                {selectedOrder.landmark && (
                  <p className="text-slate-600">Landmark: {selectedOrder.landmark}</p>
                )}
                {selectedOrder.notes && (
                  <p className="text-[#218838] font-semibold mt-1">Customer Note: "{selectedOrder.notes}"</p>
                )}
              </div>

              {/* Items Breakdown */}
              <div>
                <h4 className="font-extrabold text-slate-900 mb-2">
                  Ordered Products Snapshot
                </h4>
                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                  {selectedOrder.items?.map((it: any) => (
                    <div key={it.id} className="p-3 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-800">{it.productName}</span>
                        <span className="text-slate-400 ml-1.5 font-mono">({it.packSize})</span>
                        <div className="text-[10px] text-slate-500">
                          {it.quantity} x ₹{it.price}
                        </div>
                      </div>
                      <span className="font-extrabold text-slate-900 text-sm">
                        ₹{it.total}
                      </span>
                    </div>
                  ))}
                  <div className="p-3 bg-slate-50 flex justify-between font-extrabold text-slate-900 text-sm">
                    <span>Grand Total:</span>
                    <span className="text-[#14532D]">₹{selectedOrder.total}</span>
                  </div>
                </div>
              </div>

              {/* Update Status Form */}
              <form onSubmit={handleUpdateStatus} className="p-4 bg-green-50 rounded-2xl border border-green-200 space-y-3">
                <h4 className="font-bold text-[#14532D]">
                  Update Order Stage
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Order Status
                    </label>
                    <select
                      value={newOrderStatus}
                      onChange={(e) => setNewOrderStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                    >
                      <option value="Pending Confirmation">Pending Confirmation</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready for Pickup">Ready for Pickup</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Status Change Note
                    </label>
                    <input
                      type="text"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="e.g. Packed and loaded on village truck"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={updatingStatus}
                    className="px-5 py-2 bg-[#218838] hover:bg-[#14532D] text-white font-bold text-xs rounded-xl shadow-sm disabled:opacity-50"
                  >
                    {updatingStatus ? 'Saving...' : 'Update Order Status'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
