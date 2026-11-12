import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Check, Star, Zap } from 'lucide-react';
import { Product } from '../services/api.js';
import { useCart } from '../contexts/CartContext.js';
import { getLocalizedProductName, getLocalizedCategoryName } from '../services/productTranslations.js';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(product.imageUrl || '');

  const localizedName = getLocalizedProductName(product, i18n.language);
  const localizedCategory = getLocalizedCategoryName(
    product.category?.slug || '',
    product.category?.name || 'Fresh Grocery',
    i18n.language
  );

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock < 1 || adding) return;

    setAdding(true);
    try {
      await addToCart(product.id, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock === 0;

  // Fallback to high-resolution grocery placeholder if image fails
  const handleImageError = () => {
    setImgSrc('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80');
  };

  return (
    <div className="bg-white rounded-3xl border border-emerald-100/80 hover:border-emerald-400 shadow-[0_2px_14px_rgba(20,83,45,0.05)] hover:shadow-[0_14px_30px_rgba(20,83,45,0.14)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group relative select-none">
      {/* Top Floating Badges */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
        {product.discountPercent > 0 ? (
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-md shadow-orange-500/20 tracking-wider">
            {product.discountPercent}% OFF
          </div>
        ) : (
          <div className="bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm flex items-center space-x-1">
            <Zap className="w-2.5 h-2.5 text-amber-300" />
            <span>FRESH</span>
          </div>
        )}

        {isLowStock ? (
          <div className="bg-rose-50/95 backdrop-blur-sm text-rose-600 border border-rose-200 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
            {t('product.lowStock', { count: product.stock })}
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-sm border border-emerald-100 text-amber-500 text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-sm flex items-center space-x-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-gray-800 text-[10px] font-black">4.8</span>
          </div>
        )}
      </div>

      {/* Product Image Container */}
      <Link
        to={`/product/${product.id}`}
        className="block relative pt-[72%] bg-gradient-to-b from-emerald-50/40 via-amber-50/20 to-white overflow-hidden cursor-pointer"
      >
        <img
          src={imgSrc || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'}
          alt={localizedName}
          onError={handleImageError}
          className="absolute inset-0 w-full h-full object-cover p-3 rounded-3xl group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Product Details */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Chip & Pack Size */}
          <div className="flex items-center justify-between text-[11px] mb-1.5 gap-1">
            <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-lg border border-emerald-100 truncate max-w-[130px]">
              {localizedCategory}
            </span>
            <span className="bg-amber-50 text-amber-800 font-mono font-bold text-[10px] px-2 py-0.5 rounded-lg border border-amber-100 flex-shrink-0">
              {product.packSize}
            </span>
          </div>

          {/* Localized Product Name */}
          <Link
            to={`/product/${product.id}`}
            title={localizedName}
            className="block text-sm sm:text-[15px] font-black text-gray-900 group-hover:text-[#218838] line-clamp-2 transition-colors mb-2 leading-snug tracking-tight"
          >
            {localizedName}
          </Link>
        </div>

        <div>
          {/* Price & Savings Display */}
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg sm:text-xl font-black text-[#14532D]">
                ₹{product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-400 line-through font-semibold">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                Save ₹{product.originalPrice - product.price}
              </span>
            )}
          </div>

          {/* Touch-Friendly Kiosk Action Button */}
          <button
            onClick={handleAdd}
            disabled={isOutOfStock || adding}
            className={`w-full py-2.5 px-3 rounded-2xl font-black text-xs flex items-center justify-center space-x-1.5 transition-all duration-200 active:scale-95 shadow-md min-h-[42px] ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none'
                : justAdded
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-gradient-to-r from-[#218838] via-[#1e7e34] to-[#14532D] hover:from-[#1b6b3b] hover:to-[#0f3d20] text-white shadow-green-700/25 hover:shadow-lg'
            }`}
          >
            {isOutOfStock ? (
              <span>{t('product.outOfStock', 'Out of Stock')}</span>
            ) : justAdded ? (
              <>
                <Check className="w-4 h-4 text-white animate-bounce" />
                <span>{t('product.addedToCart', 'Added!')}</span>
              </>
            ) : adding ? (
              <span>Adding...</span>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>{t('product.addToCart', 'Add to Basket')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
