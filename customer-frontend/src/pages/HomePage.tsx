import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Mic,
  ArrowRight,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
  Truck,
  HeartHandshake,
  Tag,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { ApiService, Product, Category } from '../services/api.js';
import { ProductCard } from '../components/ProductCard.js';
import { getLocalizedCategoryName } from '../services/productTranslations.js';

interface HomePageProps {
  onOpenVoice: () => void;
}

// Category vibrant color palettes for ultra-colorful grid
const categoryPalette: { [slug: string]: { bg: string; border: string; text: string; glow: string } } = {
  'fruits': { bg: 'from-orange-500/10 to-amber-500/20', border: 'border-orange-200', text: 'text-orange-700', glow: 'group-hover:shadow-orange-500/20' },
  'vegetables': { bg: 'from-emerald-500/10 to-green-500/20', border: 'border-emerald-200', text: 'text-emerald-700', glow: 'group-hover:shadow-emerald-500/20' },
  'rice-grains-and-dals': { bg: 'from-amber-500/10 to-yellow-500/20', border: 'border-amber-200', text: 'text-amber-700', glow: 'group-hover:shadow-amber-500/20' },
  'rice-and-grains': { bg: 'from-amber-500/10 to-yellow-500/20', border: 'border-amber-200', text: 'text-amber-700', glow: 'group-hover:shadow-amber-500/20' },
  'pulses-and-dals': { bg: 'from-yellow-500/10 to-orange-500/20', border: 'border-yellow-200', text: 'text-yellow-700', glow: 'group-hover:shadow-yellow-500/20' },
  'flour-and-atta': { bg: 'from-stone-500/10 to-amber-500/20', border: 'border-stone-200', text: 'text-stone-700', glow: 'group-hover:shadow-stone-500/20' },
  'cooking-oil-and-ghee': { bg: 'from-amber-500/15 to-yellow-400/25', border: 'border-yellow-300', text: 'text-amber-800', glow: 'group-hover:shadow-yellow-500/20' },
  'milk-and-dairy': { bg: 'from-sky-500/10 to-blue-500/20', border: 'border-sky-200', text: 'text-sky-700', glow: 'group-hover:shadow-sky-500/20' },
  'bread-and-bakery': { bg: 'from-amber-600/10 to-stone-500/20', border: 'border-amber-200', text: 'text-amber-800', glow: 'group-hover:shadow-amber-500/20' },
  'eggs': { bg: 'from-orange-400/10 to-yellow-400/20', border: 'border-orange-200', text: 'text-orange-800', glow: 'group-hover:shadow-orange-400/20' },
  'snacks-and-biscuits': { bg: 'from-rose-500/10 to-orange-500/20', border: 'border-rose-200', text: 'text-rose-700', glow: 'group-hover:shadow-rose-500/20' },
  'tea-and-coffee': { bg: 'from-amber-700/10 to-stone-600/20', border: 'border-amber-300', text: 'text-amber-900', glow: 'group-hover:shadow-amber-700/20' },
  'sugar-salt-and-spices': { bg: 'from-red-500/10 to-rose-500/20', border: 'border-red-200', text: 'text-red-700', glow: 'group-hover:shadow-red-500/20' },
  'packaged-foods': { bg: 'from-purple-500/10 to-indigo-500/20', border: 'border-purple-200', text: 'text-purple-700', glow: 'group-hover:shadow-purple-500/20' },
  'beverages': { bg: 'from-cyan-500/10 to-teal-500/20', border: 'border-cyan-200', text: 'text-cyan-700', glow: 'group-hover:shadow-cyan-500/20' },
  'personal-care': { bg: 'from-pink-500/10 to-rose-500/20', border: 'border-pink-200', text: 'text-pink-700', glow: 'group-hover:shadow-pink-500/20' },
  'household-cleaning': { bg: 'from-teal-500/10 to-emerald-500/20', border: 'border-teal-200', text: 'text-teal-700', glow: 'group-hover:shadow-teal-500/20' },
  'baby-care': { bg: 'from-blue-400/10 to-indigo-400/20', border: 'border-blue-200', text: 'text-blue-700', glow: 'group-hover:shadow-blue-400/20' },
  'frozen-foods': { bg: 'from-cyan-600/10 to-sky-600/20', border: 'border-cyan-200', text: 'text-cyan-800', glow: 'group-hover:shadow-cyan-600/20' },
  'daily-essentials': { bg: 'from-lime-500/10 to-green-500/20', border: 'border-lime-200', text: 'text-lime-800', glow: 'group-hover:shadow-lime-500/20' },
  'meat-and-seafood': { bg: 'from-red-600/10 to-rose-600/20', border: 'border-red-200', text: 'text-red-800', glow: 'group-hover:shadow-red-600/20' }
};

