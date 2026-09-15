// frontend/src/components/admin/users/AdminUsersFilters.jsx
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { useTheme } from '../../../themes/ThemeProvider';

const AdminUsersFilters = ({ filters, onFilterChange, onClearFilters, usersCount }) => {
  const { theme } = useTheme();

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  const hasActiveFilters = Object.values(filters).some(v => v && v !== '');

  return (
    <div className={`${theme.colors.card} rounded-2xl p-4 border ${theme.colors.border}`}>
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1">
          <div className="relative">
            <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.colors.text} opacity-40`} />
            <input
              type="text"
              name="search"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={handleChange}
              className={`w-full pl-9 pr-3 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
            />
          </div>
        </div>
        
        <select
          name="role"
          value={filters.role}
          onChange={handleChange}
          className={`px-3 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm w-full lg:w-auto`}
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
        
        <select
          name="subscription"
          value={filters.subscription}
          onChange={handleChange}
          className={`px-3 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm w-full lg:w-auto`}
        >
          <option value="">All Plans</option>
          <option value="free">Free</option>
          <option value="basic">Basic</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </select>
        
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className={`px-3 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm w-full lg:w-auto`}
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        
        <button
          onClick={onClearFilters}
          className={`px-4 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-colors text-sm w-full lg:w-auto`}
        >
          Clear All
        </button>

        {hasActiveFilters && (
          <span className={`text-xs ${theme.colors.primary} font-medium flex items-center`}>
            {usersCount} users found
          </span>
        )}
      </div>
    </div>
  );
};

export default AdminUsersFilters;