import React, { useEffect, useState } from 'react';
import { Users, Search, ShoppingBag } from 'lucide-react';
import { AdminApiService } from '../services/adminApi.js';

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const res = await AdminApiService.getCustomers();
        setCustomers(res.data.data.customers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.villageTown && c.villageTown.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Registered Customers
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Directory of rural and town customers, delivery locations, and lifetime purchases
          </p>
        </div>

        <div className="relative min-w-[240px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, phone, village..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#218838] focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Village / Town</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4 text-right">Verified Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading customers...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {c.name}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      {c.phone}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {c.email}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {c.villageTown || 'N/A'}
                    </td>
                    <td className="py-3 px-4 uppercase text-[10px] font-bold text-emerald-700">
                      {c.preferredLanguage}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {c.totalOrders}
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-[#14532D]">
                      ₹{c.totalSpent}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
