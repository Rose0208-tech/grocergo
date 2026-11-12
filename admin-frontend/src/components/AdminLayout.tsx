import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  ShoppingBag,
  FileCheck2,
  Users,
  QrCode,
  BarChart3,
  History,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext.js';

export const AdminLayout: React.FC = () => {
  const { adminUser, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Categories', path: '/categories', icon: Layers },
    { name: 'Inventory', path: '/inventory', icon: Boxes },
    { name: 'Orders', path: '/orders', icon: ShoppingBag },
    { name: 'Payment Verification', path: '/payments', icon: FileCheck2 },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'QR Payment Settings', path: '/qr-settings', icon: QrCode },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Admin Activity Logs', path: '/activity-logs', icon: History }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0F291E] text-white flex flex-col justify-between transition-transform duration-200 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo & Platform Info */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#218838] flex items-center justify-center text-white shadow-md">
                <span className="text-2xl">🛒</span>
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white">
                  Grocer<span className="text-[#218838]">Go</span>
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-green-300">
                  Operations Console
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#218838] text-white shadow-sm shadow-green-900/30'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1 pr-2">
              <p className="text-xs font-bold text-white truncate">
                {adminUser?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-green-300 truncate font-mono">
                {adminUser?.email || 'admin@grocergo.com'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Body */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
              <ShieldCheck className="w-4 h-4 text-[#218838]" />
              <span>Admin Dashboard • Hubli Mandi Operations Hub</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center space-x-1.5 text-xs font-bold text-[#218838] hover:text-[#14532D] bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 transition-colors"
            >
              <span>View Customer Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="p-6 sm:p-8 flex-1 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
