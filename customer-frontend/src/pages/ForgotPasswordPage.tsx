import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, KeyRound, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { ApiService } from '../services/api.js';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [devToken, setDevToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'REQUEST' | 'RESET'>('REQUEST');

  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await ApiService.forgotPassword(email);
      const token = res.data.data?.devResetToken;
      if (token) {
        setDevToken(token);
        setStep('RESET');
        setMessage('Reset token generated successfully! Enter your new password below.');
      } else {
        setMessage(res.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error processing request');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!devToken) return;
    setLoading(true);
    setError(null);
    try {
      await ApiService.resetPassword({
        email,
        token: devToken,
        newPassword
      });
      setMessage('Password reset successful! You can now log in with your new password.');
      setStep('REQUEST');
      setDevToken(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-extrabold text-[#14532D]">
          Password Reset
        </h1>
        <p className="text-xs text-gray-500">
          Enter your registered email to reset your GrocerGo account password
        </p>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl flex items-center space-x-2 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center space-x-2 text-xs font-bold">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {step === 'REQUEST' ? (
        <form onSubmit={handleRequestToken} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Registered Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@grocergo.com"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#218838] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#218838] hover:bg-[#14532D] text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Send Reset Instructions'}
          </button>

          <div className="text-center pt-2">
            <Link to="/login" className="text-xs text-[#218838] font-bold hover:underline">
              ← Back to Login
            </Link>
          </div>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="bg-green-50 p-3 rounded-xl border border-green-200 text-xs text-green-800">
            <p className="font-bold">Reset Token:</p>
            <p className="font-mono text-[10px] break-all">{devToken}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter at least 6 characters"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#218838] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#218838] hover:bg-[#14532D] text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Updating Password...' : 'Save New Password & Login'}
          </button>
        </form>
      )}
    </div>
  );
};
