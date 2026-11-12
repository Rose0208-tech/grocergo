import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, ArrowRight, Mic, Sparkles } from 'lucide-react';
import { useCart } from '../contexts/CartContext.js';

interface KioskBottomBarProps {
  onOpenVoice: () => void;
}

export const KioskBottomBar: React.FC<KioskBottomBarProps> = ({ onOpenVoice }) => {
  const { t } = useTranslation();
  const { cart } = useCart();
  const location = useLocation();

  // Don't show on checkout, cart, or payment pages
  const isExcludedPage = ['/cart', '/checkout', '/payment'].some((path) =>
    location.pathname.startsWith(path)
  );

  if (!cart || cart.itemCount === 0 || isExcludedPage) {
    return null;
  }

  return (
    <aside aria-label="Shopping Basket Summary" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-lg animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#14532D]/95 backdrop-blur-md text-white p-2.5 sm:p-3 rounded-full shadow-[0_12px_36px_rgba(20,83,45,0.4)] border border-emerald-400/30 flex items-center justify-between gap-2.5">
        {/* Left: Basket Count & Total */}
        <Link
          to="/cart"
          className="flex items-center space-x-2.5 pl-2 hover:opacity-90 transition-opacity"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-gray-950 flex items-center justify-center font-black text-xs shadow-md shadow-orange-500/30 flex-shrink-0">
            {cart.itemCount}
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] uppercase tracking-wider text-green-200 font-extrabold">Basket Total</span>
              {cart.amountForFreeDelivery === 0 && (
                <span className="text-[9px] bg-emerald-500/80 text-white px-1.5 py-0.2 rounded-full font-black">
                  FREE DELIVERY
                </span>
              )}
            </div>
            <div className="text-base sm:text-lg font-black tracking-tight text-white">
              ₹{cart.total}
            </div>
          </div>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={onOpenVoice}
            title="Voice Assistant"
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-amber-300 flex items-center justify-center transition-all active:scale-95 border border-white/20"
          >
            <Mic className="w-4 h-4 animate-pulse" />
          </button>

          <Link
            to="/cart"
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-black text-xs rounded-full shadow-md flex items-center space-x-1.5 transition-all transform active:scale-95"
          >
            <span>{t('cart.proceedToCheckout', 'Checkout')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
};
