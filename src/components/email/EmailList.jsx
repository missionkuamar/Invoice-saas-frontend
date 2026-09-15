// frontend/src/components/emails/EmailList.jsx
import React from 'react';
import { useTheme } from '../../themes/ThemeProvider';
import { FaSpinner } from 'react-icons/fa';

const EmailList = ({ emails, loading, onDelete, deletingId }) => {
  const { theme } = useTheme();

  // Get email type icon
  const getEmailTypeIcon = (type) => {
    const icons = {
      invoice: '💰',
      reminder: '⏰',
      overdue: '🚨',
      confirmation: '✅',
      cancellation: '❌',
      revised: '📝',
      proforma: '📄',
      credit_note: '💳',
      recurring: '🔄'
    };
    return icons[type] || '📧';
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      sent: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'Not scheduled';
    try {
      return new Date(date).toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-primary-500 text-4xl" />
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className={`${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border}`}>
        <div className={`text-center py-12 ${theme.colors.text}`}>
          <div className="text-6xl mb-4 opacity-30">📭</div>
          <p className={`text-lg font-medium ${theme.colors.text}`}>No emails scheduled</p>
          <p className={`text-sm ${theme.colors.text} opacity-60 mt-1`}>
            Schedule your first email from the invoice details page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border}`}>
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {emails.map((email) => (
          <div 
            key={email._id} 
            className={`border ${theme.colors.border} rounded-xl p-4 hover:shadow-md transition-all ${theme.colors.hover}`}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="flex-1 min-w-0 w-full">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-2xl">
                    {getEmailTypeIcon(email.emailType)}
                  </span>
                  <h3 className={`font-semibold ${theme.colors.text} truncate`}>
                    {email.subject || 'No Subject'}
                  </h3>
                  <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${getStatusColor(email.status)}`}>
                    {email.status || 'Pending'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-2">
                  <p className={`text-sm ${theme.colors.text} opacity-70 truncate`}>
                    <span className="font-medium">To:</span> {email.toEmail || 'No recipient'}
                  </p>
                  <p className={`text-sm ${theme.colors.text} opacity-70`}>
                    <span className="font-medium">Scheduled:</span> {formatDate(email.scheduleTime)}
                  </p>
                  {email.invoiceId && (
                    <p className={`text-sm ${theme.colors.text} opacity-70 col-span-full`}>
                      <span className="font-medium">Invoice:</span> #{email.invoiceId.invoiceNumber || 'N/A'} - {email.invoiceId.clientName || 'No client'}
                    </p>
                  )}
                  {email.attachments && email.attachments.length > 0 && (
                    <p className={`text-sm text-blue-600 dark:text-blue-400 col-span-full`}>
                      📎 {email.attachments.length} attachment(s)
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              {email.status === 'pending' && (
                <button
                  onClick={() => onDelete(email._id)}
                  disabled={deletingId === email._id}
                  className={`text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 whitespace-nowrap ${
                    deletingId === email._id ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {deletingId === email._id ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    '🗑️ Delete'
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailList;