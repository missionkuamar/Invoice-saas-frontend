// frontend/src/components/affiliate/AffiliateStats.jsx
import React from 'react';
import { FaLink, FaUsers, FaChartLine, FaMoneyBill } from 'react-icons/fa';
import { useTheme } from '../../themes/ThemeProvider';

const AffiliateStats = ({ stats, earnings }) => {
  const { theme } = useTheme();

  const statsData = [
    {
      label: 'Total Clicks',
      value: stats?.totalClicks || 0,
      icon: FaLink,
      color: theme.colors.primary,
      bgColor: theme.colors.background,
    },
    {
      label: 'Referrals',
      value: stats?.totalReferrals || 0,
      icon: FaUsers,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Conversion Rate',
      value: `${stats?.conversionRate || 0}%`,
      icon: FaChartLine,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      label: 'Total Earnings',
      value: `₹${earnings?.toFixed(2) || 0}`,
      icon: FaMoneyBill,
      color: theme.colors.primary,
      bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
      highlight: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${theme.colors.card} p-4 rounded-2xl border ${theme.colors.border} ${stat.highlight ? `border-2 ${theme.colors.primary} border-opacity-30` : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 md:p-3 rounded-xl ${stat.bgColor}`}>
                <Icon className={`${stat.color} text-lg md:text-xl`} />
              </div>
              <div>
                <p className={`text-xs md:text-sm ${theme.colors.text} opacity-70`}>{stat.label}</p>
                <p className={`text-lg md:text-2xl font-bold ${stat.highlight ? theme.colors.primary : theme.colors.text}`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AffiliateStats;