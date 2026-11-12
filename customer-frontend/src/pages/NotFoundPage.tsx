import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto my-16 text-center bg-white rounded-3xl border border-gray-100 p-10 shadow-sm space-y-4">
      <span className="text-5xl font-extrabold text-[#218838]">404</span>
      <h1 className="text-xl font-extrabold text-[#14532D]">
        Page Not Found
      </h1>
      <p className="text-xs text-gray-500">
        The grocery page or item you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#218838] hover:bg-[#14532D] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
};