export const HomePage: React.FC<HomePageProps> = ({ onOpenVoice }) => {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [dailyEssentials, setDailyEssentials] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, featRes, popRes, essRes] = await Promise.all([
          ApiService.getCategories(i18n.language),
          ApiService.getProducts({ featured: true, limit: 8, lang: i18n.language }),
          ApiService.getProducts({ sortBy: 'price-desc', limit: 8, lang: i18n.language }),
          ApiService.getProducts({ category: 'daily-essentials', limit: 8, lang: i18n.language })
        ]);

        setCategories(catRes.data.data.categories);
        setFeaturedProducts(featRes.data.data.products);
        setBestSellers(popRes.data.data.products);
        setDailyEssentials(essRes.data.data.products);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language]);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Dynamic Colorful Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#14532D] via-[#166534] to-[#047857] text-white p-6 sm:p-12 lg:p-16 shadow-[0_20px_50px_rgba(20,83,45,0.25)] border border-emerald-400/20">
        {/* Decorative background glow accents */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-gradient-to-br from-amber-400/20 via-emerald-400/20 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-teal-400/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          {/* Top Pill with live indicators */}
          <div className="inline-flex flex-wrap items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-green-100 border border-white/20 shadow-inner">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300"></span>
            </span>
            <span className="text-amber-300 font-extrabold uppercase tracking-wider">Fast Rural Delivery</span>
            <span className="text-white/40">•</span>
            <span>100% Farm Fresh Assured</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
            Fresh Essentials, <br />
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-emerald-200 bg-clip-text text-transparent">
              Direct to your Home
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-emerald-100 leading-relaxed max-w-2xl font-medium">
            Browse 100 farm-picked essentials, order by voice in your mother tongue, and pay easily with your UPI QR app.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <Link
              to="/products"
              className="px-8 py-4 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-gray-950 font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-amber-500/25 hover:shadow-2xl hover:shadow-amber-500/35 transition-all duration-300 active:scale-95 flex items-center space-x-2.5 group"
            >
              <span>{t('hero.cta')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={onOpenVoice}
              className="px-6 py-4 bg-white/15 hover:bg-white/25 text-white font-extrabold text-sm sm:text-base rounded-2xl backdrop-blur-md transition-all duration-300 active:scale-95 flex items-center space-x-2.5 border border-white/30 shadow-lg group"
            >
              <div className="w-6 h-6 rounded-full bg-rose-500/80 flex items-center justify-center animate-pulse">
                <Mic className="w-3.5 h-3.5 text-white" />
              </div>
              <span>{t('hero.voiceCta')}</span>
            </button>
          </div>

          {/* Quick trust metrics */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/20 text-xs">
            <div className="flex items-center space-x-2 text-emerald-100 font-bold">
              <Truck className="w-4 h-4 text-amber-300 flex-shrink-0" />
              <span>Free Delivery ₹500+</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-100 font-bold">
              <HeartHandshake className="w-4 h-4 text-emerald-300 flex-shrink-0" />
              <span>Direct Mill & Farm</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-100 font-bold">
              <Zap className="w-4 h-4 text-yellow-300 flex-shrink-0" />
              <span>Simple UPI QR Pay</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-100 font-bold">
              <CheckCircle2 className="w-4 h-4 text-teal-300 flex-shrink-0" />
              <span>6 Indian Languages</span>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by 20 Vibrant Categories Section */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-3">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-black uppercase tracking-widest text-[#218838]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Complete Daily Bazaar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#14532D] tracking-tight mt-1">
              {t('home.shopByCategory')}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Explore traditional Indian grocery categories fresh from local farms and trusted brands
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-extrabold text-[#218838] hover:text-[#14532D] flex items-center space-x-1 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 transition-colors"
          >
            <span>{t('home.viewAll')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-36 bg-gray-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {categories.map((cat) => {
              const pal = categoryPalette[cat.slug] || {
                bg: 'from-emerald-500/10 to-green-500/20',
                border: 'border-emerald-200',
                text: 'text-emerald-700',
                glow: 'group-hover:shadow-emerald-500/20'
              };

              return (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className={`relative p-4 rounded-3xl bg-gradient-to-b ${pal.bg} border ${pal.border} shadow-sm hover:shadow-xl ${pal.glow} hover:-translate-y-1.5 transition-all duration-300 group flex flex-col items-center text-center overflow-hidden`}
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden p-1 bg-white shadow-md mb-3 group-hover:scale-105 group-hover:rotate-2 transition-transform duration-300">
                    <img
                      src={cat.imageUrl || '/placeholder.svg'}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-xl"
                      loading="lazy"
                    />
                  </div>
                  <h3 className={`text-xs sm:text-sm font-black ${pal.text} line-clamp-1 group-hover:underline`}>
                    {getLocalizedCategoryName(cat.slug, cat.name, i18n.language)}
                  </h3>
                  <span className="text-[10px] text-gray-500 font-extrabold mt-1 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-black/5">
                    {cat.productCount} Products
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* 3 Eye-Catching Colorful Promotional Banners */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Promo 1: Farm Fresh Harvest */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-6 sm:p-7 shadow-lg flex flex-col justify-between group">
          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/10 blur-xl group-hover:scale-120 transition-transform" />
          <div>
            <span className="bg-amber-400 text-gray-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
              Morning Harvest
            </span>
            <h3 className="text-xl font-black mt-3 leading-tight">
              100% Farm Fresh Fruits & Veggies
            </h3>
            <p className="text-xs text-emerald-100 mt-2 leading-relaxed">
              Crisp Shimla apples, Robusta bananas, fresh Nashik onions, and country tomatoes direct from orchards.
            </p>
          </div>
          <Link
            to="/category/fruits"
            className="mt-5 inline-flex items-center space-x-2 text-xs font-black bg-white text-emerald-800 px-4 py-2 rounded-xl shadow-md hover:bg-emerald-50 transition-colors w-fit"
          >
            <span>Shop Fresh</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Promo 2: Traditional Dals & Grains */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 to-orange-700 text-white p-6 sm:p-7 shadow-lg flex flex-col justify-between group">
          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/10 blur-xl group-hover:scale-120 transition-transform" />
          <div>
            <span className="bg-white text-amber-900 font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
              Heritage Staples
            </span>
            <h3 className="text-xl font-black mt-3 leading-tight">
              Pure Ponni Rice & Stone-Ground Atta
            </h3>
            <p className="text-xs text-amber-100 mt-2 leading-relaxed">
              Aged Ponni boiled rice, unpolished Toor Dal, and pure cow ghee prepared with traditional rural care.
            </p>
          </div>
          <Link
            to="/category/rice-and-grains"
            className="mt-5 inline-flex items-center space-x-2 text-xs font-black bg-white text-amber-900 px-4 py-2 rounded-xl shadow-md hover:bg-amber-50 transition-colors w-fit"
          >
            <span>Explore Grains</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Promo 3: Daily Essentials & Tea */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-700 to-violet-800 text-white p-6 sm:p-7 shadow-lg flex flex-col justify-between group">
          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/10 blur-xl group-hover:scale-120 transition-transform" />
          <div>
            <span className="bg-rose-400 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
              Up to 30% OFF
            </span>
            <h3 className="text-xl font-black mt-3 leading-tight">
              Daily Dairy, Tea & Cleaning
            </h3>
            <p className="text-xs text-purple-100 mt-2 leading-relaxed">
              Fresh morning milk, Tata Tea Gold, Marie biscuits, detergent washing powder, and household cleaning.
            </p>
          </div>
          <Link
            to="/category/daily-essentials"
            className="mt-5 inline-flex items-center space-x-2 text-xs font-black bg-white text-purple-900 px-4 py-2 rounded-xl shadow-md hover:bg-purple-50 transition-colors w-fit"
          >
            <span>View Essentials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-black text-amber-600 uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Specially Handpicked</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#14532D] tracking-tight mt-1">
              {t('home.featuredProducts')}
            </h2>
          </div>
          <Link
            to="/products?featured=true"
            className="text-xs sm:text-sm font-extrabold text-[#218838] hover:text-[#14532D] flex items-center space-x-1 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 transition-colors"
          >
            <span>{t('home.viewAll')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* How GrocerGo Works — Colorful 4-Step Card Flow */}
      <section className="bg-gradient-to-b from-white to-emerald-50/40 rounded-[2.5rem] border border-emerald-100 p-8 sm:p-12 shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-[#218838] bg-emerald-100 px-3 py-1 rounded-full">
            Effortless Rural Ordering
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#14532D] mt-3 tracking-tight">
            {t('home.howItWorks')}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            No technical knowledge needed. Speak your grocery list in your native language and pay with any UPI app.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow text-center relative group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-black text-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition-transform">
              1
            </div>
            <h4 className="text-base font-extrabold text-[#14532D] mb-1.5">
              {t('home.step1Title')}
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              {t('home.step1Desc')}
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow text-center relative group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white font-black text-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
              2
            </div>
            <h4 className="text-base font-extrabold text-[#14532D] mb-1.5">
              {t('home.step2Title')}
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              {t('home.step2Desc')}
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-3xl border border-cyan-100 shadow-sm hover:shadow-md transition-shadow text-center relative group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-black text-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-600/20 group-hover:scale-110 transition-transform">
              3
            </div>
            <h4 className="text-base font-extrabold text-[#14532D] mb-1.5">
              {t('home.step3Title')}
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              {t('home.step3Desc')}
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow text-center relative group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white font-black text-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-600/20 group-hover:scale-110 transition-transform">
              4
            </div>
            <h4 className="text-base font-extrabold text-[#14532D] mb-1.5">
              {t('home.step4Title')}
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              {t('home.step4Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Customer Favourites & Best Sellers */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-black text-emerald-600 uppercase tracking-widest">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>Most Ordered in Towns</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#14532D] tracking-tight mt-1">
              {t('home.bestSellers')}
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-extrabold text-[#218838] hover:text-[#14532D] flex items-center space-x-1 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 transition-colors"
          >
            <span>{t('home.viewAll')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
          {bestSellers.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Daily Essentials Section */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-black text-[#14532D] uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-[#218838]" />
              <span>Daily Village Pantry</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#14532D] tracking-tight mt-1">
              {t('home.dailyEssentials')}
            </h2>
          </div>
          <Link
            to="/category/daily-essentials"
            className="text-xs sm:text-sm font-extrabold text-[#218838] hover:text-[#14532D] flex items-center space-x-1 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 transition-colors"
          >
            <span>{t('home.viewAll')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
          {dailyEssentials.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>
    </div>
  );
};
