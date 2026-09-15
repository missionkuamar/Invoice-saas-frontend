// frontend/src/components/affiliate/AffiliateCommission.jsx
import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { useTheme } from '../../themes/ThemeProvider';

const AffiliateCommission = ({ affiliate }) => {
  const { theme } = useTheme();

  return (
    <div className={`${theme.colors.background} rounded-2xl p-4 border ${theme.colors.border}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <FaInfoCircle className={`${theme.colors.primary} text-xl flex-shrink-0 mt-1`} />
        <div>
          <p className={`font-semibold ${theme.colors.text}`}>💰 One-time Commission</p>
          <p className={`text-sm ${theme.colors.text} opacity-70`}>
            You earn {affiliate?.commissionRate || 10}% once when your referral subscribes
          </p>
        </div>
      </div>
    </div>
  );
};

export default AffiliateCommission;