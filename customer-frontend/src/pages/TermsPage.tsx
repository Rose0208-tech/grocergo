import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-sm space-y-5 text-xs text-gray-600 leading-relaxed">
      <h1 className="text-2xl font-extrabold text-[#14532D]">
        Terms and Conditions
      </h1>
      <p className="text-gray-400">Last updated: October 2026</p>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-gray-900">1. Acceptance of Terms</h2>
        <p>By accessing and using GrocerGo, you agree to comply with these terms, designed to deliver transparent, farm-fresh groceries to village and semi-urban residents across India.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-gray-900">2. Manual UPI QR Payments</h2>
        <p>GrocerGo operates exclusively with a transparent manual UPI QR verification flow. Customers scan the active store QR code on their own UPI app and upload a payment screenshot with the 12-digit UTR reference. GrocerGo does not integrate third-party payment gateways, does not automatically debit accounts, and never requests card details, OTPs, or UPI PINs.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-gray-900">3. Stock & Deliveries</h2>
        <p>Product prices are in Indian Rupees (INR) and are validated at checkout. In the event an item becomes unavailable after order placement, our logistics team will notify the customer and promptly adjust or refund the order.</p>
      </section>
    </div>
  );
};
