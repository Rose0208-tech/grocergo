import React, { useEffect, useState } from 'react';
import { QrCode, Upload, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { AdminApiService } from '../services/adminApi.js';

export const QRSettingsPage: React.FC = () => {
  const [upiId, setUpiId] = useState('');
  const [accountName, setAccountName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await AdminApiService.getPaymentSettings();
      const s = res.data.data.settings;
      if (s) {
        setUpiId(s.upiId || 'grocergo@upi');
        setAccountName(s.accountName || 'GrocerGo Rural Direct');
        setInstructions(s.instructions || '');
        setQrImageUrl(s.qrImageUrl || '');
        setIsActive(Boolean(s.isActive));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setSelectedFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    }
  };

  const formatImageUrl = (url?: string | null) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    return `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      let activeQrUrl = qrImageUrl;
      // 1. If file uploaded, send QR image
      if (selectedFile) {
        const formData = new FormData();
        formData.append('qrImage', selectedFile);
        const res = await AdminApiService.uploadQrCode(formData);
        activeQrUrl = res.data.data.qrImageUrl;
        setQrImageUrl(activeQrUrl);
        setSelectedFile(null);
        setPreviewUrl(null);
      }

      // 2. Save text settings with qrImageUrl
      await AdminApiService.updatePaymentSettings({
        upiId,
        accountName,
        instructions,
        isActive,
        qrImageUrl: activeQrUrl
      });

      setMessage('Payment and QR code settings saved successfully! Customer checkout will now display this active configuration.');
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save QR payment settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="h-96 bg-white rounded-3xl animate-pulse" />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Store UPI QR Code & Payment Instructions
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure the active UPI QR code and payment steps displayed to customers during checkout
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

      <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* QR Preview & Upload Section */}
        <div className="text-center space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Current Active QR Code Preview
          </span>

          <div className="inline-block p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <img
              src={previewUrl || formatImageUrl(qrImageUrl) || '/placeholder.svg'}
              alt="Store QR Code"
              className="w-48 h-48 object-contain rounded-lg mx-auto"
            />
          </div>

          <div>
            <label className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Replacement QR Code Image</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {selectedFile && (
              <p className="text-[10px] text-green-700 font-bold mt-1">
                Selected: {selectedFile.name} (Click Save to apply)
              </p>
            )}
          </div>
        </div>

        {/* UPI ID & Account Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Store UPI ID *
            </label>
            <input
              type="text"
              required
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="grocergo@upi"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Store Account Holder Name *
            </label>
            <input
              type="text"
              required
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="GrocerGo Rural Direct Store"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            />
          </div>
        </div>

        {/* Payment Instructions for Customers */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Customer Payment Instructions *
          </label>
          <textarea
            required
            rows={4}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="1. Scan QR code using GPay, PhonePe, Paytm, or BHIM..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
          />
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <input
            type="checkbox"
            id="qrActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded text-[#218838]"
          />
          <label htmlFor="qrActive" className="text-xs font-bold text-slate-700 cursor-pointer">
            QR Payment Active and enabled for customer checkouts
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-[#218838] hover:bg-[#14532D] text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Updating Settings...' : 'Save & Publish QR Settings'}</span>
        </button>
      </form>
    </div>
  );
};
