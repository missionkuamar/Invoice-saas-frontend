// frontend/src/components/common/Navbar.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaBell, FaUserCircle, FaSignOutAlt, FaBars, FaTimes, FaSearch, FaChevronDown
} from 'react-icons/fa';
import { logout } from '../../store/slices/authSlice';
import { useTheme } from '../../themes/ThemeProvider';
import { Link } from 'react-router-dom';
import ThemeSwitcher from '../homepage/ThemeSwitcher';
import { useNavigate } from 'react-router-dom';



const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const dispatch = useDispatch();
   const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
    // ✅ Redirect to landing page instead of login
    navigate('/');
  };

  return (
    <nav className={`${theme.colors.card} border-b ${theme.colors.border} sticky top-0 z-30 backdrop-blur-md`}>
      <div className="px-3 md:px-6 py-2 md:py-3">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Sidebar Toggle Button - Always visible on all screens */}
            <button
              onClick={onToggleSidebar}
              className={`p-2 rounded-lg ${theme.colors.hover} transition-colors duration-200`}
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <FaTimes className={`${theme.colors.text} text-lg md:text-xl`} />
              ) : (
                <FaBars className={`${theme.colors.text} text-lg md:text-xl`} />
              )}
            </button>

            {/* Brand */}
            <div className="flex items-center gap-2">
              <Link to="/dashboard" className="flex items-center gap-2">
                <span className={`text-lg md:text-xl font-bold ${theme.colors.text} hidden sm:block`}>
                  Invoice<span className={`bg-gradient-to-r ${theme.colors.gradient} text-transparent bg-clip-text`}>Pro</span>
                </span>
                <span className={`text-sm ${theme.colors.text} opacity-70 sm:hidden`}>
                  IP
                </span>
              </Link>
              <span className={`hidden sm:inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse`}></span>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex items-center relative ml-4">
              <FaSearch className={`absolute left-3 ${theme.colors.text} opacity-40`} size={14} />
              <input
                type="text"
                placeholder="Search invoices, clients..."
                className={`pl-9 pr-4 py-1.5 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm w-48 xl:w-64 transition-all duration-200`}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1 md:gap-3">
            {/* Mobile Search Toggle */}
            {/* <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`lg:hidden p-2 rounded-lg ${theme.colors.hover} transition-colors duration-200`}
            >
              <FaSearch className={`${theme.colors.text} text-lg`} />
            </button> */}

            {/* Theme Switcher */}
            <ThemeSwitcher />

            {/* Notification Bell */}
            <button className={`relative p-2 rounded-full ${theme.colors.hover} transition-colors duration-200`}>
              <FaBell className={`${theme.colors.text} text-lg md:text-xl`} />
              {/* <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full shadow-lg shadow-red-500/50">
                3
              </span> */}
            </button>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-1 md:gap-3 p-1.5 md:p-2 rounded-xl ${theme.colors.hover} transition-colors duration-200`}
              >
                <div className="relative">
                  <FaUserCircle className={`${theme.colors.text} text-2xl md:text-3xl`} />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className={`${theme.colors.text} font-medium text-sm leading-tight`}>
                    {user?.name || 'User'}
                  </p>
                  <p className={`${theme.colors.text} opacity-50 text-[10px] leading-tight capitalize`}>
                    {user?.role || 'User'}
                  </p>
                </div>
                <FaChevronDown className={`${theme.colors.text} opacity-40 text-xs hidden sm:block`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className={`absolute right-0 mt-2 w-56 md:w-64 ${theme.colors.card} rounded-xl shadow-2xl border ${theme.colors.border} overflow-hidden z-50 animate-slideDown`}>
                    <div className={`px-4 py-3 border-b ${theme.colors.border}`}>
                      <div className="flex items-center gap-3">
                        <FaUserCircle className={`${theme.colors.text} text-4xl`} />
                        <div>
                          <p className={`text-sm font-semibold ${theme.colors.text}`}>
                            {user?.name || 'User'}
                          </p>
                          <p className={`text-xs ${theme.colors.text} opacity-60 truncate`}>
                            {user?.email || 'user@example.com'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        className={`block px-4 py-2.5 text-sm ${theme.colors.text} ${theme.colors.hover} transition-colors duration-150 flex items-center gap-3`}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="text-lg">📊</span> Dashboard
                      </Link>
                      <Link
                        to="/invoices"
                        className={`block px-4 py-2.5 text-sm ${theme.colors.text} ${theme.colors.hover} transition-colors duration-150 flex items-center gap-3`}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="text-lg">📄</span> Invoices
                      </Link>
                      <Link
                        to="/create-invoice"
                        className={`block px-4 py-2.5 text-sm ${theme.colors.text} ${theme.colors.hover} transition-colors duration-150 flex items-center gap-3`}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="text-lg">➕</span> Create Invoice
                      </Link>
                      <Link
                        to="/settings"
                        className={`block px-4 py-2.5 text-sm ${theme.colors.text} ${theme.colors.hover} transition-colors duration-150 flex items-center gap-3`}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="text-lg">⚙️</span> Settings
                      </Link>
                      <hr className={`${theme.colors.border} my-1`} />
                      <button
                        onClick={handleLogout}
                        className={`w-full text-left px-4 py-2.5 text-sm text-red-600 ${theme.colors.hover} transition-colors duration-150 flex items-center gap-3`}
                      >
                        <FaSignOutAlt /> Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 animate-slideDown">
            <div className="relative">
              <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.colors.text} opacity-40`} size={14} />
              <input
                type="text"
                placeholder="Search invoices, clients..."
                className={`w-full pl-9 pr-4 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200`}
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;