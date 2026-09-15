// frontend/src/components/common/Layout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useTheme } from '../../themes/ThemeProvider';

const Layout = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // Close sidebar on mobile by default
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location, isMobile]);

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking outside (mobile)
  const handleOverlayClick = () => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className={`min-h-screen flex ${theme.colors.background}`}>
      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:sticky
        `}
        style={{ width: '280px', maxWidth: '80vw' }}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen w-full overflow-hidden">
        {/* Navbar */}
        <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* Page Content */}
        <main 
          className={`
            flex-1 overflow-y-auto p-3 md:p-4 lg:p-6 
            ${theme.colors.background}
            transition-all duration-300
          `}
        >
          <div className="max-w-7xl mx-auto">
            {/* Page Header - Dynamic based on route */}
            <div className="mb-4 md:mb-6">
              <h1 className={`text-xl md:text-2xl lg:text-3xl font-bold ${theme.colors.text}`}>
                {getPageTitle(location.pathname)}
              </h1>
              <p className={`text-sm md:text-base ${theme.colors.text} opacity-70 mt-1`}>
                {getPageDescription(location.pathname)}
              </p>
            </div>

            {/* This is where all page components will render */}
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className={`${theme.colors.card} border-t ${theme.colors.border} py-3 px-4 md:px-6 flex-shrink-0`}>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs md:text-sm">
            <p className={`${theme.colors.text} opacity-60`}>
              © {new Date().getFullYear()} InvoicePro. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className={`${theme.colors.text} opacity-60`}>
                v2.0.0
              </span>
              <span className={`${theme.colors.text} opacity-30`}>|</span>
              <span className={`${theme.colors.text} opacity-60`}>
                👋 Welcome, {user?.name || 'User'}
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

// Helper functions for page titles
const getPageTitle = (path) => {
  const titles = {
    '/dashboard': '📊 Dashboard',
    '/invoices': '📄 Invoices',
    '/create-invoice': '➕ Create Invoice',
    '/settings': '⚙️ Settings',
    '/subscription': '💳 Subscription',
    '/affiliate': '🤝 Affiliate',
    '/admin/dashboard': '📊 Admin Dashboard',
    '/admin/users': '👥 Users',
    '/admin/withdrawals': '💰 Withdrawals',
    '/admin/notifications': '🔔 Notifications',
  };
  
  if (path.includes('/create-invoice/')) {
    return '➕ Create Invoice';
  }
  if (path.includes('/invoices/')) {
    return '📄 Invoice Details';
  }
  if (path.includes('/admin/users/')) {
    return '👤 User Details';
  }
  
  return titles[path] || '📄 Page';
};

const getPageDescription = (path) => {
  const descriptions = {
    '/dashboard': 'Overview of your business performance',
    '/invoices': 'Manage and track all your invoices',
    '/create-invoice': 'Create a new professional invoice',
    '/settings': 'Customize your account settings',
    '/subscription': 'Manage your subscription plan',
    '/affiliate': 'Track your affiliate earnings',
    '/admin/dashboard': 'Admin overview and analytics',
    '/admin/users': 'Manage all users',
    '/admin/withdrawals': 'Manage withdrawal requests',
    '/admin/notifications': 'Send and manage notifications',
  };
  
  return descriptions[path] || '';
};

export default Layout;