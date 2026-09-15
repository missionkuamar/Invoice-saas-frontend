// frontend/src/components/affiliate/WithdrawalHeader.jsx
import React from 'react';
import { FaArrowLeft, FaWallet, FaChartLine } from 'react-icons/fa';
import { useTheme } from '../../themes/ThemeProvider';

const WithdrawalHeader = ({ onBack, onViewStats, onWithdraw, earnings }) => {
  const { theme } = useTheme();

  return (
    <div className={`${theme.colors.card} rounded-2xl p-4 md:p-6 border ${theme.colors.border}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`p-2 rounded-xl ${theme.colors.hover} transition-colors`}
          >
            <FaArrowLeft className={theme.colors.text} />
          </button>
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${theme.colors.text} flex items-center gap-2`}>
              💰 Withdrawals
            </h1>
            <p className={`text-sm ${theme.colors.text} opacity-70`}>
              Manage your withdrawals and track earnings
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={onViewStats}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-colors text-sm`}
          >
            <FaChartLine /> View Stats
          </button>
          <button
            onClick={onWithdraw}
            className={`${theme.colors.button} text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:scale-105 transition-all text-sm w-full sm:w-auto justify-center ${earnings < 100 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={earnings < 100}
          >
            <FaWallet /> Withdraw Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalHeader;