// frontend/src/components/admin/withdrawals/AdminWithdrawalsFilters.jsx
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { useTheme } from '../../../themes/ThemeProvider';

const AdminWithdrawalsFilters = ({ 
  filters, 
  searchTerm, 
  onStatusChange, 
  onSearch, 
  onClearFilters 
}) => {
  const { theme } = useTheme();

  return (
    <div className={`${theme.colors.card} rounded-2xl p-4 border ${theme.colors.border}`}>
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1">
          <div className="relative">
            <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.colors.text} opacity-40`} />
            <input
              type="text"
              placeholder="Search by user name or email..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
            />
          </div>
        </div>
        
        <select
          value={filters.status}
          onChange={(e) => onStatusChange(e.target.value)}
          className={`px-3 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm w-full lg:w-auto`}
        >
          <option value="">All Status</option>
          <option value="pending">⏳ Pending</option>
          <option value="approved">✅ Approved</option>
          <option value="processing">🔄 Processing</option>
          <option value="completed">🎉 Completed</option>
          <option value="failed">❌ Failed</option>
        </select>
        
        <button
          onClick={onClearFilters}
          className={`px-4 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-colors text-sm w-full lg:w-auto`}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default AdminWithdrawalsFilters;