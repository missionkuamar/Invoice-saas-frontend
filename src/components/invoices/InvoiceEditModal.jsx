// frontend/src/components/invoices/InvoiceEditModal.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import { updateInvoice } from '../../store/slices/invoiceSlice';
import { useTheme } from '../../themes/ThemeProvider';
import toast from 'react-hot-toast';

const InvoiceEditModal = ({ isOpen, onClose, invoice, onSuccess }) => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    notes: '',
    terms: '',
    client: {
      name: '',
      email: '',
      phone: '',
      address: '',
      gst: '',
    },
    items: [],
    dueDate: '',
  });

  useEffect(() => {
    if (invoice) {
      setFormData({
        status: invoice.status || 'draft',
        notes: invoice.notes || '',
        terms: invoice.terms || '',
        client: {
          name: invoice.client?.name || '',
          email: invoice.client?.email || '',
          phone: invoice.client?.phone || '',
          address: invoice.client?.address || '',
          gst: invoice.client?.gst || '',
        },
        items: invoice.items || [],
        dueDate: invoice.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : '',
      });
    }
  }, [invoice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('client.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        client: { ...prev.client, [field]: value },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(updateInvoice({
        id: invoice._id,
        data: formData,
      })).unwrap();
      toast.success('Invoice updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error || 'Failed to update invoice');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-3 md:px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-black/75" onClick={onClose}></div>
        </div>

        <div className={`inline-block align-bottom ${theme.colors.card} rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full w-full max-h-[90vh] flex flex-col`}>
          <div className={`${theme.colors.background} px-4 md:px-6 py-3 md:py-4 border-b ${theme.colors.border} flex flex-wrap items-center justify-between gap-2 sticky top-0 z-10`}>
            <div>
              <h3 className={`text-base md:text-lg font-semibold ${theme.colors.text}`}>
                Edit Invoice
              </h3>
              <p className={`text-xs md:text-sm ${theme.colors.text} opacity-60`}>
                {invoice?.invoiceNumber}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 md:p-2 rounded-lg ${theme.colors.hover} transition-colors`}
            >
              <FaTimes className={`text-sm md:text-base ${theme.colors.text}`} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-4 md:px-6 py-4 md:py-6 overflow-y-auto flex-1">
            <div className="space-y-3 md:space-y-4">
              {/* Status */}
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Client Information */}
              <div className={`border-t ${theme.colors.border} pt-3 md:pt-4`}>
                <h4 className={`font-medium ${theme.colors.text} mb-3`}>Client Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                      Client Name
                    </label>
                    <input
                      type="text"
                      name="client.name"
                      value={formData.client.name}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="client.email"
                      value={formData.client.email}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                      Phone
                    </label>
                    <input
                      type="text"
                      name="client.phone"
                      value={formData.client.phone}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                      GST
                    </label>
                    <input
                      type="text"
                      name="client.gst"
                      value={formData.client.gst}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                      Address
                    </label>
                    <textarea
                      name="client.address"
                      value={formData.client.address}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none`}
                      rows="2"
                    />
                  </div>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                />
              </div>

              {/* Notes & Terms */}
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none`}
                  rows="3"
                  placeholder="Additional notes"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                  Terms & Conditions
                </label>
                <textarea
                  name="terms"
                  value={formData.terms}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none`}
                  rows="3"
                  placeholder="Payment terms"
                />
              </div>
            </div>

            {/* Actions */}
            <div className={`mt-4 md:mt-6 flex flex-col sm:flex-row justify-end gap-3 border-t ${theme.colors.border} pt-4`}>
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-colors text-sm w-full sm:w-auto`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`${theme.colors.button} text-white px-6 py-2 rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-all text-sm w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InvoiceEditModal;