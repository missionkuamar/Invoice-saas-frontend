// frontend/src/components/admin/AdminHeader.jsx
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useTheme } from '../../themes/ThemeProvider';

const AdminHeader = ({ stats }) => {
  const { theme } = useTheme();

  return (
    <div className={`${theme.colors.card} rounded-2xl p-4 md:p-6 border ${theme.colors.border}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${theme.colors.text}`}>
            📊 Admin Dashboard
          </h1>
          <p className={`text-sm md:text-base ${theme.colors.text} opacity-70 mt-1`}>
            Overview of your platform's performance and analytics
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm flex items-center gap-1`}>
            <FaCheckCircle className="text-green-500" /> System Online
          </span>
          <span className={`${theme.colors.background} px-3 py-1 rounded-full text-sm ${theme.colors.text} opacity-70`}>
            {new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;