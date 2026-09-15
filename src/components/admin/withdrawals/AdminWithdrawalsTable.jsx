// frontend/src/components/admin/withdrawals/AdminWithdrawalsTable.jsx
import React from 'react';
import { 
  FaWallet, FaEye, FaCopy, FaSpinner,
  FaCheck, FaTimes, FaClock
} from 'react-icons/fa';
import { useTheme } from '../../../themes/ThemeProvider';
import toast from 'react-hot-toast';

const AdminWithdrawalsTable = ({ 
  withdrawals, 
  pagination, 
  onPageChange,
  onApprove,
  onComplete,
  onReject,
  onViewDetails,
  processing 
}) => {
  const { theme } = useTheme();

  const getStatusBadge = (status) => {
    const config = {
      pending: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: '⏳', label: 'Pending' },
      approved: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: '✅', label: 'Approved' },
      processing: { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: '🔄', label: 'Processing' },
      completed: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: '🎉', label: 'Completed' },
      failed: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: '❌', label: 'Failed' },
      cancelled: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', icon: '🚫', label: 'Cancelled' },
    };
    const style = config[status] || config.pending;
    return (
      <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${style.color} flex items-center gap-1 w-fit`}>
        {style.icon} {style.label}
      </span>
    );
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      bank: '🏦',
      upi: '📱',
      paypal: '💳',
    };
    return icons[method] || '💳';
  };

  const copyToClipboard = (text) => {
    if (text) {
      navigator.clipboard.writeText(text);
      toast.success('Copied!');
    }
  };

  if (withdrawals.length === 0) {
    return (
      <div className={`${theme.colors.card} rounded-2xl border ${theme.colors.border} overflow-hidden`}>
        <div className={`text-center py-12 ${theme.colors.text}`}>
          <FaWallet className={`text-6xl mx-auto mb-4 ${theme.colors.text} opacity-30`} />
          <p className={`text-lg font-medium ${theme.colors.text}`}>No withdrawal requests</p>
          <p className={`text-sm ${theme.colors.text} opacity-60 mt-1`}>
            When affiliates request withdrawals, they will appear here
          </p>
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
              <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                Method
              </th>
              <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                Date
              </th>
              <th className="px-3 md:px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y divide-gray-200 dark:divide-gray-700`}>
            {withdrawals.map((w) => (
              <tr key={w._id} className={`${theme.colors.hover} transition-colors`}>
                <td className="px-3 md:px-4 py-3">
                  <div>
                    <p className={`text-sm font-medium ${theme.colors.text}`}>
                      {w.user?.name || 'Unknown'}
                    </p>
                    <p className={`text-xs md:text-sm ${theme.colors.text} opacity-60 truncate max-w-[120px] md:max-w-none`}>
                      {w.user?.email || 'No email'}
                    </p>
                  </div>
                </td>
                <td className="px-3 md:px-4 py-3">
                  <span className={`text-sm md:text-base font-bold ${theme.colors.text}`}>
                    ₹{w.amount?.toFixed(2) || '0.00'}
                  </span>
                </td>
                <td className="px-3 md:px-4 py-3 hidden sm:table-cell">
                  <span className={`text-sm ${theme.colors.text}`}>
                    {getPaymentMethodIcon(w.paymentMethod)} {w.paymentMethod}
                  </span>
                </td>
                <td className="px-3 md:px-4 py-3">
                  {getStatusBadge(w.status)}
                </td>
                <td className="px-3 md:px-4 py-3 hidden md:table-cell">
                  <span className={`text-sm ${theme.colors.text} opacity-60`}>
                    {new Date(w.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </td>
                <td className="px-3 md:px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1 md:gap-2 flex-wrap">
                    {w.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onApprove(w._id)}
                          className={`px-2 md:px-3 py-1 rounded-lg text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={processing}
                          title="Approve"
                        >
                          <FaCheck size={12} />
                        </button>
                        <button
                          onClick={() => onComplete(w._id)}
                          className={`px-2 md:px-3 py-1 rounded-lg text-xs font-medium bg-green-500 hover:bg-green-600 text-white transition-colors ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={processing}
                          title="Complete"
                        >
                          <FaCheck size={12} />
                        </button>
                        <button
                          onClick={() => onReject(w._id)}
                          className={`px-2 md:px-3 py-1 rounded-lg text-xs font-medium bg-red-500 hover:bg-red-600 text-white transition-colors ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={processing}
                          title="Reject"
                        >
                          <FaTimes size={12} />
                        </button>
                      </>
                    )}
                    {w.status === 'approved' && (
                      <button
                        onClick={() => onComplete(w._id)}
                        className={`px-2 md:px-3 py-1 rounded-lg text-xs font-medium bg-green-500 hover:bg-green-600 text-white transition-colors`}
                      >
                        Complete
                      </button>
                    )}
                    {w.transactionId && (
                      <button
                        onClick={() => copyToClipboard(w.transactionId)}
                        className={`p-1 rounded-lg ${theme.colors.hover} transition-colors`}
                        title="Copy Transaction ID"
                      >
                        <FaCopy className={`text-sm ${theme.colors.text} opacity-50`} />
                      </button>
                    )}
                    <button
                      onClick={() => onViewDetails(w)}
                      className={`p-1 rounded-lg ${theme.colors.hover} transition-colors`}
                      title="View Details"
                    >
                      <FaEye className={`text-sm ${theme.colors.text} opacity-70`} />
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
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
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

export default AdminWithdrawalsTable;