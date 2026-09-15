// frontend/src/components/affiliate/WithdrawalDetailModal.jsx
import React from 'react';
import { FaTimes, FaFileInvoice, FaCopy } from 'react-icons/fa';
import { CiBank } from "react-icons/ci";
import { FaMobile, FaPaypal, FaWallet } from 'react-icons/fa';
import { useTheme } from '../../themes/ThemeProvider';
import toast from 'react-hot-toast';

const WithdrawalDetailModal = ({ isOpen, onClose, withdrawal }) => {
  const { theme } = useTheme();

  if (!isOpen || !withdrawal) return null;

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-3 md:px-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
        <div className={`relative ${theme.colors.card} rounded-2xl shadow-2xl max-w-md w-full p-4 md:p-6 border ${theme.colors.border}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${theme.colors.text} flex items-center gap-2`}>
              <FaFileInvoice className="text-purple-500" />
              Withdrawal Details
            </h3>
            <button onClick={onClose} className={`${theme.colors.text} opacity-60 hover:opacity-100`}>
              <FaTimes />
            </button>
          </div>

          <div className={`p-4 rounded-xl ${theme.colors.background} border ${theme.colors.border}`}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className={`text-xs ${theme.colors.text} opacity-60`}>Transaction ID</p>
                <p className={`text-sm font-mono ${theme.colors.text}`}>
                  #{withdrawal._id?.slice(-8) || 'N/A'}
                </p>
              </div>
              <div>
                <p className={`text-xs ${theme.colors.text} opacity-60`}>Amount</p>
                <p className={`text-lg font-bold ${theme.colors.primary}`}>
                  ₹{withdrawal.amount?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div>
                <p className={`text-xs ${theme.colors.text} opacity-60`}>Payment Method</p>
                <div className="flex items-center gap-2">
                  {getPaymentMethodIcon(withdrawal.paymentMethod)}
                  <span className={`text-sm ${theme.colors.text}`}>
                    {getPaymentMethodName(withdrawal.paymentMethod)}
                  </span>
                </div>
              </div>
              <div>
                <p className={`text-xs ${theme.colors.text} opacity-60`}>Status</p>
                {getStatusBadge(withdrawal.status)}
              </div>
              <div className="col-span-2">
                <p className={`text-xs ${theme.colors.text} opacity-60`}>Date</p>
                <p className={`text-sm ${theme.colors.text}`}>
                  {new Date(withdrawal.createdAt).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              {withdrawal.transactionId && (
                <div className="col-span-2">
                  <p className={`text-xs ${theme.colors.text} opacity-60`}>Transaction ID</p>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-mono ${theme.colors.text}`}>
                      {withdrawal.transactionId}
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(withdrawal.transactionId);
                        toast.success('Copied!');
                      }}
                      className={`p-1 rounded ${theme.colors.hover} transition-colors`}
                    >
                      <FaCopy className={`text-sm ${theme.colors.text} opacity-50`} />
                    </button>
                  </div>
                </div>
              )}
              {withdrawal.remarks && (
                <div className="col-span-2">
                  <p className={`text-xs ${theme.colors.text} opacity-60`}>Remarks</p>
                  <p className={`text-sm ${theme.colors.text}`}>{withdrawal.remarks}</p>
                </div>
              )}
            </div>
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

export default WithdrawalDetailModal;