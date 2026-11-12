import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Layers,
  Users,
  ShoppingBag,
  Clock,
  FileCheck2,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { AdminApiService, DashboardData } from '../services/adminApi.js';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await AdminApiService.getDashboardStats();
        setData(res.data.data);
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const { summary, dailyTrends, recentOrders } = data;

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Executive Dashboard
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Real-time operations, inventory movement, and manual UPI verification queue
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Products
            </span>
            <div className="p-2 rounded-xl bg-green-50 text-[#218838]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">{summary.totalProducts}</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Across {summary.totalCategories} Categories</span>
          </div>
        </div>

        {/* Registered Customers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Customers
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">{summary.totalCustomers}</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Rural & Town direct</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">{summary.totalOrders}</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">{summary.pendingOrders} pending confirmation</span>
          </div>
        </div>

        {/* Verification Queue (Critical Action) */}
        <Link
          to="/payments"
          className="bg-amber-50 p-5 rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between hover:bg-amber-100/80 transition-colors group"
        >
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
              Proofs to Verify
            </span>
            <div className="p-2 rounded-xl bg-amber-500 text-white">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-amber-900">{summary.pendingProofs}</span>
            <span className="text-[10px] font-bold text-amber-700 flex items-center space-x-1 group-hover:underline">
              <span>Review Now</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Link>

        {/* Approved Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Verified Revenue
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-emerald-800">₹{summary.approvedRevenue}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">₹{summary.pendingPaymentAmount} unverified</span>
          </div>
        </div>
      </div>

      {/* Secondary Stock Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/inventory?filter=low"
          className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-amber-300 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Low Stock Alert</h4>
              <p className="text-[11px] text-slate-500">{summary.lowStockProducts} products have 10 or fewer units</p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            View Items
          </span>
        </Link>

        <Link
          to="/inventory?filter=out"
          className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-red-300 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Out of Stock Alert</h4>
              <p className="text-[11px] text-slate-500">{summary.outOfStockProducts} products currently unavailable</p>
            </div>
          </div>
          <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
            Restock
          </span>
        </Link>
      </div>

      {/* Recharts Analytics: 7-Day Order Trends */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              7-Day Order & Revenue Trajectory
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daily customer order count and verified UPI payments
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyTrends}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#218838" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#218838" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F291E',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue (₹)"
                stroke="#218838"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Bar dataKey="orders" name="Orders Count" fill="#D97706" radius={[4, 4, 0, 0]} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-base font-extrabold text-slate-900">
            Recent Customer Orders
          </h3>
          <Link
            to="/orders"
            className="text-xs font-bold text-[#218838] hover:underline flex items-center space-x-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {recentOrders.map((ord: any) => (
                <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{ord.customerName}</span>
                    <span className="text-[10px] text-slate-400">{ord.customerPhone}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">
                    ₹{ord.total}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.paymentStatus === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : ord.paymentStatus === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/orders`}
                      className="text-xs font-bold text-[#218838] hover:underline"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
