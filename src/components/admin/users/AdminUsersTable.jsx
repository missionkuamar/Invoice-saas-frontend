// frontend/src/components/admin/users/AdminUsersTable.jsx
import React from 'react';
import { 
  FaEye, FaEdit, FaTrash, FaUserCheck, FaUserSlash,
  FaSpinner
} from 'react-icons/fa';
import { useTheme } from '../../../themes/ThemeProvider';

const AdminUsersTable = ({ 
  users, 
  pagination, 
  onPageChange, 
  onViewDetails, 
  onEditUser,
  onToggleStatus,
  onDeleteUser 
}) => {
  const { theme } = useTheme();

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className={`flex items-center gap-1 text-green-600 dark:text-green-400 ${theme.colors.background} px-2 py-1 rounded-full text-xs font-medium`}>
        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
      </span>
    ) : (
      <span className={`flex items-center gap-1 text-red-600 dark:text-red-400 ${theme.colors.background} px-2 py-1 rounded-full text-xs font-medium`}>
        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Inactive
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const config = {
      user: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'User' },
      admin: { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', label: 'Admin' },
      super_admin: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'Super Admin' },
    };
    const style = config[role] || config.user;
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${style.color}`}>
      {style.label}
    </span>;
  };

  const getPlanBadge = (plan) => {
    const config = {
      free: { color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300', label: 'Free' },
      basic: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'Basic' },
      pro: { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', label: 'Pro' },
      enterprise: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Enterprise' },
    };
    const style = config[plan] || config.free;
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${style.color}`}>
      {style.label}
    </span>;
  };

  if (users.length === 0) {
    return (
      <div className={`${theme.colors.card} rounded-2xl border ${theme.colors.border} overflow-hidden`}>
        <div className={`text-center py-12 ${theme.colors.text}`}>
          <div className={`text-4xl mb-3 ${theme.colors.text} opacity-30`}>👥</div>
          <p className={`text-lg font-medium ${theme.colors.text}`}>No users found</p>
          <p className={`text-sm ${theme.colors.text} opacity-60 mt-1`}>Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme.colors.card} rounded-2xl border ${theme.colors.border} overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={`${theme.colors.background}`}>
            <tr>
              <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                Role
              </th>
              <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                Plan
              </th>
              <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                Joined
              </th>
              <th className="px-3 md:px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y divide-gray-200 dark:divide-gray-700`}>
            {users.map((user) => (
              <tr key={user._id} className={`${theme.colors.hover} transition-colors`}>
                <td className="px-3 md:px-4 py-3">
                  <div>
                    <p className={`text-sm font-medium ${theme.colors.text}`}>{user.name}</p>
                    <p className={`text-xs md:text-sm ${theme.colors.text} opacity-60 truncate max-w-[120px] md:max-w-none`}>
                      {user.email}
                    </p>
                  </div>
                </td>
                <td className="px-3 md:px-4 py-3 hidden sm:table-cell">
                  {getRoleBadge(user.role)}
                </td>
                <td className="px-3 md:px-4 py-3 hidden md:table-cell">
                  {getPlanBadge(user.subscription?.plan || 'free')}
                </td>
                <td className="px-3 md:px-4 py-3">
                  {getStatusBadge(user.isActive)}
                </td>
                <td className="px-3 md:px-4 py-3 hidden lg:table-cell">
                  <span className={`text-xs md:text-sm ${theme.colors.text} opacity-60`}>
                    {new Date(user.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </td>
                <td className="px-3 md:px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1 md:gap-2">
                    <button
                      onClick={() => onViewDetails(user._id)}
                      className={`p-1.5 rounded-lg ${theme.colors.hover} transition-colors`}
                      title="View Details"
                    >
                      <FaEye className={`text-sm ${theme.colors.text} opacity-70`} />
                    </button>
                    <button
                      onClick={() => onEditUser(user)}
                      className={`p-1.5 rounded-lg ${theme.colors.hover} transition-colors`}
                      title="Edit User"
                    >
                      <FaEdit className={`text-sm ${theme.colors.text} opacity-70`} />
                    </button>
                    <button
                      onClick={() => onToggleStatus(user._id, user.isActive)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        user.isActive 
                          ? 'hover:bg-red-50 dark:hover:bg-red-900/20' 
                          : 'hover:bg-green-50 dark:hover:bg-green-900/20'
                      }`}
                      title={user.isActive ? 'Deactivate User' : 'Activate User'}
                    >
                      {user.isActive ? 
                        <FaUserSlash className="text-sm text-red-500" /> : 
                        <FaUserCheck className="text-sm text-green-500" />
                      }
                    </button>
                    <button
                      onClick={() => onDeleteUser(user._id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Delete User"
                    >
                      <FaTrash className="text-sm text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className={`px-4 md:px-6 py-3 border-t ${theme.colors.border} flex flex-col sm:flex-row items-center justify-between gap-3`}>
          <span className={`text-sm ${theme.colors.text} opacity-70`}>
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`px-3 py-1 rounded-lg border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm`}
            >
              Previous
            </button>
            <span className={`px-3 py-1 rounded-lg ${theme.colors.background} ${theme.colors.primary} text-sm font-medium`}>
              {pagination.page} / {pagination.pages}
            </span>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className={`px-3 py-1 rounded-lg border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersTable;