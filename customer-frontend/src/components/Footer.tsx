import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Headphones, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16 pt-12 pb-8">
      {/* 4 Feature Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[#218838]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">100% Farm Fresh</h4>
              <p className="text-xs text-gray-500">Unpolished rice, dals & staples</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[#218838]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Direct Town Delivery</h4>
              <p className="text-xs text-gray-500">Free delivery over ₹300</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[#218838]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Easy Manual UPI QR</h4>
              <p className="text-xs text-gray-500">Pay safely via any UPI app</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[#218838]">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Regional Support</h4>
              <p className="text-xs text-gray-500">Tamil, Hindi, Telugu & more</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl">🛒</span>
            <span className="text-xl font-extrabold text-[#14532D]">
              Grocer<span className="text-[#218838]">Go</span>
            </span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            GrocerGo is India's dedicated grocery ordering platform for rural, semi-urban towns, and village communities.
          </p>
          <div className="mt-4 text-xs font-semibold text-gray-700">
            Helpline: <a href="tel:7010358990" className="text-[#218838] hover:underline font-bold">7010358990</a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">Quick Navigation</h4>
          <ul className="space-y-2 text-xs text-gray-600">
            <li><Link to="/" className="hover:text-[#218838]">Home</Link></li>
            <li><Link to="/products" className="hover:text-[#218838]">All Groceries</Link></li>
            <li><Link to="/category/fruits" className="hover:text-[#218838]">Fresh Fruits</Link></li>
            <li><Link to="/category/vegetables" className="hover:text-[#218838]">Fresh Vegetables</Link></li>
            <li><Link to="/category/rice-grains-and-dals" className="hover:text-[#218838]">Rice, Grains & Dals</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">Customer Care</h4>
          <ul className="space-y-2 text-xs text-gray-600">
            <li><Link to="/orders" className="hover:text-[#218838]">My Orders & Tracking</Link></li>
            <li><Link to="/cart" className="hover:text-[#218838]">Shopping Cart</Link></li>
            <li><Link to="/help" className="hover:text-[#218838]">Help & FAQs</Link></li>
            <li><Link to="/profile" className="hover:text-[#218838]">Customer Profile</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">Trust & Legal</h4>
          <ul className="space-y-2 text-xs text-gray-600">
            <li><Link to="/terms" className="hover:text-[#218838]">Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="hover:text-[#218838]">Privacy Policy</Link></li>
            <li><span className="text-gray-400">Manual UPI QR Verification</span></li>
            <li><span className="text-gray-400">Zero Gateway Charges</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400">
        <p>© 2026 GrocerGo Technologies Pvt. Ltd. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">Designed for rural and semi-urban communities across India.</p>
      </div>
    </footer>
  );
};
