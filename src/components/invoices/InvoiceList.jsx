// frontend/src/components/invoices/InvoiceList.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { 
  FaEye, FaEdit, FaTrash, FaDownload, FaCheck,
  FaTimes, FaSpinner, FaPrint, FaEnvelope, FaFileInvoice
} from 'react-icons/fa';
import { fetchInvoices, deleteInvoice, setPage } from '../../store/slices/invoiceSlice';
import InvoiceFilters from './InvoiceFilters';
import InvoicePagination from './InvoicePagination';
import InvoiceViewModal from './InvoiceViewModal';
import InvoiceEditModal from './InvoiceEditModal';
import { useTheme } from '../../themes/ThemeProvider';
import toast from 'react-hot-toast';
import { MdEmail } from "react-icons/md";
import DialogEmailBox from '../email/Email';



const InvoiceList = () => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { invoices, loading, pagination, filters, isOfflineSearch } = useSelector(
    (state) => state.invoices
  );
  
  const [viewModal, setViewModal] = useState({ isOpen: false, invoice: null });
  const [editModal, setEditModal] = useState({ isOpen: false, invoice: null });
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [isBulkAction, setIsBulkAction] = useState(false);
const [emailDialogBox, setEmailDialogBox] = useState({isOpen: false, invoice: null})
  useEffect(() => {
    dispatch(fetchInvoices({ page: pagination.page }));
  }, [dispatch, pagination.page]);

  const handleDelete = async (id, invoiceNumber) => {
    if (window.confirm(`Are you sure you want to delete invoice ${invoiceNumber}?`)) {
      try {
        await dispatch(deleteInvoice(id)).unwrap();
        toast.success(`Invoice ${invoiceNumber} deleted successfully`);
        dispatch(fetchInvoices({ page: pagination.page }));
      } catch (error) {
        toast.error(error || 'Failed to delete invoice');
      }
    }
  };

  const handleView = (invoice) => {
    setViewModal({ isOpen: true, invoice });
  };

  const handleEmail = (invoice) => {
    setEmailDialogBox({isOpen: true, invoice})
  }
  const handleEdit = (invoice) => {
    setEditModal({ isOpen: true, invoice });
  };

  const handleDownload = (invoice) => {
    toast.success(`Downloading invoice ${invoice.invoiceNumber}...`);
  };

  const handlePrint = (invoice) => {
    window.print();
  };

  const handleSendEmail = (invoice) => {
    toast.success(`Sending invoice ${invoice.invoiceNumber} to ${invoice.client.email}`);
  };

  const handleSelectInvoice = (id) => {
    setSelectedInvoices(prev => 
      prev.includes(id) 
        ? prev.filter(invId => invId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedInvoices.length === invoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(invoices.map(inv => inv._id));
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedInvoices.length) return;
    
    if (window.confirm(`Delete ${selectedInvoices.length} selected invoices?`)) {
      setIsBulkAction(true);
      try {
        await Promise.all(selectedInvoices.map(id => dispatch(deleteInvoice(id)).unwrap()));
        toast.success(`${selectedInvoices.length} invoices deleted successfully`);
        setSelectedInvoices([]);
        dispatch(fetchInvoices({ page: pagination.page }));
      } catch (error) {
        toast.error('Failed to delete some invoices');
      } finally {
        setIsBulkAction(false);
      }
    }
  };

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

  const getStatusIcon = (status) => {
    switch(status) {
      case 'paid': return <FaCheck className="text-green-500" />;
      case 'overdue': return <FaTimes className="text-red-500" />;
      default: return null;
    }
  };

  if (loading && invoices.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-primary-500 text-4xl" />
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      <InvoiceFilters />
      
      <div className={`${theme.colors.card} rounded-2xl border ${theme.colors.border} overflow-hidden shadow-sm`}>
        {/* Bulk Actions */}
        {selectedInvoices.length > 0 && (
          <div className={`${theme.colors.background} border-b ${theme.colors.border} px-3 md:px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}>
            <span className={`text-sm font-medium ${theme.colors.text}`}>
              {selectedInvoices.length} invoice{selectedInvoices.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={handleBulkDelete}
                disabled={isBulkAction}
                className="btn-secondary text-red-600 hover:text-red-700 flex items-center gap-2 text-sm px-3 py-1.5"
              >
                {isBulkAction ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedInvoices([])}
                className="btn-secondary text-sm px-3 py-1.5"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Invoice Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={`${theme.colors.background}`}>
              <tr>
                <th className="px-3 md:px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={invoices.length > 0 && selectedInvoices.length === invoices.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Invoice #
                </th>
                <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                  Client
                </th>
                <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  Date
                </th>
                <th className="px-3 md:px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-3 md:px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                  Status
                </th>
                <th className="px-3 md:px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`${theme.colors.card} divide-y divide-gray-200 dark:divide-gray-700`}>
              {invoices.map((invoice) => (
                <tr key={invoice._id} className={`${theme.colors.hover} transition-colors`}>
                  <td className="px-3 md:px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedInvoices.includes(invoice._id)}
                      onChange={() => handleSelectInvoice(invoice._id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-3 md:px-4 py-3 whitespace-nowrap">
                    <p className={`text-sm font-medium ${theme.colors.text}`}>
                      {invoice.invoiceNumber}
                    </p>
                    <p className={`text-xs ${theme.colors.text} opacity-60 sm:hidden`}>
                      {invoice.client?.name || 'Unknown'}
                    </p>
                  </td>
                  <td className="px-3 md:px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                    <div className={`text-sm font-medium ${theme.colors.text}`}>
                      {invoice.client?.name || 'Unknown'}
                    </div>
                    <div className={`text-xs ${theme.colors.text} opacity-60`}>
                      {invoice.client?.email || ''}
                    </div>
                  </td>
                  <td className="px-3 md:px-4 py-3 whitespace-nowrap text-sm ${theme.colors.text} opacity-70 hidden md:table-cell">
                    {format(new Date(invoice.issueDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-3 md:px-4 py-3 whitespace-nowrap text-right">
                    <p className={`text-sm font-semibold ${theme.colors.text}`}>
                      ₹{(invoice.total || 0).toFixed(2)}
                    </p>
                    <span className={`inline-block sm:hidden text-xs px-2 py-0.5 rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status || 'Draft'}
                    </span>
                  </td>
                  <td className="px-3 md:px-4 py-3 whitespace-nowrap text-center hidden sm:table-cell">
                    <span className={`px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      {invoice.status?.charAt(0).toUpperCase() + invoice.status?.slice(1) || 'Draft'}
                    </span>
                  </td>
                  <td className="px-3 md:px-4 py-3 whitespace-nowrap text-right">
                    <div className="flex flex-wrap justify-end gap-1">
                     <button
                        onClick={() => handleEmail(invoice)}
                        className={`p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors`}
                        title="View Invoice"
                      >
                        <MdEmail size={14} className="md:w-4 md:h-4" />
                      </button>
                      <button
                        onClick={() => handleView(invoice)}
                        className={`p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors`}
                        title="View Invoice"
                      >
                        <FaEye size={14} className="md:w-4 md:h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(invoice)}
                        className={`p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors ${invoice.status === 'paid' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Edit Invoice"
                        disabled={invoice.status === 'paid'}
                      >
                        <FaEdit size={14} className="md:w-4 md:h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(invoice._id, invoice.invoiceNumber)}
                        className={`p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ${invoice.status === 'paid' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Delete Invoice"
                        disabled={invoice.status === 'paid'}
                      >
                        <FaTrash size={14} className="md:w-4 md:h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(invoice)}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Download PDF"
                      >
                        <FaDownload size={14} className="md:w-4 md:h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {invoices.length === 0 && (
          <div className={`text-center py-12 ${theme.colors.text}`}>
            <div className={`text-4xl mb-4 ${theme.colors.text} opacity-30`}>
              <FaFileInvoice className="mx-auto" />
            </div>
            <p className={`text-lg font-medium ${theme.colors.text}`}>No invoices found</p>
            <p className={`text-sm ${theme.colors.text} opacity-60 mt-1`}>
              {isOfflineSearch 
                ? 'Try searching with different keywords or clear filters'
                : 'Create your first invoice to get started'}
            </p>
            {isOfflineSearch && (
              <button
                onClick={() => dispatch(fetchInvoices({}))}
                className={`mt-4 ${theme.colors.button} text-white px-6 py-2 rounded-xl`}
              >
                Refresh from Server
              </button>
            )}
          </div>
        )}
      </div>
      
      <InvoicePagination />

      {/* Modals */}
      <InvoiceViewModal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, invoice: null })}
        invoice={viewModal.invoice}
      />
<DialogEmailBox
isOpen={emailDialogBox.isOpen}
onClose={() => setEmailDialogBox({ isOpen: false, invoice: null })}
invoice={emailDialogBox.invoice}
 />
      <InvoiceEditModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, invoice: null })}
        invoice={editModal.invoice}
        onSuccess={() => dispatch(fetchInvoices({ page: pagination.page }))}
      />
    </div>
  );
};

export default InvoiceList;