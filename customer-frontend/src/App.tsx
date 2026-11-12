import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Mic } from 'lucide-react';

import { AuthProvider } from './contexts/AuthContext.js';
import { CartProvider } from './contexts/CartContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { VoiceAssistantModal } from './components/VoiceAssistantModal.js';
import { KioskBottomBar } from './components/KioskBottomBar.js';

import { HomePage } from './pages/HomePage.js';
import { AllGroceriesPage } from './pages/AllGroceriesPage.js';
import { CategoryPage } from './pages/CategoryPage.js';
import { ProductDetailPage } from './pages/ProductDetailPage.js';
import { SearchResultsPage } from './pages/SearchResultsPage.js';
import { CartPage } from './pages/CartPage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';
import { QRPaymentPage } from './pages/QRPaymentPage.js';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage.js';
import { MyOrdersPage } from './pages/MyOrdersPage.js';
import { OrderTrackingPage } from './pages/OrderTrackingPage.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage.js';
import { HelpPage } from './pages/HelpPage.js';
import { TermsPage } from './pages/TermsPage.js';
import { PrivacyPage } from './pages/PrivacyPage.js';
import { NotFoundPage } from './pages/NotFoundPage.js';

export const App: React.FC = () => {
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-[#F7FAF5] text-gray-900 selection:bg-green-100 selection:text-green-900">
            <Navbar onOpenVoice={() => setVoiceModalOpen(true)} />

            <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-24">
              <Routes>
                <Route path="/" element={<HomePage onOpenVoice={() => setVoiceModalOpen(true)} />} />
                <Route path="/products" element={<AllGroceriesPage />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment/:orderId" element={<QRPaymentPage />} />
                <Route path="/order-confirmed/:orderId" element={<OrderConfirmationPage />} />
                <Route path="/orders" element={<MyOrdersPage />} />
                <Route path="/orders/:orderId" element={<OrderTrackingPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            <Footer />

            {/* Persistent Kiosk Bottom Basket Bar */}
            <KioskBottomBar onOpenVoice={() => setVoiceModalOpen(true)} />

            {/* Floating Persistent Voice Assistant Button */}
            <div className="fixed bottom-6 right-6 z-40">
              <button
                onClick={() => setVoiceModalOpen(true)}
                className="w-14 h-14 rounded-full bg-[#218838] hover:bg-[#14532D] text-white shadow-xl shadow-green-900/30 flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 border-2 border-white/50 group"
                title="Open Voice Assistant"
              >
                <Mic className="w-6 h-6 animate-pulse group-hover:scale-110 transition-transform" />
                <span className="sr-only">Voice Assistant</span>
              </button>
            </div>

            {/* Voice Assistant Modal */}
            <VoiceAssistantModal
              isOpen={voiceModalOpen}
              onClose={() => setVoiceModalOpen(false)}
            />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
