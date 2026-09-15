// frontend/src/components/admin/withdrawals/AdminWithdrawalsHeader.jsx
import React from 'react';
import { FaWallet, FaSpinner } from 'react-icons/fa';
import { useTheme } from '../../../themes/ThemeProvider';

const AdminWithdrawalsHeader = ({ onRefresh, loading, totalWithdrawals }) => {
  const { theme } = useTheme();

  return (
    <div className={`${theme.colors.card} rounded-2xl p-4 md:p-6 border ${theme.colors.border}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${theme.colors.text} flex items-center gap-2`}>
            <FaWallet className="text-purple-500" />
            Withdrawal Management
          </h1>
          <p className={`text-sm md:text-base ${theme.colors.text} opacity-70 mt-1`}>
            {totalWithdrawals} withdrawals found
          </p>
        </div>
        <button 
          onClick={onRefresh}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-colors text-sm w-full sm:w-auto justify-center`}
        >
          {loading ? <FaSpinner className="animate-spin" /> : <FaSpinner className={loading ? 'animate-spin' : ''} />}
          Refresh
        </button>
      </div>
    </div>
  );
};

export default AdminWithdrawalsHeader;