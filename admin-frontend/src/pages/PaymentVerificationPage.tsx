import React, { useEffect, useState } from 'react';
import {
  FileCheck2,
  Check,
  X,
  AlertCircle,
  Eye,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { AdminApiService } from '../services/adminApi.js';

export const PaymentVerificationPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [reviewOrder, setReviewOrder] = useState<any | null>(null);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('Amount paid does not match order total.');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await AdminApiService.getOrders({
        paymentStatus: 'Proof Submitted'
      });
      setOrders(res.data.data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleApprove = async (orderId: string) => {
    if (!window.confirm('Confirm approval of this UPI payment proof?')) return;
    setProcessing(true);
    try {
      await AdminApiService.updatePaymentDecision(orderId, {
        status: 'Approved'
      });
      setMessage('Payment proof approved successfully! Order status advanced to Confirmed.');
      setReviewOrder(null);
      fetchQueue();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to approve payment.');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewOrder) return;
    setProcessing(true);
    try {
      await AdminApiService.updatePaymentDecision(reviewOrder.id, {
        status: 'Rejected',
        rejectionReason
      });
      setMessage('Payment proof marked as Rejected.');
      setRejectionModalOpen(false);
      setReviewOrder(null);
      fetchQueue();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to reject payment.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Manual QR Payment Verification
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review customer payment receipts, verify against store UPI bank statement, and approve or reject submissions
        </p>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl flex items-center space-x-2 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Queue Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <FileCheck2 className="w-5 h-5 text-amber-500" />
            <span>Submissions Awaiting Admin Review ({orders.length})</span>
          </h3>
          <button
            onClick={fetchQueue}
            className="text-xs font-bold text-[#218838] hover:underline"
          >
            Refresh Queue
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">12-Digit UTR Reference</th>
                <th className="py-3 px-4">Proof Uploaded</th>
                <th className="py-3 px-4 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading verification queue...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-bold text-slate-700">Verification queue is completely clear!</p>
                    <p className="text-[11px] text-slate-400">All submitted payment proofs have been reviewed.</p>
                  </td>
                </tr>
              ) : (
                orders.map((ord) => {
                  const proof = ord.paymentProofs?.[0];
                  return (
                    <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{ord.customerName}</span>
                        <span className="text-[10px] text-slate-400">{ord.customerPhone}</span>
                      </td>
                      <td className="py-3 px-4 font-extrabold text-[#14532D] text-sm">
                        ₹{ord.total}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-700 bg-blue-50/50 rounded">
                        {proof?.transactionRef || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {proof ? new Date(proof.createdAt).toLocaleString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => setReviewOrder(ord)}
                          className="px-3 py-1.5 bg-[#218838] hover:bg-[#14532D] text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95 inline-flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review Proof</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal with Proof Image Viewer */}
      {reviewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-[#0F291E] text-white p-5 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-base">
                  Verify Payment: {reviewOrder.orderNumber}
                </h3>
                <p className="text-xs text-green-200">
                  Customer: {reviewOrder.customerName} ({reviewOrder.customerPhone})
                </p>
              </div>
              <button
                onClick={() => setReviewOrder(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
              {/* Order and Transaction Info */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-500 font-bold block text-[10px] uppercase">
                    Order Total Payable
                  </span>
                  <span className="text-2xl font-extrabold text-[#14532D]">
                    ₹{reviewOrder.total}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block text-[10px] uppercase">
                    Customer Reported UTR
                  </span>
                  <span className="text-base font-mono font-extrabold text-blue-700">
                    {reviewOrder.paymentProofs?.[0]?.transactionRef || 'No UTR specified'}
                  </span>
                </div>
              </div>

              {/* Screenshot Proof Image Box */}
              <div>
                <h4 className="font-extrabold text-slate-800 mb-2">
                  Customer Uploaded Payment Receipt / Screenshot:
                </h4>
                <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-center max-h-80 overflow-hidden">
                  {reviewOrder.paymentProofs?.[0]?.imageUrl ? (
                    <img
                      src={`http://localhost:5000/api/payment/proofs/file/${reviewOrder.paymentProofs[0].imageUrl.split('/').pop()}`}
                      alt="Uploaded Payment Receipt"
                      className="max-h-72 object-contain rounded-lg shadow-md"
                      onError={(e: any) => {
                        // Fallback in case token or URL format differs
                        e.target.src = reviewOrder.paymentProofs[0].imageUrl;
                      }}
                    />
                  ) : (
                    <span className="text-slate-400">No image record</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setRejectionModalOpen(true)}
                  disabled={processing}
                  className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl border border-red-200 transition-colors flex items-center space-x-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>Reject Payment</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleApprove(reviewOrder.id)}
                  disabled={processing}
                  className="px-6 py-2.5 bg-[#218838] hover:bg-[#14532D] text-white font-extrabold rounded-xl shadow-md transition-all active:scale-95 flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{processing ? 'Approving...' : 'Approve Payment (Confirm Order)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Submodal */}
      {rejectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4">
            <h3 className="font-extrabold text-base text-red-700 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>State Reason for Payment Rejection</span>
            </h3>

            <p className="text-xs text-slate-500">
              This note will be recorded in the audit log and displayed to the customer on their order tracking page so they can re-upload their proof.
            </p>

            <form onSubmit={handleReject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Rejection Reason *
                </label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs mb-2"
                >
                  <option value="Amount paid does not match order total.">
                    Amount paid does not match order total.
                  </option>
                  <option value="UTR/Transaction reference not found in store bank account.">
                    UTR reference not found in store bank account.
                  </option>
                  <option value="Screenshot receipt is blurred, cropped, or illegible.">
                    Screenshot receipt is blurred or illegible.
                  </option>
                  <option value="Duplicate payment screenshot already used on another order.">
                    Duplicate payment screenshot.
                  </option>
                </select>

                <textarea
                  rows={2}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectionModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
