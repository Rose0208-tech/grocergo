import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.js';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ email, password });
      navigate(redirect);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#218838] text-white flex items-center justify-center mx-auto shadow-md shadow-green-700/20 text-2xl">
          🛒
        </div>
        <h1 className="text-2xl font-extrabold text-[#14532D]">
          {t('auth.loginTitle')}
        </h1>
        <p className="text-xs text-gray-500">
          Enter your GrocerGo account details to manage your orders
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center space-x-2 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            {t('auth.email')}
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@grocergo.com"
              className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#218838] focus:outline-none"
            />
            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-gray-700">
              {t('auth.password')}
            </label>
            <Link
              to="/forgot-password"
              className="text-[11px] font-semibold text-[#218838] hover:underline"
            >
              {t('auth.forgotPassword')}
            </Link>
          </div>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#218838] focus:outline-none"
            />
            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#218838] hover:bg-[#14532D] text-white font-extrabold text-xs rounded-xl shadow-md shadow-green-700/20 flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
        >
          <span>{loading ? 'Logging in...' : t('nav.login')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-500">
          <Link to={`/register?redirect=${redirect}`} className="text-[#218838] font-bold hover:underline">
            {t('auth.dontHaveAccount')}
          </Link>
        </div>
      </form>
    </div>
  );
};
