// frontend/src/components/affiliate/WithdrawalStatsModal.jsx
import React from 'react';
import { FaTimes, FaChartLine } from 'react-icons/fa';
import { useTheme } from '../../themes/ThemeProvider';

const WithdrawalStatsModal = ({ isOpen, onClose, withdrawals }) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  const totalAmount = withdrawals.reduce((sum, w) => sum + w.amount, 0);
  const averageAmount = withdrawals.length > 0 ? totalAmount / withdrawals.length : 0;
  const highestAmount = withdrawals.length > 0 ? Math.max(...withdrawals.map(w => w.amount)) : 0;

  const statusColors = {
    pending: 'bg-yellow-500',
    processing: 'bg-purple-500',
    completed: 'bg-green-500',
    failed: 'bg-red-500',
    cancelled: 'bg-gray-500',
  };

  const statusLabels = {
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
    cancelled: 'Cancelled',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-3 md:px-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
        <div className={`relative ${theme.colors.card} rounded-2xl shadow-2xl max-w-2xl w-full p-4 md:p-6 border ${theme.colors.border}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${theme.colors.text} flex items-center gap-2`}>
              <FaChartLine className="text-purple-500" />
              Withdrawal Statistics
            </h3>
            <button onClick={onClose} className={`${theme.colors.text} opacity-60 hover:opacity-100`}>
              <FaTimes />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl ${theme.colors.background} border ${theme.colors.border}`}>
              <p className={`text-sm ${theme.colors.text} opacity-70`}>Total Withdrawals</p>
              <p className={`text-2xl font-bold ${theme.colors.text}`}>{withdrawals.length}</p>
            </div>
            <div className={`p-4 rounded-xl ${theme.colors.background} border ${theme.colors.border}`}>
              <p className={`text-sm ${theme.colors.text} opacity-70`}>Total Amount</p>
              <p className={`text-2xl font-bold ${theme.colors.primary}`}>
                ₹{totalAmount.toFixed(2)}
              </p>
            </div>
            <div className={`p-4 rounded-xl ${theme.colors.background} border ${theme.colors.border}`}>
              <p className={`text-sm ${theme.colors.text} opacity-70`}>Average Amount</p>
              <p className={`text-2xl font-bold ${theme.colors.text}`}>
                ₹{averageAmount.toFixed(2)}
              </p>
            </div>
            <div className={`p-4 rounded-xl ${theme.colors.background} border ${theme.colors.border}`}>
              <p className={`text-sm ${theme.colors.text} opacity-70`}>Highest Withdrawal</p>
              <p className={`text-2xl font-bold text-green-600`}>
                ₹{highestAmount.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className={`mt-4 p-4 rounded-xl ${theme.colors.background} border ${theme.colors.border}`}>
            <h4 className={`text-sm font-medium ${theme.colors.text} mb-3`}>Status Breakdown</h4>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(statusLabels).map(([status, label]) => {
                const count = withdrawals.filter(w => w.status === status).length;
                if (count === 0) return null;
                return (
                  <div key={status} className="text-center">
                    <div 
                      className={`h-2 rounded-full ${statusColors[status]} mb-1`} 
                      style={{ width: `${(count / withdrawals.length) * 100}%` }}
                    />
                    <p className={`text-xs ${theme.colors.text}`}>{label}</p>
                    <p className={`text-sm font-bold ${theme.colors.text}`}>{count}</p>
                  </div>
                );
              })}
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

export default WithdrawalStatsModal;