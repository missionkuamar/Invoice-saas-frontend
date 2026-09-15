// frontend/src/components/common/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FaHome, FaFileInvoice, FaPlus, FaCog, FaCreditCard,
  FaUsers, FaChartBar, FaWallet, FaBell, FaShareAlt,
  FaChevronDown, FaChevronRight, FaPencilAlt, FaFileAlt,
  FaCopy, FaStar, FaPalette, FaBolt,
  FaGem, FaHistory, FaWaveSquare, FaSun, FaEye,
  FaLeaf, FaWater, FaCrown, FaSnowflake, FaMoon,
  FaTimes,
  FaVoicemail
} from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { SiMinutemailer } from "react-icons/si";
import { MdOutlineSchedule } from "react-icons/md";


const Sidebar = ({ onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const [pendingWithdrawals, setPendingWithdrawals] = useState(0);
  const [isCreateSubmenuOpen, setIsCreateSubmenuOpen] = useState(false);
const [isCreateEmailSubmenuOpen, setIsCreateEmailSubmenuOpen] = useState(false);
  useEffect(() => {
    if (isAdmin) {
      fetchPendingCount();
      const interval = setInterval(fetchPendingCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const fetchPendingCount = async () => {
    try {
      const response = await api.get('/admin/stats');
      setPendingWithdrawals(response.data.data.pendingWithdrawals || 0);
    } catch (error) {
     // console.error('Failed to fetch pending count:', error);
     toast.error(error.message || 'Internal server error');
    }
  };

  // Close sidebar on mobile when a link is clicked
  const handleLinkClick = () => {
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  // Close sidebar manually
  const handleClose = () => {
    if (onClose) onClose();
  };

  const userMenuItems = [
    { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
    {
  label: 'Create Invoice',
  icon: FaPlus,
  submenu: true,
  isOpen: isCreateSubmenuOpen,
  toggle: () => setIsCreateSubmenuOpen(!isCreateSubmenuOpen),
  submenuItems: [
    {
      path: '/create-invoice/simple',
      icon: FaFileAlt,
      label: 'Simple',
      description: 'Simple invoice'
    },
    // {
    //   path: '/create-invoice/standard',
    //   icon: FaFileAlt,
    //   label: 'Standard',
    //   description: 'Standard invoice'
    // },
    // {
    //   path: '/create-invoice/modern',
    //   icon: FaFileAlt,
    //   label: 'Modern',
    //   description: 'Modern design'
    // },
    // {
    //   path: '/create-invoice/minimal',
    //   icon: FaFileAlt,
    //   label: 'Minimal',
    //   description: 'Minimal template'
    // },
    // {
    //   path: '/create-invoice/professional',
    //   icon: FaFileAlt,
    //   label: 'Professional',
    //   description: 'Professional template'
    // },
    // {
    //   path: '/create-invoice/creative',
    //   icon: FaFileAlt,
    //   label: 'Creative',
    //   description: 'Creative style'
    // },
    // {
    //   path: '/create-invoice/vintage',
    //   icon: FaFileAlt,
    //   label: 'Vintage',
    //   description: 'Vintage paper'
    // },
    // {
    //   path: '/create-invoice/elegant',
    //   icon: FaFileAlt,
    //   label: 'Elegant',
    //   description: 'Elegant invoice'
    // },
    // {
    //   path: '/create-invoice/dark-luxe',
    //   icon: FaFileAlt,
    //   label: 'Dark Luxe',
    //   description: 'Luxury dark theme'
    // },
    // {
    //   path: '/create-invoice/nature',
    //   icon: FaFileAlt,
    //   label: 'Nature',
    //   description: 'Nature green theme'
    // },
    // {
    //   path: '/create-invoice/neon-glow',
    //   icon: FaFileAlt,
    //   label: 'Neon Glow',
    //   description: 'Neon style'
    // },
    // {
    //   path: '/create-invoice/ocean',
    //   icon: FaFileAlt,
    //   label: 'Ocean',
    //   description: 'Ocean blue theme'
    // },
    // {
    //   path: '/create-invoice/sunset',
    //   icon: FaFileAlt,
    //   label: 'Sunset',
    //   description: 'Sunset orange'
    // },
    // {
    //   path: '/create-invoice/royal',
    //   icon: FaFileAlt,
    //   label: 'Royal',
    //   description: 'Royal purple'
    // },
    // {
    //   path: '/create-invoice/glass',
    //   icon: FaFileAlt,
    //   label: 'Glass',
    //   description: 'Glassmorphism'
    // },
    // {
    //   path: '/create-invoice/nordic',
    //   icon: FaFileAlt,
    //   label: 'Nordic',
    //   description: 'Nordic minimal'
    // },
    // {
    //   path: '/create-invoice/wave',
    //   icon: FaFileAlt,
    //   label: 'Gradient Wave',
    //   description: 'Gradient wave style'
    // }
  ]
},
   { 
    label: 'Email Service',
     icon: HiOutlineMail, submenu: true,
     isOpen: isCreateEmailSubmenuOpen,
     toggle: () => setIsCreateEmailSubmenuOpen(!isCreateEmailSubmenuOpen),
      submenuItems: [
        { path: '/email-simple', icon: MdOutlineAlternateEmail, label: 'Simpe-Service', description: 'Simple-Mail' },
       
        { path: '/email-scheduled', icon: SiMinutemailer, label: 'Scheduled Email', description: 'Scheduled Mail' },
   
      ] },
    { path: '/invoices', icon: FaFileInvoice, label: 'All Invoices' },
    { path: '/subscription', icon: FaCreditCard, label: 'Subscription' },
    { path: '/affiliate', icon: FaShareAlt, label: 'Affiliate' },
    { path: '/settings', icon: FaCog, label: 'Settings' },
  ];

  const adminMenuItems = [
    { path: '/admin/dashboard', icon: FaChartBar, label: 'Dashboard' },
    { path: '/admin/users', icon: FaUsers, label: 'Users' },
    {
      path: '/admin/withdrawals',
      icon: FaWallet,
      label: 'Withdrawals',
      badge: pendingWithdrawals > 0 ? pendingWithdrawals : null,
    },
    { path: '/admin/notifications', icon: FaBell, label: 'Notifications' },
  ];

  const menuItems = isAdmin ? [...userMenuItems, ...adminMenuItems] : userMenuItems;

  const renderMenuItem = (item, index) => {
    if (item.submenu) {
      return (
        <div key={index} className="mb-1">
          <button
            onClick={item.toggle}
            className="w-full flex items-center justify-between px-3 md:px-4 py-2 md:py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm md:text-base"
          >
            <div className="flex items-center gap-2 md:gap-3">
              <item.icon size={18} className="md:w-5 md:h-5" />
              <span className="font-medium">{item.label}</span>
            </div>
            {item.isOpen ? <FaChevronDown size={12} className="md:w-3 md:h-3" /> : <FaChevronRight size={12} className="md:w-3 md:h-3" />}
          </button>

          {item.isOpen && (
            <div className="ml-4 md:ml-6 mt-1 space-y-1 border-l-2 border-gray-700 pl-2 md:pl-3">
              {item.submenuItems.map((subItem, subIndex) => (
                <NavLink
                  key={subIndex}
                  to={subItem.path}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-colors text-xs md:text-sm ${
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  <subItem.icon size={14} className="md:w-4 md:h-4" />
                  <div>
                    <div>{subItem.label}</div>
                    {subItem.description && (
                      <div className="text-[10px] md:text-xs text-gray-500 hidden sm:block">{subItem.description}</div>
                    )}
                  </div>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={index}
        to={item.path}
        onClick={handleLinkClick}
        className={({ isActive }) =>
          `flex items-center justify-between px-3 md:px-4 py-2 md:py-3 rounded-lg mb-1 transition-colors text-sm md:text-base ${
            isActive
              ? 'bg-primary-600 text-white'
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          }`
        }
      >
        <div className="flex items-center gap-2 md:gap-3">
          <item.icon size={18} className="md:w-5 md:h-5" />
          <span>{item.label}</span>
        </div>
        {item.badge && (
          <span className="bg-red-500 text-white text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full animate-pulse">
            {item.badge}
          </span>
        )}
      </NavLink>
    );
  };

  return (
    <aside 
      className={`h-full w-full bg-gray-900 text-white flex-shrink-0 overflow-y-auto flex flex-col`}
    >
      {/* Header with Close Button for Mobile */}
      <div className="p-4 md:p-6 border-b border-gray-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            Invoice<span className="text-primary-500">Pro</span>
            <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full hidden sm:inline">
              v2.0
            </span>
          </h1>
          {isAdmin && (
            <p className="text-[10px] md:text-xs text-gray-400 mt-1">
              {user?.role === 'super_admin' ? '👑 Super Admin' : '🛡️ Admin'}
            </p>
          )}
        </div>
        {/* Close button - visible only on mobile */}
        <button
          onClick={handleClose}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
          aria-label="Close sidebar"
        >
          <FaTimes className="text-white text-xl" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 md:px-4 py-4 pb-20 overflow-y-auto">
        {menuItems.map((item, index) => renderMenuItem(item, index))}
      </nav>

      {/* Bottom section with version info */}
      <div className="border-t border-gray-800 p-4 bg-gray-900/95 backdrop-blur">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>© 2024 InvoicePro</span>
          <span>v2.0.0</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;