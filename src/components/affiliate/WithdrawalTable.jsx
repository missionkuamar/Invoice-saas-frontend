// frontend/src/components/affiliate/WithdrawalTable.jsx
import React from 'react';
import { FaEye, FaTimes, FaCopy, FaHistory, FaSpinner } from 'react-icons/fa';
import { CiBank } from "react-icons/ci";
import { FaMobile, FaPaypal, FaWallet } from 'react-icons/fa';
import { useTheme } from '../../themes/ThemeProvider';
import toast from 'react-hot-toast';

const WithdrawalTable = ({
  withdrawals,
  loading,
  pagination,
  onPageChange,
  onViewDetails,
  onCancel,
  onWithdraw,
  earnings,
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
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${style.color} flex items-center gap-1 w-fit`}>
        {style.icon} {style.label}
      </span>
    );
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      bank: <CiBank className="text-blue-500 text-lg" />,
      upi: <FaMobile className="text-green-500 text-lg" />,
      paypal: <FaPaypal className="text-blue-400 text-lg" />,
    };
    return icons[method] || <FaWallet className="text-gray-500 text-lg" />;
  };

  const getPaymentMethodName = (method) => {
    const names = {
      bank: 'Bank Transfer',
      upi: 'UPI',
      paypal: 'PayPal',
    };
    return names[method] || method;
  };

  if (withdrawals.length === 0) {
    return (
      <div className={`${theme.colors.card} rounded-2xl border ${theme.colors.border} overflow-hidden`}>
        <div className={`text-center py-12 ${theme.colors.text}`}>
          <FaHistory className={`text-4xl mx-auto mb-3 ${theme.colors.text} opacity-30`} />
          <p className={`text-lg font-medium ${theme.colors.text}`}>No withdrawals yet</p>
          <p className={`text-sm ${theme.colors.text} opacity-60 mt-1`}>
            You haven't made any withdrawal requests yet
          </p>
          <button
            onClick={onWithdraw}
            className={`mt-4 ${theme.colors.button} text-white px-6 py-2 rounded-xl hover:scale-105 transition-all text-sm`}
            disabled={earnings < 100}
          >
            Make your first withdrawal
          </button>
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
                ID
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
            {withdrawals.map((withdrawal) => (
              <tr key={withdrawal._id} className={`${theme.colors.hover} transition-colors`}>
                <td className="px-3 md:px-4 py-3">
                  <span className={`text-xs md:text-sm font-mono ${theme.colors.text} opacity-60`}>
                    #{withdrawal._id?.slice(-6) || 'N/A'}
                  </span>
                </td>
                <td className="px-3 md:px-4 py-3">
                  <span className={`text-sm md:text-base font-semibold ${theme.colors.text}`}>
                    ₹{withdrawal.amount?.toFixed(2) || '0.00'}
                  </span>
                </td>
                <td className="px-3 md:px-4 py-3 hidden sm:table-cell">
                  <div className="flex items-center gap-2">
                    {getPaymentMethodIcon(withdrawal.paymentMethod)}
                    <span className={`text-sm ${theme.colors.text} capitalize`}>
                      {getPaymentMethodName(withdrawal.paymentMethod)}
                    </span>
                  </div>
                </td>
                <td className="px-3 md:px-4 py-3">
                  {getStatusBadge(withdrawal.status)}
                </td>
                <td className="px-3 md:px-4 py-3 hidden md:table-cell">
                  <span className={`text-sm ${theme.colors.text} opacity-70`}>
                    {new Date(withdrawal.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </td>
                <td className="px-3 md:px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1 md:gap-2">
                    <button
                      onClick={() => onViewDetails(withdrawal)}
                      className={`p-1.5 rounded-lg ${theme.colors.hover} transition-colors`}
                      title="View Details"
                    >
                      <FaEye className={`text-sm ${theme.colors.text} opacity-70`} />
                    </button>
                    {withdrawal.status === 'pending' && (
                      <button
                        onClick={() => onCancel(withdrawal._id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Cancel"
                      >
                        <FaTimes className="text-sm text-red-500" />
                      </button>
                    )}
                    {withdrawal.transactionId && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(withdrawal.transactionId);
                          toast.success('Copied!');
                        }}
                        className={`p-1.5 rounded-lg ${theme.colors.hover} transition-colors`}
                        title="Copy Transaction ID"
                      >
                        <FaCopy className={`text-sm ${theme.colors.text} opacity-50`} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination?.pages > 1 && (
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

export default WithdrawalTable;