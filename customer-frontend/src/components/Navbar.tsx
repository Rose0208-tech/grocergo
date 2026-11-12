import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShoppingBag,
  Search,
  Mic,
  Globe,
  User,
  MapPin,
  Menu,
  X,
  LogOut,
  Package,
  Sparkles,
  Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.js';
import { useCart } from '../contexts/CartContext.js';
import { languages, setAppLanguage } from '../i18n.js';
import { getLocalizedCategoryName } from '../services/productTranslations.js';

interface NavbarProps {
  onOpenVoice: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenVoice }) => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLanguageChange = (code: string) => {
    setAppLanguage(code);
    setLangDropdownOpen(false);
  };

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-[0_2px_15px_rgba(20,83,45,0.06)]">
      {/* Top village announcement bar */}
      <div className="bg-gradient-to-r from-[#14532D] via-[#166534] to-[#047857] text-white text-xs py-2 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300"></span>
            </span>
            <MapPin className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-bold tracking-wide">
              Delivering to Rural & Semi-Urban India • <span className="text-amber-300 font-black">Free Delivery ₹300+</span>
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-4 text-xs font-semibold">
            <span className="bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20 text-emerald-100 flex items-center space-x-1">
              <Zap className="w-3 h-3 text-amber-300" />
              <span>Voice Ordering Enabled</span>
            </span>
            <span className="text-white/40">|</span>
            <Link to="/help" className="hover:text-amber-200 transition-colors">
              {t('nav.help')}
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo with vibrant glow */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#218838] via-[#1b7e33] to-[#14532D] flex items-center justify-center text-white shadow-lg shadow-green-700/30 group-hover:scale-105 group-hover:rotate-2 transition-all">
              <span className="text-2xl drop-shadow">🛒</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#14532D]">
                Grocer<span className="bg-gradient-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">Go</span>
              </span>
              <p className="text-[10px] uppercase font-black tracking-widest text-[#218838] leading-none">
                Rural & Town Direct
              </p>
            </div>
          </Link>

          {/* Search bar with text input and microphone button */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xl items-center relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('nav.searchPlaceholder')}
              className="w-full pl-11 pr-28 py-3 bg-gray-50/80 hover:bg-gray-50 border border-emerald-100/90 rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#218838] focus:bg-white focus:border-transparent transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-emerald-600 absolute left-4" />
            <div className="absolute right-2 flex items-center space-x-1.5">
              <button
                type="button"
                onClick={onOpenVoice}
                title={t('nav.voiceSearch')}
                className="p-2 text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 rounded-full transition-all active:scale-95 shadow-md shadow-rose-500/25 flex items-center space-x-1 animate-pulse"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-[#218838] hover:bg-[#14532D] text-white rounded-full text-xs font-extrabold shadow-sm"
              >
                Search
              </button>
            </div>
          </form>

          {/* Controls: Language, Orders, Profile, Cart */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile Voice Search Mic Button */}
            <button
              onClick={onOpenVoice}
              className="md:hidden p-2.5 text-white bg-gradient-to-r from-rose-500 to-amber-500 rounded-full shadow-md animate-pulse"
              title={t('nav.voiceSearch')}
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-50 to-amber-50/60 hover:from-emerald-100 hover:to-amber-100 text-[#14532D] rounded-xl text-xs font-extrabold border border-emerald-200/80 shadow-sm transition-all"
              >
                <Globe className="w-3.5 h-3.5 text-[#218838]" />
                <span>{currentLang.native}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-2xl border border-emerald-100 py-2 z-50 animate-in fade-in">
                  <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gray-400 border-b border-gray-100 mb-1">
                    Select Language / மொழி
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full text-left px-3.5 py-2 text-xs font-bold flex justify-between items-center transition-colors ${
                        i18n.language === lang.code
                          ? 'bg-emerald-50 text-[#218838]'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-extrabold">{lang.native}</span>
                      <span className="text-[10px] text-gray-400">({lang.name})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Customer Profile / Login */}
            {user ? (
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  to="/orders"
                  className="flex items-center space-x-1.5 px-3 py-2 text-gray-700 hover:text-[#218838] text-xs font-bold rounded-xl hover:bg-emerald-50 transition-colors"
                >
                  <Package className="w-4 h-4 text-emerald-600" />
                  <span>{t('nav.myOrders')}</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-1.5 px-3 py-2 text-gray-700 hover:text-[#218838] text-xs font-bold rounded-xl hover:bg-emerald-50 transition-colors"
                >
                  <User className="w-4 h-4 text-emerald-600" />
                  <span className="max-w-[90px] truncate">{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  title={t('nav.logout')}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-[#218838] to-[#14532D] hover:from-[#1b6b3b] hover:to-[#0f3d20] text-white rounded-xl text-xs font-extrabold shadow-md shadow-green-700/20 transition-all active:scale-95"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t('nav.login')}</span>
              </Link>
            )}

            {/* Cart Button with vibrant counter */}
            <Link
              to="/cart"
              className="flex items-center space-x-2.5 px-4 py-2.5 bg-gradient-to-r from-[#218838] via-[#1b7e33] to-[#14532D] hover:from-[#196b2c] hover:to-[#0f3d20] text-white rounded-2xl shadow-lg shadow-green-700/30 transition-all active:scale-95 group"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {cart && cart.itemCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-gradient-to-r from-amber-400 to-orange-500 text-gray-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                    {cart.itemCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-black hidden sm:inline tracking-wide">
                Cart
              </span>
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearchSubmit} className="md:hidden mt-3 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('nav.searchPlaceholder')}
            className="w-full pl-9 pr-14 py-2.5 bg-gray-50 border border-emerald-100 rounded-full text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#218838]"
          />
          <Search className="w-3.5 h-3.5 text-emerald-600 absolute left-3 top-3.5" />
          <button
            type="submit"
            className="absolute right-2 top-1.5 px-3 py-1 bg-[#218838] text-white rounded-full text-[10px] font-black shadow-sm"
          >
            Go
          </button>
        </form>

        {/* Kiosk & iPad Friendly Category Navigation Strip */}
        <div className="flex items-center space-x-2 pt-2.5 mt-2 border-t border-emerald-50 text-xs font-black text-gray-700 overflow-x-auto no-scrollbar scroll-smooth">
          <Link to="/" className="px-3 py-1.5 bg-emerald-50 text-[#218838] rounded-xl font-black hover:bg-emerald-100 transition-colors flex-shrink-0">
            {t('nav.home')}
          </Link>
          <Link to="/products" className="px-3 py-1.5 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0">
            {t('nav.allGroceries')}
          </Link>
          <Link to="/category/vegetables" className="px-3 py-1.5 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl transition-colors flex-shrink-0">
            🥦 {getLocalizedCategoryName('vegetables', 'Vegetables', i18n.language)}
          </Link>
          <Link to="/category/fruits" className="px-3 py-1.5 hover:bg-orange-50 hover:text-orange-700 rounded-xl transition-colors flex-shrink-0">
            🍎 {getLocalizedCategoryName('fruits', 'Fruits', i18n.language)}
          </Link>
          <Link to="/category/rice-grains-and-dals" className="px-3 py-1.5 hover:bg-amber-50 hover:text-amber-800 rounded-xl transition-colors flex-shrink-0">
            🌾 {getLocalizedCategoryName('rice-grains-and-dals', 'Rice & Dals', i18n.language)}
          </Link>
          <Link to="/category/cooking-oil-and-ghee" className="px-3 py-1.5 hover:bg-amber-50 hover:text-amber-900 rounded-xl transition-colors flex-shrink-0">
            🌻 {getLocalizedCategoryName('cooking-oil-and-ghee', 'Oils & Ghee', i18n.language)}
          </Link>
          <Link to="/category/milk-and-dairy" className="px-3 py-1.5 hover:bg-sky-50 hover:text-sky-700 rounded-xl transition-colors flex-shrink-0">
            🥛 {getLocalizedCategoryName('milk-and-dairy', 'Milk & Dairy', i18n.language)}
          </Link>
          <Link to="/category/daily-essentials" className="px-3 py-1.5 hover:bg-lime-50 hover:text-lime-800 rounded-xl transition-colors flex-shrink-0">
            ✨ {getLocalizedCategoryName('daily-essentials', 'Daily Essentials', i18n.language)}
          </Link>
          <Link to="/help" className="ml-auto text-emerald-700 font-extrabold hover:underline flex-shrink-0 pl-2">
            {t('nav.help')}
          </Link>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-emerald-100 px-5 py-4 space-y-3 shadow-xl">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-extrabold text-[#218838] py-1"
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-gray-800 py-1"
          >
            {t('nav.allGroceries')}
          </Link>
          <Link
            to="/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-gray-800 py-1"
          >
            {t('nav.myOrders')}
          </Link>
          <Link
            to="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-gray-800 py-1"
          >
            {t('nav.cart')} ({cart?.itemCount || 0})
          </Link>
          <Link
            to="/help"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-gray-800 py-1"
          >
            {t('nav.help')}
          </Link>
          <div className="pt-3 border-t border-gray-100">
            {user ? (
              <div className="flex justify-between items-center py-1">
                <span className="text-xs text-gray-700 font-extrabold">Signed in as {user.name}</span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-red-600 font-extrabold bg-red-50 px-2 py-1 rounded"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-gray-100 text-gray-800 text-xs font-black rounded-xl"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-gradient-to-r from-[#218838] to-[#14532D] text-white text-xs font-black rounded-xl shadow-md"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
