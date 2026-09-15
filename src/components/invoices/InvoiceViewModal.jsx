// frontend/src/components/invoices/InvoiceViewModal.jsx
import React from 'react';
import { format } from 'date-fns';
import { FaTimes, FaDownload, FaPrint, FaEnvelope } from 'react-icons/fa';
import { useTheme } from '../../themes/ThemeProvider';
import { useSelector } from 'react-redux';

const InvoiceViewModal = ({ isOpen, onClose, invoice }) => {
  const { user } = useSelector((stata) => stata.auth || {})
  console.log(user)
  const { theme } = useTheme();

  if (!isOpen || !invoice) return null;

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      sent: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      overdue: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      cancelled: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    };
    return colors[status] || colors.draft;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-3 md:px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-black/75" onClick={onClose}></div>
        </div>

        <div className={`inline-block align-bottom ${theme.colors.card} rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full w-full max-h-[90vh] flex flex-col`}>
          {/* Header */}
          <div className={`${theme.colors.background} px-4 md:px-6 py-3 md:py-4 border-b ${theme.colors.border} flex flex-wrap items-center justify-between gap-2 sticky top-0 z-10`}>
            <div className="flex items-center gap-3">
              <div>
                <h3 className={`text-base md:text-lg font-semibold ${theme.colors.text}`}>
                  Invoice Details
                </h3>
                <p className={`text-xs md:text-sm ${theme.colors.text} opacity-60`}>
                  {invoice.invoiceNumber}
                </p>
              </div>
            </div>
            <div className="flex gap-1 md:gap-2">
              <button
                onClick={() => {/* Implement PDF download */}}
                className={`p-1.5 md:p-2 rounded-lg ${theme.colors.hover} transition-colors`}
                title="Download PDF"
              >
                <FaDownload className={`text-sm md:text-base ${theme.colors.text}`} />
              </button>
              <button
                onClick={() => window.print()}
                className={`p-1.5 md:p-2 rounded-lg ${theme.colors.hover} transition-colors`}
                title="Print"
              >
                <FaPrint className={`text-sm md:text-base ${theme.colors.text}`} />
              </button>
              {invoice.client?.email && (
                <button
                  onClick={() => {/* Implement email send */}}
                  className={`p-1.5 md:p-2 rounded-lg ${theme.colors.hover} transition-colors`}
                  title="Send Email"
                >
                  <FaEnvelope className={`text-sm md:text-base ${theme.colors.text}`} />
                </button>
              )}
              <button
                onClick={onClose}
                className={`p-1.5 md:p-2 rounded-lg ${theme.colors.hover} transition-colors`}
              >
                <FaTimes className={`text-sm md:text-base ${theme.colors.text}`} />
              </button>
            </div>
          </div>

          {/* Invoice Content - Scrollable */}
          <div className="px-4 md:px-6 py-4 md:py-6 overflow-y-auto flex-1">
            {/* Invoice Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className={`text-2xl md:text-3xl font-bold ${theme.colors.text}`}>Invoice</h2>
                <p className={`text-sm ${theme.colors.text} opacity-60`}># {invoice.invoiceNumber}</p>
              </div>
              <div className="text-left sm:text-right w-full sm:w-auto">
                <div className={`text-sm ${theme.colors.text} opacity-70 space-y-0.5`}>
                  <p>Date: {format(new Date(invoice.issueDate), 'MMM dd, yyyy')}</p>
                  <p>Due Date: {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</p>
                </div>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${getStatusColor(invoice.status)}`}>
                  {invoice.status?.toUpperCase() || 'DRAFT'}
                </span>
              </div>
            </div>

            {/* Client & Company Info */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 p-4 rounded-xl ${theme.colors.background}`}>
              <div>
                <h4 className={`text-xs md:text-sm font-semibold ${theme.colors.text} opacity-60 mb-2 uppercase tracking-wider`}>
                  Bill To:
                </h4>
                <p className={`font-medium ${theme.colors.text}`}>{invoice.client?.name || 'Unknown'}</p>
                {invoice.client?.email && <p className={`text-sm ${theme.colors.text} opacity-70`}>{invoice.client.email}</p>}
                {invoice.client?.phone && <p className={`text-sm ${theme.colors.text} opacity-70`}>{invoice.client.phone}</p>}
                {invoice.client?.address && <p className={`text-sm ${theme.colors.text} opacity-70`}>{invoice.client.address}</p>}
                {invoice.client?.gst && <p className={`text-sm ${theme.colors.text} opacity-70`}>GST: {invoice.client.gst}</p>}
              </div>
              <div className="text-left sm:text-right">
                <h4 className={`text-xs md:text-sm font-semibold ${theme.colors.text} opacity-60 mb-2 uppercase tracking-wider`}>
                  From:
                </h4>
                <p className={`font-medium ${theme.colors.text}`}>{user?.name}</p>
                <p className={`text-sm ${theme.colors.text} opacity-70`}>{user?.email}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={`${theme.colors.background}`}>
                  <tr>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Rate
                    </th>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y divide-gray-200 dark:divide-gray-700`}>
                  {invoice.items?.map((item, index) => (
                    <tr key={index}>
                      <td className={`px-3 md:px-4 py-2 md:py-3 text-sm ${theme.colors.text}`}>
                        {item.description}
                      </td>
                      <td className={`px-3 md:px-4 py-2 md:py-3 text-sm ${theme.colors.text} opacity-70 text-center`}>
                        {item.quantity}
                      </td>
                      <td className={`px-3 md:px-4 py-2 md:py-3 text-sm ${theme.colors.text} opacity-70 text-right`}>
                        ₹{item.rate?.toFixed(2) || '0.00'}
                      </td>
                      <td className={`px-3 md:px-4 py-2 md:py-3 text-sm font-medium ${theme.colors.text} text-right`}>
                        ₹{item.amount?.toFixed(2) || '0.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className={`${theme.colors.background}`}>
                  <tr>
                    <td colSpan="3" className={`px-3 md:px-4 py-2 md:py-3 text-right font-medium ${theme.colors.text}`}>
                      Subtotal:
                    </td>
                    <td className={`px-3 md:px-4 py-2 md:py-3 text-right font-medium ${theme.colors.text}`}>
                      ₹{invoice.subtotal?.toFixed(2) || '0.00'}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className={`px-3 md:px-4 py-2 md:py-3 text-right font-medium ${theme.colors.text}`}>
                      Tax (18%):
                    </td>
                    <td className={`px-3 md:px-4 py-2 md:py-3 text-right font-medium ${theme.colors.text}`}>
                      ₹{invoice.tax?.toFixed(2) || '0.00'}
                    </td>
                  </tr>
                  <tr className={`border-t-2 ${theme.colors.border}`}>
                    <td colSpan="3" className={`px-3 md:px-4 py-3 text-right font-bold text-base md:text-lg ${theme.colors.text}`}>
                      Total:
                    </td>
                    <td className={`px-3 md:px-4 py-3 text-right font-bold text-base md:text-lg text-primary-600`}>
                      ₹{invoice.total?.toFixed(2) || '0.00'}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Notes & Terms */}
            {(invoice.notes || invoice.terms) && (
              <div className={`mt-6 p-4 rounded-xl ${theme.colors.background} space-y-2`}>
                {invoice.notes && (
                  <div>
                    <h4 className={`text-xs md:text-sm font-semibold ${theme.colors.text} opacity-60 uppercase tracking-wider`}>
                      Notes:
                    </h4>
                    <p className={`text-sm ${theme.colors.text} opacity-80`}>{invoice.notes}</p>
                  </div>
                )}
                {invoice.terms && (
                  <div>
                    <h4 className={`text-xs md:text-sm font-semibold ${theme.colors.text} opacity-60 uppercase tracking-wider`}>
                      Terms:
                    </h4>
                    <p className={`text-sm ${theme.colors.text} opacity-80`}>{invoice.terms}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewModal;