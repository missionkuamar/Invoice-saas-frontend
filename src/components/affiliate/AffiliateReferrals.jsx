// frontend/src/components/affiliate/AffiliateReferrals.jsx
import React from 'react';
import { FaUsers, FaHistory, FaTimes } from 'react-icons/fa';
import { useTheme } from '../../themes/ThemeProvider';

const AffiliateReferrals = ({ title, items, type = 'referral', onClose }) => {
  const { theme } = useTheme();

  const getStatusBadge = (status) => {
    const config = {
      subscribed: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Subscribed' },
      registered: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'Registered' },
      pending: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Pending' },
      approved: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'Approved' },
      completed: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Completed' },
      failed: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'Failed' },
      cancelled: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', label: 'Cancelled' },
    };
    const style = config[status] || config.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${style.color}`}>
        {style.label}
      </span>
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600',
      approved: 'text-blue-600',
      completed: 'text-green-600',
      failed: 'text-red-600',
      cancelled: 'text-gray-600',
    };
    return colors[status] || 'text-gray-600';
  };

  return (
    <div className={`${theme.colors.card} rounded-2xl p-4 border ${theme.colors.border}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`font-semibold ${theme.colors.text} flex items-center gap-2`}>
          {type === 'referral' ? <FaUsers className={theme.colors.primary} /> : <FaHistory className={theme.colors.primary} />}
          {title}
        </h3>
        {onClose && (
          <button onClick={onClose} className={`${theme.colors.text} opacity-60 hover:opacity-100`}>
            <FaTimes />
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className={`text-sm ${theme.colors.text} opacity-60`}>No {type === 'referral' ? 'referrals' : 'withdrawals'} yet</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b ${theme.colors.border} pb-3 last:border-0 last:pb-0`}>
              <div>
                <p className={`text-sm font-medium ${theme.colors.text}`}>
                  {type === 'referral' 
                    ? (item.referredUser?.name || 'Anonymous User')
                    : `₹${item.amount?.toFixed(2) || '0.00'}`
                  }
                </p>
                <p className={`text-xs ${theme.colors.text} opacity-60`}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {type === 'referral' ? (
                  <>
                    {getStatusBadge(item.status)}
                    {item.commission > 0 && (
                      <span className={`text-sm font-semibold text-green-600`}>
                        +₹{item.commission.toFixed(2)}
                      </span>
                    )}
                  </>
                ) : (
                  <span className={`text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AffiliateReferrals;