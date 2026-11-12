import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Filter, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { ApiService, Product, Category } from '../services/api.js';
import { ProductCard } from '../components/ProductCard.js';
import { getLocalizedCategoryName } from '../services/productTranslations.js';

export const AllGroceriesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 16, totalPages: 1 });

  const selectedCategory = searchParams.get('category') || '';
  const sortBy = searchParams.get('sortBy') || 'newest';
  const inStockOnly = searchParams.get('inStock') === 'true';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await ApiService.getCategories(i18n.language);
        setCategories(res.data.data.categories);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, [i18n.language]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await ApiService.getProducts({
          page: currentPage,
          limit: 16,
          category: selectedCategory || undefined,
          sortBy,
          inStock: inStockOnly || undefined,
          lang: i18n.language
        });
        setProducts(res.data.data.products);
        setPagination(res.data.data.pagination);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, sortBy, inStockOnly, currentPage, i18n.language]);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter bar */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#14532D]">
            {t('nav.allGroceries')}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Showing {pagination.total} farm-fresh items in stock
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Dropdown */}
          <div className="flex items-center space-x-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => updateParam('category', e.target.value)}
              className="bg-transparent font-medium text-gray-800 focus:outline-none cursor-pointer"
            >
              <option value="">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {getLocalizedCategoryName(c.slug, c.name, i18n.language)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center space-x-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => updateParam('sortBy', e.target.value)}
              className="bg-transparent font-medium text-gray-800 focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {/* In Stock Only Checkbox */}
          <label className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : '')}
              className="rounded text-[#218838] focus:ring-[#218838]"
            />
            <span className="font-medium text-gray-700">In Stock Only</span>
          </label>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
          <span className="text-4xl">🌾</span>
          <h3 className="text-base font-bold text-gray-800 mt-3">No products match your filters</h3>
          <p className="text-xs text-gray-500 mt-1">Try resetting the category filter or searching with different keywords.</p>
          <button
            onClick={() => setSearchParams({})}
            className="mt-4 px-4 py-2 bg-[#218838] text-white text-xs font-bold rounded-xl"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-6">
          <button
            onClick={() => updateParam('page', String(currentPage - 1))}
            disabled={currentPage <= 1}
            className="p-2 bg-white border border-gray-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-semibold text-gray-600 px-4">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            onClick={() => updateParam('page', String(currentPage + 1))}
            disabled={currentPage >= pagination.totalPages}
            className="p-2 bg-white border border-gray-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
