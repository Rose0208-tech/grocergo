import React, { useState } from 'react';
import { BarChart3, Download, FileSpreadsheet, Calendar } from 'lucide-react';
import { AdminApiService } from '../services/adminApi.js';

export const ReportsPage: React.FC = () => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownloadCsv = (type: 'orders' | 'inventory') => {
    setDownloading(type);
    const url = AdminApiService.getCsvExportUrl(type);
    window.open(url, '_blank');
    setTimeout(() => setDownloading(null), 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Reports & CSV Export Center
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Export full database records of customer orders, verified payments, and current warehouse stock valuations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Orders CSV Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Orders & Payments Master Report
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Includes complete order numbers, customer names, contact phone numbers, delivery addresses, subtotal, delivery charges, payment statuses, and timestamps.
            </p>
          </div>

          <button
            onClick={() => handleDownloadCsv('orders')}
            className="w-full py-3 bg-[#218838] hover:bg-[#14532D] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Orders CSV Report</span>
          </button>
        </div>

        {/* Inventory CSV Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Inventory Stock & Valuation Report
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Complete inventory breakdown with SKU codes, product names, category classifications, prices in INR, pack sizes, and current warehouse stock levels.
            </p>
          </div>

          <button
            onClick={() => handleDownloadCsv('inventory')}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Inventory CSV Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
