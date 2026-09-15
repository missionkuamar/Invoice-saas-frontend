// frontend/src/components/admin/users/AdminUserDetailsModal.jsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { useTheme } from '../../../themes/ThemeProvider';

const AdminUserDetailsModal = ({ isOpen, onClose, userDetails }) => {
  const { theme } = useTheme();

  if (!isOpen || !userDetails) return null;

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-3 md:px-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
        <div className={`relative ${theme.colors.card} rounded-2xl shadow-2xl max-w-2xl w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto border ${theme.colors.border}`}>
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-inherit z-10 pb-2">
            <h3 className={`text-lg font-semibold ${theme.colors.text} flex items-center gap-2`}>
              👤 User Details
            </h3>
            <button onClick={onClose} className={`${theme.colors.text} opacity-60 hover:opacity-100`}>
              <FaTimes />
            </button>
          </div>

          <div className="space-y-4">
            {/* User Info */}
            <div className={`p-4 rounded-xl ${theme.colors.background} border ${theme.colors.border}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className={`text-xs ${theme.colors.text} opacity-60`}>Name</p>
                  <p className={`font-medium ${theme.colors.text}`}>{userDetails.user?.name}</p>
                </div>
                <div>
                  <p className={`text-xs ${theme.colors.text} opacity-60`}>Email</p>
                  <p className={`font-medium ${theme.colors.text}`}>{userDetails.user?.email}</p>
                </div>
                <div>
                  <p className={`text-xs ${theme.colors.text} opacity-60`}>Role</p>
                  <p>{getRoleBadge(userDetails.user?.role)}</p>
                </div>
                <div>
                  <p className={`text-xs ${theme.colors.text} opacity-60`}>Status</p>
                  <p>{getStatusBadge(userDetails.user?.isActive)}</p>
                </div>
                <div>
                  <p className={`text-xs ${theme.colors.text} opacity-60`}>Plan</p>
                  <p>{getPlanBadge(userDetails.user?.subscription?.plan || 'free')}</p>
                </div>
                <div>
                  <p className={`text-xs ${theme.colors.text} opacity-60`}>Subscription Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    userDetails.user?.subscription?.status === 'active' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {userDetails.user?.subscription?.status || 'Inactive'}
                  </span>
                </div>
                <div>
                  <p className={`text-xs ${theme.colors.text} opacity-60`}>Joined</p>
                  <p className={`font-medium ${theme.colors.text}`}>
                    {new Date(userDetails.user?.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${theme.colors.text} opacity-60`}>Total Invoices</p>
                  <p className={`font-medium ${theme.colors.text}`}>{userDetails.stats?.totalInvoices || 0}</p>
                </div>
              </div>
            </div>

            {/* Recent Invoices */}
            {userDetails.invoices?.length > 0 && (
              <div className={`p-4 rounded-xl ${theme.colors.background} border ${theme.colors.border}`}>
                <h4 className={`text-sm font-semibold ${theme.colors.text} mb-3`}>Recent Invoices</h4>
                <div className="space-y-2">
                  {userDetails.invoices.slice(0, 5).map((invoice) => (
                    <div key={invoice._id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg ${theme.colors.card} border ${theme.colors.border}`}>
                      <span className={`font-medium ${theme.colors.text}`}>{invoice.invoiceNumber}</span>
                      <div className="flex items-center gap-3">
                        <span className={`font-semibold ${theme.colors.text}`}>₹{invoice.total?.toFixed(2) || '0.00'}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          invoice.status === 'paid' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-colors text-sm`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetailsModal;