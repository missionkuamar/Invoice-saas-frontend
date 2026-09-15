// frontend/src/components/admin/AdminStats.jsx
import React from 'react';
import { 
  FaUsers, FaFileInvoice, FaMoneyBill, FaCreditCard,
  FaUserPlus, FaWallet, FaExclamationTriangle
} from 'react-icons/fa';
import { useTheme } from '../../themes/ThemeProvider';

const AdminStats = ({ stats }) => {
  const { theme } = useTheme();

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers || 0,
      icon: FaUsers,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      change: '+12%',
    },
    {
      title: 'Total Invoices',
      value: stats.totalInvoices || 0,
      icon: FaFileInvoice,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      change: '+8%',
    },
    {
      title: 'Revenue',
      value: `₹${(stats.totalRevenue || 0).toLocaleString()}`,
      icon: FaMoneyBill,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
      change: '+15%',
    },
    {
      title: 'Active Subscriptions',
      value: stats.activeSubscriptions || 0,
      icon: FaCreditCard,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
      change: '+5%',
    },
    {
      title: 'Total Companies',
      value: stats.totalCompanies || 0,
      icon: FaUserPlus,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
      textColor: 'text-cyan-600 dark:text-cyan-400',
      change: '+10%',
    },
    {
      title: 'Pending Withdrawals',
      value: stats.pendingWithdrawals || 0,
      icon: FaWallet,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      change: stats.pendingWithdrawals > 0 ? '⚠️ Needs attention' : '✓ All clear',
      warning: stats.pendingWithdrawals > 0,
    },
    {
      title: 'Total Withdrawals',
      value: `₹${(stats.totalWithdrawals || 0).toLocaleString()}`,
      icon: FaWallet,
      color: 'from-pink-500 to-rose-600',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      textColor: 'text-pink-600 dark:text-pink-400',
      change: '+7%',
    },
    {
      title: 'System Status',
      value: 'Online',
      icon: FaExclamationTriangle,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      change: '✅ All systems operational',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${theme.colors.card} p-4 md:p-5 rounded-2xl border ${theme.colors.border} hover:shadow-lg transition-all hover:scale-[1.02] ${stat.warning ? 'border-yellow-500/50' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className={`${stat.bgColor} p-2 md:p-3 rounded-xl`}>
                <Icon className={`${stat.textColor} text-lg md:text-xl`} />
              </div>
              {stat.change && (
                <span className={`text-xs font-medium ${stat.warning ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'} hidden sm:inline`}>
                  {stat.change}
                </span>
              )}
            </div>
            <p className={`text-xl md:text-2xl lg:text-3xl font-bold ${theme.colors.text} mt-3`}>
              {stat.value}
            </p>
            <p className={`text-xs md:text-sm ${theme.colors.text} opacity-70`}>
              {stat.title}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default AdminStats;