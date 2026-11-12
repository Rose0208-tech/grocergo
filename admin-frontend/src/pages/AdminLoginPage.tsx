import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext.js';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@grocergo.com');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Authentication failed. Verify credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F291E] flex flex-col justify-center items-center p-4 selection:bg-green-300 selection:text-green-950">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#218838] flex items-center justify-center text-white mx-auto shadow-lg shadow-green-900/40 text-3xl">
            🛒
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            GrocerGo Administrator Console
          </h1>
          <p className="text-xs text-green-200">
            Secure administrative control, QR settings, and order verification
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-2xl flex items-center space-x-2 text-xs font-bold backdrop-blur-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/15 p-8 shadow-2xl space-y-4 text-white">
          <div>
            <label className="block text-xs font-bold text-green-100 mb-1">
              Admin Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-black/20 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#218838]"
              />
              <Mail className="w-4 h-4 text-green-300 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-green-100 mb-1">
              Admin Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-black/20 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#218838]"
              />
              <Lock className="w-4 h-4 text-green-300 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#218838] hover:bg-[#28a745] text-white font-extrabold text-xs rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Console'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 text-center text-[10px] text-green-300">
            Default credentials pre-filled for immediate review (admin@grocergo.com / Admin@123)
          </div>
        </form>
      </div>
    </div>
  );
};
