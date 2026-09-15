// frontend/src/components/affiliate/WithdrawalFilters.jsx
import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useTheme } from '../../themes/ThemeProvider';

const WithdrawalFilters = ({ filters, onFilterChange }) => {
  const { theme } = useTheme();

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleClear = () => {
    onFilterChange({
      status: '',
      startDate: '',
      endDate: '',
      search: '',
      paymentMethod: '',
    });
  };

  return (
    <div className={`${theme.colors.card} rounded-2xl p-4 border ${theme.colors.border}`}>
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <div className="relative">
            <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.colors.text} opacity-40`} />
            <input
              type="text"
              name="search"
              placeholder="Search by transaction ID..."
              value={filters.search}
              onChange={handleChange}
              className={`w-full pl-9 pr-3 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
            />
          </div>
        </div>
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className={`px-3 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm w-full md:w-auto`}
        >
          <option value="">All Status</option>
          <option value="pending">⏳ Pending</option>
          <option value="approved">✅ Approved</option>
          <option value="processing">🔄 Processing</option>
          <option value="completed">🎉 Completed</option>
          <option value="failed">❌ Failed</option>
          <option value="cancelled">🚫 Cancelled</option>
        </select>
        <select
          name="paymentMethod"
          value={filters.paymentMethod}
          onChange={handleChange}
          className={`px-3 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm w-full md:w-auto`}
        >
          <option value="">All Methods</option>
          <option value="bank">🏦 Bank</option>
          <option value="upi">📱 UPI</option>
          <option value="paypal">💳 PayPal</option>
        </select>
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleChange}
          className={`px-3 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm w-full md:w-auto`}
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleChange}
          className={`px-3 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm w-full md:w-auto`}
        />
        <button
          onClick={handleClear}
          className={`px-4 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-colors text-sm flex items-center gap-2 w-full md:w-auto justify-center`}
        >
          <FaTimes /> Clear
        </button>
      </div>
    </div>
  );
};

export default WithdrawalFilters;