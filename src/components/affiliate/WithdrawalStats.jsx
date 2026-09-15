// frontend/src/components/affiliate/WithdrawalStats.jsx
import React from 'react';
import { FaChartLine, FaWallet, FaDownload, FaClock } from 'react-icons/fa';
import { useTheme } from '../../themes/ThemeProvider';

const WithdrawalStats = ({ withdrawStats, withdrawals }) => {
  const { theme } = useTheme();

  const statsData = [
    {
      label: 'Total Earnings',
      value: `₹${(withdrawStats?.totalEarnings || 0).toFixed(2)}`,
      icon: FaChartLine,
      color: 'from-purple-500 to-pink-500',
      textColor: theme.colors.primary,
    },
    {
      label: 'Available Balance',
      value: `₹${(withdrawStats?.availableBalance || 0).toFixed(2)}`,
      icon: FaWallet,
      color: 'bg-green-500/20',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Total Withdrawn',
      value: `₹${(withdrawStats?.totalWithdrawn || 0).toFixed(2)}`,
      icon: FaDownload,
      color: 'bg-blue-500/20',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Pending Withdrawals',
      value: `₹${(withdrawStats?.pendingWithdrawals || 0).toFixed(2)}`,
      icon: FaClock,
      color: 'bg-yellow-500/20',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      highlight: true,
    },
  ];

  const statusCounts = [
    { label: 'Total', value: withdrawals.length, color: theme.colors.text },
    { label: 'Pending', value: withdrawals.filter(w => w.status === 'pending').length, color: 'text-yellow-600' },
    { label: 'Processing', value: withdrawals.filter(w => w.status === 'processing').length, color: 'text-purple-600' },
    { label: 'Completed', value: withdrawals.filter(w => w.status === 'completed').length, color: 'text-green-600' },
    { label: 'Failed', value: withdrawals.filter(w => w.status === 'failed').length, color: 'text-red-600' },
    { label: 'Cancelled', value: withdrawals.filter(w => w.status === 'cancelled').length, color: 'text-gray-600' },
  ];

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${theme.colors.card} p-4 rounded-2xl border ${theme.colors.border} ${stat.highlight ? `border-2 ${theme.colors.primary} border-opacity-30` : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs md:text-sm ${theme.colors.text} opacity-70`}>{stat.label}</p>
                  <p className={`text-lg md:text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                </div>
                <div className={`p-2 md:p-3 rounded-xl ${stat.color.startsWith('from') ? `bg-gradient-to-r ${stat.color}` : stat.color}`}>
                  <Icon className={`${stat.color.startsWith('from') ? 'text-white' : ''} text-lg md:text-xl`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats Summary */}
      <div className={`${theme.colors.background} rounded-2xl p-4 border ${theme.colors.border}`}>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
          {statusCounts.map((status, index) => (
            <div key={index} className="text-center">
              <p className={`text-xs ${theme.colors.text} opacity-60`}>{status.label}</p>
              <p className={`text-sm md:text-base font-bold ${status.color}`}>{status.value}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default WithdrawalStats;