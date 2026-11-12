import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, ArrowLeft } from 'lucide-react';
import { ApiService, Product } from '../services/api.js';
import { ProductCard } from '../components/ProductCard.js';

export const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { i18n } = useTranslation();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!query.trim()) return;
      setLoading(true);
      try {
        const res = await ApiService.getProducts({ search: query, limit: 40, lang: i18n.language });
        setProducts(res.data.data.products);
      } catch (err) {
        console.error('Error during search:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [query, i18n.language]);

  return (
    <div className="space-y-6">
      <Link
        to="/products"
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#218838] hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Groceries</span>
      </Link>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Search Results
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#14532D]">
            Showing results for "{query}"
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {products.length} products found
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-[#218838]">
          <Search className="w-5 h-5" />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
          <span className="text-4xl">🔍</span>
          <h3 className="text-base font-bold text-gray-800">
            No groceries found matching "{query}"
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try checking for spelling errors, using simpler words like "rice", "dal", "oil", or using the Voice Assistant button.
          </p>
          <Link
            to="/products"
            className="inline-block mt-2 px-5 py-2.5 bg-[#218838] hover:bg-[#14532D] text-white text-xs font-bold rounded-xl"
          >
            Browse All 100 Groceries
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
};
