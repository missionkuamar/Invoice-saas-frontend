// frontend/src/components/affiliate/AffiliateHeader.jsx
import React from 'react';
import { FaHistory, FaWallet } from 'react-icons/fa';
import { useTheme } from '../../themes/ThemeProvider';

const AffiliateHeader = ({ affiliate, onToggleHistory, showHistory, onWithdraw }) => {
  const { theme } = useTheme();

  return (
    <div className={`${theme.colors.card} rounded-2xl p-4 md:p-6 border ${theme.colors.border}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${theme.colors.text}`}>
            🤝 Affiliate Dashboard
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-sm ${theme.colors.text} opacity-70`}>
              Code:
            </span>
            <code className={`${theme.colors.background} px-2 md:px-3 py-1 rounded-lg text-sm font-mono ${theme.colors.text}`}>
              {affiliate?.affiliateCode}
            </code>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={onToggleHistory}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-colors text-sm`}
          >
            <FaHistory /> {showHistory ? 'Hide' : 'Show'} History
          </button>
          <button
            onClick={onWithdraw}
            className={`${theme.colors.button} text-white px-3 md:px-4 py-2 rounded-xl flex items-center gap-2 hover:scale-105 transition-all text-sm`}
          >
            <FaWallet /> Withdraw
          </button>
        </div>
      </div>
    </div>
  );
};

export default AffiliateHeader;