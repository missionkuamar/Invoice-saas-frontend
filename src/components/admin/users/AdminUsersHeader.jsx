// frontend/src/components/admin/users/AdminUsersHeader.jsx
import React from 'react';
import { FaUserPlus, FaSync, FaSpinner } from 'react-icons/fa';
import { useTheme } from '../../../themes/ThemeProvider';

const AdminUsersHeader = ({ totalUsers, onRefresh, loading }) => {
  const { theme } = useTheme();

  return (
    <div className={`${theme.colors.card} rounded-2xl p-4 md:p-6 border ${theme.colors.border}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${theme.colors.text}`}>
            👥 User Management
          </h1>
          <p className={`text-sm md:text-base ${theme.colors.text} opacity-70 mt-1`}>
            Total Users: <span className={`font-semibold ${theme.colors.primary}`}>{totalUsers}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={onRefresh}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-colors text-sm`}
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaSync />}
            Refresh
          </button>
          <button className={`${theme.colors.button} text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:scale-105 transition-all text-sm w-full sm:w-auto justify-center`}>
            <FaUserPlus /> Add User
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersHeader;