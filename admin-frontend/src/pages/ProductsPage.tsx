import React, { useEffect, useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  X,
  Upload,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AdminApiService } from '../services/adminApi.js';

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [stockStatus, setStockStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 50, totalPages: 1 });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Form Fields
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [packSize, setPackSize] = useState('1 kg');
  const [stock, setStock] = useState('50');
  const [imageUrl, setImageUrl] = useState('');
  const [tamilName, setTamilName] = useState('');
  const [hindiName, setHindiName] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await AdminApiService.getProducts({
        page,
        limit: 20,
        search: search || undefined,
        categoryId: selectedCat || undefined,
        stockStatus: stockStatus || undefined
      });
      setProducts(res.data.data.products);
      setPagination(res.data.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await AdminApiService.getCategories();
        setCategories(res.data.data.categories);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, search, selectedCat, stockStatus]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setSku(`GG-SKU-${Math.floor(1000 + Math.random() * 9000)}`);
    setName('');
    setDescription('');
    setCategoryId(categories[0]?.id || '');
    setPrice('');
    setOriginalPrice('');
    setUnit('kg');
    setPackSize('1 kg');
    setStock('50');
    setImageUrl('');
    setTamilName('');
    setHindiName('');
    setIsFeatured(false);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (prod: any) => {
    setEditingProduct(prod);
    setSku(prod.sku);
    setName(prod.name);
    setDescription(prod.description);
    setCategoryId(prod.categoryId);
    setPrice(String(prod.price));
    setOriginalPrice(String(prod.originalPrice || ''));
    setUnit(prod.unit);
    setPackSize(prod.packSize);
    setStock(String(prod.stock));
    setImageUrl(prod.imageUrl || '');
    setIsFeatured(Boolean(prod.isFeatured));

    const ta = prod.translations?.find((t: any) => t.language === 'ta');
    const hi = prod.translations?.find((t: any) => t.language === 'hi');
    setTamilName(ta?.name || '');
    setHindiName(hi?.name || '');

    setError(null);
    setModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      sku,
      name,
      description,
      categoryId,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      unit,
      packSize,
      stock: parseInt(stock, 10),
      imageUrl: imageUrl || undefined,
      isFeatured,
      translations: {
        ta: tamilName ? { name: tamilName } : undefined,
        hi: hindiName ? { name: hindiName } : undefined
      }
    };

    try {
      if (editingProduct) {
        await AdminApiService.updateProduct(editingProduct.id, payload);
        setMessage('Product updated successfully!');
      } else {
        await AdminApiService.createProduct(payload);
        setMessage('Product created successfully!');
      }
      setModalOpen(false);
      fetchProducts();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error saving product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete or deactivate "${name}"?`)) return;
    try {
      await AdminApiService.deleteProduct(id);
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Create button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Product Catalogue Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage product specifications, INR prices, units, stock quantities, and regional translations
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#218838] hover:bg-[#14532D] text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-1.5 transition-all active:scale-95 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl flex items-center space-x-2 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, SKU, or description..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#218838] focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => {
            setSelectedCat(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
        >
          <option value="">All Categories ({categories.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={stockStatus}
          onChange={(e) => {
            setStockStatus(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
        >
          <option value="">All Stock Levels</option>
          <option value="in">In Stock (&gt;10)</option>
          <option value="low">Low Stock (1-10)</option>
          <option value="out">Out of Stock (0)</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Pack Size</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Translations</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Loading product records...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 flex items-center space-x-3">
                      <img
                        src={prod.imageUrl || '/placeholder.svg'}
                        alt={prod.name}
                        className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1 border border-slate-100"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{prod.name}</span>
                        {prod.isFeatured && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 font-bold">
                      {prod.sku}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {prod.category?.name}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-[#14532D]">
                      ₹{prod.price}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {prod.packSize}
                    </td>
                    <td className="py-3 px-4">
                      {prod.stock === 0 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                          0 (Out)
                        </span>
                      ) : prod.stock <= 10 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          {prod.stock} (Low)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">
                          {prod.stock}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[10px] text-slate-500">
                      {prod.translations?.length > 0 ? (
                        <span className="text-emerald-700 font-bold">
                          ✓ {prod.translations.map((t: any) => t.language).join(', ')}
                        </span>
                      ) : (
                        <span className="text-slate-400">EN only</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-1.5 text-slate-600 hover:text-[#218838] transition-colors"
                        title="Edit product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id, prod.name)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-[#0F291E] text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-base">
                  {editingProduct ? 'Edit Product' : 'Add New Grocery Product'}
                </h3>
                <p className="text-xs text-green-200">
                  Fill in all fields and manage translations for customer frontends
                </p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="m-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ponni Boiled Rice"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of the grocery product..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="120"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#14532D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    MRP / Original (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="140"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="50"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Unit *
                  </label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="kg, pack, dozen, L"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pack Size *
                  </label>
                  <input
                    type="text"
                    required
                    value={packSize}
                    onChange={(e) => setPackSize(e.target.value)}
                    placeholder="1 kg, 500 g, 1 L"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Regional Language Translations */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-800">
                  Regional Language Translations
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Tamil Name (தமிழ்)
                    </label>
                    <input
                      type="text"
                      value={tamilName}
                      onChange={(e) => setTamilName(e.target.value)}
                      placeholder="எ.கா. பொன்னி புழுங்கல் அரிசி"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Hindi Name (हिन्दी)
                    </label>
                    <input
                      type="text"
                      value={hindiName}
                      onChange={(e) => setHindiName(e.target.value)}
                      placeholder="उदा. पोन्नी चावल"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Image URL / Asset Reference (Optional)
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... or SVG data URI"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-[#218838]"
                />
                <label htmlFor="featured" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Feature this product on Customer Homepage
                </label>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#218838] hover:bg-[#14532D] text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
