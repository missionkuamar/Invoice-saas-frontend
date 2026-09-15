// frontend/src/components/admin/AdminRecentInvoices.jsx
import React from 'react';
import { FaFileInvoice, FaEye } from 'react-icons/fa';
import { useTheme } from '../../themes/ThemeProvider';
import { Link } from 'react-router-dom';

const AdminRecentInvoices = ({ invoices }) => {
  const { theme } = useTheme();

  const getStatusBadge = (status) => {
    const config = {
      paid: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: '✅' },
      pending: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: '⏳' },
      overdue: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: '⚠️' },
      draft: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', icon: '📝' },
      sent: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: '📤' },
    };
    const style = config[status] || config.draft;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${style.color}`}>
        {style.icon} {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className={`${theme.colors.card} rounded-2xl p-4 md:p-6 border ${theme.colors.border}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-base md:text-lg font-semibold ${theme.colors.text} flex items-center gap-2`}>
          <FaFileInvoice className="text-green-500" />
          Recent Invoices
        </h3>
        <Link 
          to="/invoices" 
          className={`text-sm ${theme.colors.primary} hover:underline`}
        >
          View All →
        </Link>
      </div>

      <div className="space-y-3">
        {invoices?.length === 0 ? (
          <div className={`text-center py-8 ${theme.colors.text} opacity-60`}>
            <p className="text-sm">No recent invoices</p>
          </div>
        ) : (
          invoices?.slice(0, 5).map((invoice) => (
            <div key={invoice._id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl ${theme.colors.background} border ${theme.colors.border}`}>
              <div className="min-w-0">
                <p className={`font-medium ${theme.colors.text}`}>{invoice.invoiceNumber}</p>
                <p className={`text-xs md:text-sm ${theme.colors.text} opacity-60 truncate`}>
                  {invoice.client?.name || 'Unknown Client'}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`text-sm font-semibold ${theme.colors.text}`}>
                  ₹{(invoice.total || 0).toFixed(2)}
                </span>
                {getStatusBadge(invoice.status)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminRecentInvoices;