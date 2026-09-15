// frontend/src/components/admin/withdrawals/AdminWithdrawalsStats.jsx
import React from 'react';
import { FaWallet, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useTheme } from '../../../themes/ThemeProvider';

const AdminWithdrawalsStats = ({ withdrawals }) => {
  const { theme } = useTheme();

  const total = withdrawals.length;
  const pending = withdrawals.filter(w => w?.status === 'pending').length;
  const approved = withdrawals.filter(w => w?.status === 'approved').length;
  const completed = withdrawals.filter(w => w?.status === 'completed').length;
  const failed = withdrawals.filter(w => w?.status === 'failed').length;
  const totalAmount = withdrawals.reduce((sum, w) => sum + w?.amount, 0);

  const stats = [
    {
      label: 'Total Requests',
      value: total,
      icon: FaWallet,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Pending',
      value: pending,
      icon: FaClock,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      highlight: pending > 0,
    },
    {
      label: 'Completed',
      value: completed,
      icon: FaCheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Total Amount',
      value: `₹${totalAmount.toFixed(2)}`,
      icon: FaWallet,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${theme.colors.card} p-4 rounded-2xl border ${theme.colors.border} ${stat.highlight ? `border-2 ${theme.colors.primary} border-opacity-30` : ''}`}
          >
            <div className="flex items-center justify-between">
              <div className={`${stat.bgColor} p-2 md:p-3 rounded-xl`}>
                <Icon className={`${stat.textColor} text-lg md:text-xl`} />
              </div>
            </div>
            <p className={`text-xl md:text-2xl lg:text-3xl font-bold ${theme.colors.text} mt-2`}>
              {stat.value}
            </p>
            <p className={`text-xs md:text-sm ${theme.colors.text} opacity-70`}>
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default AdminWithdrawalsStats;