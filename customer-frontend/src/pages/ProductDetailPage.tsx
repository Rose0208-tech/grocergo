import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Check, Plus, Minus, ShieldCheck, Truck, Clock, Sparkles, Star, Zap } from 'lucide-react';
import { ApiService, Product } from '../services/api.js';
import { useCart } from '../contexts/CartContext.js';
import { getLocalizedProductName, getLocalizedCategoryName } from '../services/productTranslations.js';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>('');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await ApiService.getProductById(id, i18n.language);
        setProduct(res.data.data.product);
        setImgSrc(res.data.data.product.imageUrl || '');
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, i18n.language]);

  const handleAddToCart = async () => {
    if (!product || product.stock < 1 || adding) return;
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleImageError = () => {
    setImgSrc('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80');
  };

  if (loading) {
    return <div className="h-96 bg-white/70 rounded-3xl animate-pulse" />;
  }

  if (!product) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto space-y-4">
        <h2 className="text-lg font-bold text-gray-800">Product not found</h2>
        <Link to="/products" className="inline-block text-xs font-bold text-[#218838]">
          Back to Groceries
        </Link>
      </div>
    );
  }

  const localizedName = getLocalizedProductName(product, i18n.language);
  const localizedCategory = getLocalizedCategoryName(
    product.category?.slug || '',
    product.category?.name || 'Fresh Grocery',
    i18n.language
  );

  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="space-y-6">
      <Link
        to="/products"
        className="inline-flex items-center space-x-1.5 text-xs font-black text-[#218838] hover:text-[#14532D] transition-colors bg-white px-3.5 py-2 rounded-xl border border-emerald-100 shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('nav.allGroceries', 'Back to All Groceries')}</span>
      </Link>

      <div className="bg-white rounded-[2.5rem] border border-emerald-100/90 p-6 sm:p-10 shadow-lg shadow-emerald-950/5 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left: Product Image Box */}
        <div className="bg-gradient-to-b from-emerald-50/50 via-amber-50/20 to-white rounded-3xl p-6 sm:p-8 flex items-center justify-center border border-emerald-100 relative overflow-hidden group">
          {product.discountPercent > 0 && (
            <span className="absolute top-5 left-5 z-10 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-md shadow-orange-500/25 tracking-wider">
              {product.discountPercent}% OFF
            </span>
          )}

          <div className="absolute top-5 right-5 z-10 bg-white/95 backdrop-blur-sm border border-emerald-100 text-amber-500 text-xs font-black px-3 py-1 rounded-full shadow-sm flex items-center space-x-1.5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-gray-800">4.8 (120+ reviews)</span>
          </div>

          <img
            src={imgSrc || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'}
            alt={localizedName}
            onError={handleImageError}
            className="w-full max-h-96 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500 shadow-sm"
          />
        </div>

        {/* Right: Product Info & Purchase Controls */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-black text-emerald-800 mb-2">
              <span className="bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                {localizedCategory}
              </span>
              <span>•</span>
              <span className="text-gray-400 font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#14532D] tracking-tight leading-tight">
              {localizedName}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-block bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black px-3 py-1 rounded-xl">
                {t('product.packSize', 'Pack')}: {product.packSize}
              </span>

              {isOutOfStock ? (
                <span className="text-xs font-black text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-xl">
                  {t('product.outOfStock', 'Out of Stock')}
                </span>
              ) : isLowStock ? (
                <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl">
                  {t('product.lowStock', { count: product.stock })}
                </span>
              ) : (
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{t('product.inStock', 'In Stock')} ({product.stock} units)</span>
                </span>
              )}
            </div>
          </div>

          {/* Price Box */}
          <div className="bg-gradient-to-r from-emerald-50/70 via-green-50/50 to-amber-50/30 p-5 rounded-3xl border border-emerald-100 flex items-baseline justify-between">
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl sm:text-4xl font-black text-[#14532D]">
                ₹{product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-base text-gray-400 line-through font-bold">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs font-black text-emerald-700 bg-emerald-100/90 px-3 py-1 rounded-xl border border-emerald-200">
                Save ₹{(product.originalPrice - product.price).toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
              Overview
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed font-medium">
              {product.description}
            </p>
          </div>

          {/* Quantity selector and Add button */}
          {!isOutOfStock && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-4">
                <span className="text-xs font-black text-gray-700">{t('product.quantity', 'Quantity')}:</span>
                <div className="flex items-center space-x-1 border border-emerald-200 rounded-2xl p-1 bg-gray-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-600 hover:bg-white hover:text-gray-900 disabled:opacity-40 transition-colors shadow-sm"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-black text-gray-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-600 hover:bg-white hover:text-gray-900 disabled:opacity-40 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={adding}
                className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition-all transform active:scale-98 shadow-lg min-h-[52px] ${
                  justAdded
                    ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                    : 'bg-gradient-to-r from-[#218838] via-[#1e7e34] to-[#14532D] hover:from-[#1b6b3b] hover:to-[#0f3d20] text-white shadow-green-700/30 hover:shadow-xl'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-5 h-5 text-white animate-bounce" />
                    <span>{t('product.addedToCart', 'Added to Basket!')}</span>
                  </>
                ) : adding ? (
                  <span>Adding...</span>
                ) : (
                  <>
                    <Plus className="w-5 h-5 stroke-[3]" />
                    <span>{t('product.addToCart', 'Add to Basket')}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Value props */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 text-xs text-gray-600 font-semibold">
            <div className="flex items-center space-x-2 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
              <Truck className="w-4 h-4 text-[#218838]" />
              <span>Fast Rural Delivery</span>
            </div>
            <div className="flex items-center space-x-2 bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>100% Quality Assured</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
