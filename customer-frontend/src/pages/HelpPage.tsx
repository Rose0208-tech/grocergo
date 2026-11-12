import React from 'react';
import { HelpCircle, Phone, Mail, MapPin, MessageSquare } from 'lucide-react';

export const HelpPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-[#14532D]">
          Help, Support & FAQs
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Everything you need to know about ordering, manual UPI QR payments, and rural deliveries
        </p>
      </div>

      {/* Support Contact Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
          <Phone className="w-6 h-6 text-[#218838] mx-auto mb-2" />
          <h4 className="font-bold text-xs text-gray-900">Phone Support</h4>
          <a href="tel:7010358990" className="text-xs text-[#218838] font-bold mt-1 hover:underline block">7010358990</a>
          <p className="text-[10px] text-gray-400 mt-0.5">7:00 AM - 9:00 PM Daily</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
          <Mail className="w-6 h-6 text-[#218838] mx-auto mb-2" />
          <h4 className="font-bold text-xs text-gray-900">Email Help</h4>
          <p className="text-xs text-[#218838] font-bold mt-1">support@grocergo.com</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Response within 2 hours</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
          <MapPin className="w-6 h-6 text-[#218838] mx-auto mb-2" />
          <h4 className="font-bold text-xs text-gray-900">Hubli Hub Centre</h4>
          <p className="text-xs text-gray-700 font-medium mt-1">Market Road, Near Mandi</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Rural Distribution Centre</p>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-base font-extrabold text-gray-900 flex items-center space-x-2">
          <HelpCircle className="w-4 h-4 text-[#218838]" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="space-y-4 divide-y divide-gray-100 text-xs">
          <div className="pt-3">
            <h4 className="font-bold text-gray-900 mb-1">
              How does the manual QR code payment work?
            </h4>
            <p className="text-gray-600 leading-relaxed">
              When you confirm your order, a store UPI QR code is displayed on your screen along with the exact total amount. Open Google Pay, PhonePe, Paytm, or BHIM, scan the code, complete the transfer, take a screenshot of the receipt showing your 12-digit UTR reference, and upload it right on the page. Our team manually verifies the receipt and approves your order.
            </p>
          </div>

          <div className="pt-3">
            <h4 className="font-bold text-gray-900 mb-1">
              Do you ask for bank passwords, OTPs, or UPI PINs?
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Never! GrocerGo will never ask for your UPI PIN, banking passwords, OTPs, or card details. You only pay through your own trusted UPI application.
            </p>
          </div>

          <div className="pt-3">
            <h4 className="font-bold text-gray-900 mb-1">
              How can I order in my local language?
            </h4>
            <p className="text-gray-600 leading-relaxed">
              GrocerGo supports English, Tamil (தமிழ்), Hindi (हिन्दी), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), and Malayalam (മലയാളം). Click the language selector in the top navigation bar or simply tap the microphone button and say "Change language to Tamil".
            </p>
          </div>

          <div className="pt-3">
            <h4 className="font-bold text-gray-900 mb-1">
              What is the delivery fee policy?
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Orders of ₹500 and above are delivered completely FREE of charge. For orders below ₹500, a flat nominal delivery fee of ₹30 is applied.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
