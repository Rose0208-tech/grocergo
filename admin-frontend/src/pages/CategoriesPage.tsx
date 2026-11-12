import React, { useEffect, useState } from 'react';
import { Layers, Plus, Edit, Trash2, X, AlertCircle } from 'lucide-react';
import { AdminApiService } from '../services/adminApi.js';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tamilName, setTamilName] = useState('');
  const [hindiName, setHindiName] = useState('');
  const [sortOrder, setSortOrder] = useState('0');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCats = async () => {
    setLoading(true);
    try {
      const res = await AdminApiService.getCategories();
      setCategories(res.data.data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setTamilName('');
    setHindiName('');
    setSortOrder(String(categories.length + 1));
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setSortOrder(String(cat.sortOrder || 0));

    const ta = cat.translations?.find((t: any) => t.language === 'ta');
    const hi = cat.translations?.find((t: any) => t.language === 'hi');
    setTamilName(ta?.name || '');
    setHindiName(hi?.name || '');

    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name,
      description,
      sortOrder: parseInt(sortOrder, 10),
      translations: {
        ta: tamilName || undefined,
        hi: hindiName || undefined
      }
    };

    try {
      if (editingCategory) {
        await AdminApiService.updateCategory(editingCategory.id, payload);
      } else {
        await AdminApiService.createCategory(payload);
      }
      setModalOpen(false);
      fetchCats();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error saving category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await AdminApiService.deleteCategory(id);
      fetchCats();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Cannot delete category.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Category Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse and manage all 20 grocery departments, display order, and regional titles
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#218838] hover:bg-[#14532D] text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-1.5 transition-all active:scale-95 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Products</th>
                <th className="py-3 px-4">Translations</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading categories...
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-400">
                      #{cat.sortOrder}
                    </td>
                    <td className="py-3 px-4 flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-green-50 p-1 flex items-center justify-center">
                        <img
                          src={cat.imageUrl || '/placeholder.svg'}
                          alt={cat.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="font-bold text-slate-900">{cat.name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {cat.slug}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700">
                        {cat._count?.products || 0} Products
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[10px] text-slate-500">
                      {cat.translations?.length > 0 ? (
                        <span className="text-emerald-700 font-bold">
                          ✓ {cat.translations.map((t: any) => t.language).join(', ')}
                        </span>
                      ) : (
                        'EN only'
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 text-slate-600 hover:text-[#218838]"
                        title="Edit category"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 text-slate-400 hover:text-red-600"
                        title="Delete category"
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0F291E] text-white p-5 flex justify-between items-center">
              <h3 className="font-extrabold text-base">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="m-5 p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tamil Name (தமிழ்)
                  </label>
                  <input
                    type="text"
                    value={tamilName}
                    onChange={(e) => setTamilName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hindi Name (हिन्दी)
                  </label>
                  <input
                    type="text"
                    value={hindiName}
                    onChange={(e) => setHindiName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
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
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
