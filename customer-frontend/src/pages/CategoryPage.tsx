import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Sparkles, ShoppingBag } from 'lucide-react';
import { ApiService, Product, Category } from '../services/api.js';
import { ProductCard } from '../components/ProductCard.js';
import { getLocalizedCategoryName } from '../services/productTranslations.js';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          ApiService.getCategories(i18n.language),
          ApiService.getProducts({ category: slug, limit: 50, lang: i18n.language })
        ]);

        const currentCat = catRes.data.data.categories.find(
          (c) =>
            c.slug === slug ||
            (slug === 'rice-and-grains' && c.slug === 'rice-grains-and-dals') ||
            (slug === 'pulses-and-dals' && c.slug === 'rice-grains-and-dals')
        );
        setCategory(currentCat || null);
        setProducts(prodRes.data.data.products);
      } catch (err) {
        console.error('Error fetching category data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, i18n.language]);

  const categoryName = getLocalizedCategoryName(
    slug || '',
    category?.name || slug?.replace(/-/g, ' ') || 'Groceries',
    i18n.language
  );

  return (
    <div className="space-y-6">
      <Link
        to="/products"
        className="inline-flex items-center space-x-2 text-xs font-black text-[#218838] hover:text-[#14532D] transition-colors bg-white px-3.5 py-2 rounded-xl border border-emerald-100 shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('nav.allGroceries', 'All Groceries')}</span>
      </Link>

      {/* Category Banner */}
      <div className="bg-gradient-to-r from-[#14532D] via-[#166534] to-[#218838] rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-green-950/10 flex items-center justify-between border border-emerald-400/20">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-green-200 bg-white/10 px-2.5 py-0.5 rounded-full inline-block mb-1.5 border border-white/10">
            {t('home.shopByCategory', 'GrocerGo Category')}
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mt-1 tracking-tight">
            {categoryName}
          </h1>
          <p className="text-xs sm:text-sm text-green-100/90 max-w-xl mt-1.5 leading-relaxed font-medium">
            {category?.description || 'Authentic fresh groceries harvested and delivered directly.'}
          </p>
        </div>
        {category?.imageUrl && (
          <div className="hidden sm:flex w-24 h-24 bg-white/15 rounded-3xl p-3 backdrop-blur-md border border-white/20 items-center justify-center flex-shrink-0">
            <img src={category.imageUrl} alt={categoryName} className="w-full h-full object-contain drop-shadow" />
          </div>
        )}
      </div>

      {/* Products List Grid - Touch-Friendly Tablet / iPad Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 bg-white/70 rounded-3xl border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-gray-700">No products currently available in this category.</p>
          <Link
            to="/products"
            className="inline-block text-xs font-black text-white bg-[#218838] px-4 py-2 rounded-xl shadow-sm"
          >
            Browse Other Categories
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
};
