import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-sm space-y-5 text-xs text-gray-600 leading-relaxed">
      <h1 className="text-2xl font-extrabold text-[#14532D]">
        Privacy Policy
      </h1>
      <p className="text-gray-400">Last updated: October 2026</p>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-gray-900">1. Customer Data Privacy</h2>
        <p>GrocerGo respects customer privacy. We collect your name, phone number, village/town, and delivery address solely for fulfilling grocery orders and communicating order statuses.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-gray-900">2. Payment Proof Confidentiality</h2>
        <p>Uploaded payment screenshots are stored in private backend directories and are strictly accessible only by the verified customer who placed the order and authorized administrators for verification purposes. Screenshots are never displayed publicly or shared with third parties.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-gray-900">3. Voice Data Processing</h2>
        <p>Voice assistant recognition utilizes browser Web Speech APIs. GrocerGo does not record or store your ambient voice audio on private servers; speech is processed into text directly within your browser.</p>
      </section>
    </div>
  );
};
