import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Boxes,
  Plus,
  Minus,
  AlertTriangle,
  History,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AdminApiService } from '../services/adminApi.js';

export const InventoryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';

  const [products, setProducts] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Stock Adjust Modal
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [quantityChange, setQuantityChange] = useState('');
  const [reason, setReason] = useState('Restock from Hubli Mandi');
  const [adjusting, setAdjusting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await AdminApiService.getInventory(filter);
      setProducts(res.data.data.products);
      setMovements(res.data.data.movements);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [filter]);

  const openAdjustModal = (prod: any) => {
    setSelectedProduct(prod);
    setQuantityChange('25');
    setReason('Restock from Hubli Mandi');
    setError(null);
    setAdjustModalOpen(true);
  };

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setAdjusting(true);
    setError(null);

    const delta = parseInt(quantityChange, 10);

    try {
      await AdminApiService.adjustStock(selectedProduct.id, {
        quantityChange: delta,
        reason
      });
      setMessage(`Stock for "${selectedProduct.name}" adjusted by ${delta}.`);
      setAdjustModalOpen(false);
      fetchInventory();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to adjust stock');
    } finally {
      setAdjusting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Inventory Control & Movements
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor real-time warehouse stock, log manual additions/spoilage, and track movement audit trail
        </p>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl flex items-center space-x-2 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Stock Levels Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <Boxes className="w-4 h-4 text-[#218838]" />
            <span>Warehouse Stock Levels</span>
          </h3>

          <div className="flex space-x-2 text-xs">
            <a
              href="/inventory"
              className={`px-3 py-1.5 rounded-lg font-bold ${
                filter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Items
            </a>
            <a
              href="/inventory?filter=low"
              className={`px-3 py-1.5 rounded-lg font-bold ${
                filter === 'low'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Low Stock (&lt;10)
            </a>
            <a
              href="/inventory?filter=out"
              className={`px-3 py-1.5 rounded-lg font-bold ${
                filter === 'out'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              Out of Stock (0)
            </a>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading inventory...
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {prod.name}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-500">
                      {prod.sku}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {prod.category?.name}
                    </td>
                    <td className="py-3 px-4 font-mono font-extrabold text-sm text-slate-900">
                      {prod.stock} {prod.unit}
                    </td>
                    <td className="py-3 px-4">
                      {prod.stock === 0 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                          Out of Stock
                        </span>
                      ) : prod.stock <= 10 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          Low Stock Warning
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">
                          Optimal
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openAdjustModal(prod)}
                        className="px-3 py-1 bg-[#218838] hover:bg-[#14532D] text-white font-bold text-[11px] rounded-lg transition-colors"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Movements History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
          <History className="w-4 h-4 text-[#218838]" />
          <span>Recent Inventory Movements & Audits</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Delta</th>
                <th className="py-3 px-4">Before / After</th>
                <th className="py-3 px-4">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {movements.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-500">
                    {new Date(m.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {m.product?.name} ({m.product?.sku})
                  </td>
                  <td className="py-3 px-4 font-mono font-extrabold">
                    {m.quantityChange > 0 ? (
                      <span className="text-emerald-600">+{m.quantityChange}</span>
                    ) : (
                      <span className="text-red-600">{m.quantityChange}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">
                    {m.quantityBefore} → {m.quantityAfter}
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-semibold">
                    {m.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjustment Modal */}
      {adjustModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0F291E] text-white p-5 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-base">Adjust Stock Level</h3>
                <p className="text-xs text-green-200">{selectedProduct.name}</p>
              </div>
              <button onClick={() => setAdjustModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="m-5 p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAdjustStock} className="p-6 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                <span className="text-slate-600">Current Stock:</span>
                <span className="font-mono font-extrabold text-base text-slate-900">
                  {selectedProduct.stock} {selectedProduct.unit}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Quantity Change (+ to add, - to subtract) *
                </label>
                <input
                  type="number"
                  required
                  value={quantityChange}
                  onChange={(e) => setQuantityChange(e.target.value)}
                  placeholder="e.g. 50 or -5"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mandatory Reason for Movement *
                </label>
                <select
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="Restock from Hubli Mandi">Restock from Hubli Mandi</option>
                  <option value="Direct Farm Receipt">Direct Farm Receipt</option>
                  <option value="Damage / Spoilage Deduction">Damage / Spoilage Deduction</option>
                  <option value="Inventory Physical Count Reconciliation">Inventory Physical Count Reconciliation</option>
                  <option value="Returned Order Restocked">Returned Order Restocked</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAdjustModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjusting}
                  className="px-6 py-2 bg-[#218838] hover:bg-[#14532D] text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50"
                >
                  {adjusting ? 'Adjusting...' : 'Save Stock Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
