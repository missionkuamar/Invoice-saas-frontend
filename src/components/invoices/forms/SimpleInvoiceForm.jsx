// frontend/src/components/invoices/SimpleInvoiceForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  FaPlus, FaTrash, FaSave, FaSpinner, FaCopy,
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEye,
  FaFileInvoice, FaBox, FaCalendar, FaTag, FaArrowLeft
} from 'react-icons/fa';
import { createInvoice } from '../../store/slices/invoiceSlice';
import { useTheme } from '../../themes/ThemeProvider';
import toast from 'react-hot-toast';

// Tax options
const TAX_OPTIONS = [
  { name: 'No Tax', rate: 0 },
  { name: 'GST 5%', rate: 5 },
  { name: 'GST 12%', rate: 12 },
  { name: 'GST 18%', rate: 18 },
  { name: 'GST 28%', rate: 28 },
  { name: 'VAT 5%', rate: 5 },
  { name: 'Service Tax 14%', rate: 14 },
];

const SimpleInvoiceForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Single state object
  const [formData, setFormData] = useState({
    client: {
      name: '',
      email: '',
      phone: '',
      address: '',
      gst: '',
    },
    items: [
      { description: '', quantity: 1, rate: 0, taxRate: 18, discount: 0 }
    ],
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: '',
    terms: '',
    discount: 0,
    shipping: 0,
    poNumber: '',
  });

  // Generic change handler - handles all inputs
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let parsedValue = type === 'number' ? parseFloat(value) || 0 : value;
    
    // Handle nested objects (client fields)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: parsedValue }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: parsedValue }));
    }
  };

  // Item specific handler
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  // Add item row
  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0, taxRate: 18, discount: 0 }]
    }));
  };

  // Remove item row
  const removeItem = (index) => {
    if (formData.items.length === 1) {
      toast.error('Cannot remove last item');
      return;
    }
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  // Duplicate item
  const duplicateItem = (index) => {
    const item = formData.items[index];
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { ...item }]
    }));
  };

  // Calculate item total
  const calculateItemTotal = (item) => {
    const qty = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    const taxRate = Number(item.taxRate) || 0;
    const discount = Number(item.discount) || 0;
    
    const amount = qty * rate;
    const discountAmount = (amount * discount) / 100;
    const taxableAmount = amount - discountAmount;
    const taxAmount = (taxableAmount * taxRate) / 100;
    
    return {
      amount,
      discountAmount,
      taxAmount,
      total: taxableAmount + taxAmount
    };
  };

  // Calculate totals
  const calculateTotals = () => {
    let subtotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;

    formData.items.forEach(item => {
      const qty = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;
      const taxRate = Number(item.taxRate) || 0;
      const discount = Number(item.discount) || 0;
      
      const amount = qty * rate;
      const discountAmount = (amount * discount) / 100;
      
      subtotal += amount;
      totalDiscount += discountAmount;
      totalTax += ((amount - discountAmount) * taxRate) / 100;
    });

    const total = subtotal - totalDiscount + totalTax + 
                  Number(formData.shipping || 0) - Number(formData.discount || 0);

    return { subtotal, totalTax, totalDiscount, total };
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.client.name) {
      toast.error('Please enter client name');
      return;
    }

    if (formData.items.some(item => !item.description)) {
      toast.error('Please enter description for all items');
      return;
    }

    setIsSubmitting(true);
    try {
      const totals = calculateTotals();
      const invoiceData = {
        client: formData.client,
        items: formData.items.map(item => ({
          description: item.description,
          quantity: Number(item.quantity) || 0,
          rate: Number(item.rate) || 0,
          amount: (Number(item.quantity) || 0) * (Number(item.rate) || 0),
          taxRate: Number(item.taxRate) || 0,
          discount: Number(item.discount) || 0,
        })),
        issueDate: formData.issueDate,
        dueDate: formData.dueDate,
        notes: formData.notes,
        terms: formData.terms,
        discount: Number(formData.discount) || 0,
        shipping: Number(formData.shipping) || 0,
        subtotal: totals.subtotal,
        tax: totals.totalTax,
        total: totals.total,
        poNumber: formData.poNumber,
      };

      const result = await dispatch(createInvoice(invoiceData)).unwrap();
      toast.success(`Invoice ${result.invoiceNumber} created successfully! 🎉`);
      navigate('/invoices');
    } catch (error) {
      toast.error(error.message || 'Failed to create invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totals = calculateTotals();

  return (
    <div className={`min-h-screen ${theme.colors.background} p-3 md:p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className={`${theme.colors.card} rounded-2xl p-4 md:p-6 border ${theme.colors.border} mb-4 md:mb-6`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/invoices')}
                className={`p-2 rounded-xl ${theme.colors.hover} transition-colors`}
              >
                <FaArrowLeft className={theme.colors.text} />
              </button>
              <div>
                <h1 className={`text-xl md:text-2xl font-bold ${theme.colors.text}`}>
                  Create Invoice
                </h1>
                <p className={`text-sm ${theme.colors.text} opacity-70`}>
                  Fill in the details to create a professional invoice
                </p>
              </div>
            </div>
            <button
              onClick={() => window.print()}
              className={`${theme.colors.button} text-white px-4 md:px-6 py-2 rounded-xl flex items-center gap-2 hover:scale-105 transition-all text-sm w-full sm:w-auto justify-center`}
            >
              <FaEye /> Preview & Print
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* Client Section */}
          <div className={`${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border}`}>
            <h2 className={`text-base md:text-lg font-semibold ${theme.colors.text} mb-4 flex items-center gap-2`}>
              <FaUser className={theme.colors.primary} /> Client Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                  Client Name *
                </label>
                <input
                  type="text"
                  name="client.name"
                  value={formData.client.name}
                  onChange={handleChange}
                  className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                  placeholder="Enter client name"
                  required
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
                  className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                  placeholder="client@example.com"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                  Phone
                </label>
                <input
                  type="tel"
                  name="client.phone"
                  value={formData.client.phone}
                  onChange={handleChange}
                  className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                  GST Number
                </label>
                <input
                  type="text"
                  name="client.gst"
                  value={formData.client.gst}
                  onChange={handleChange}
                  className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                  placeholder="22AAAAA0000A1Z5"
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
                  className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base resize-none`}
                  rows="2"
                  placeholder="Client address"
                />
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className={`${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border}`}>
            <h2 className={`text-base md:text-lg font-semibold ${theme.colors.text} mb-4 flex items-center gap-2`}>
              <FaFileInvoice className={theme.colors.primary} /> Invoice Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                  Issue Date
                </label>
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleChange}
                  className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                  PO Number
                </label>
                <input
                  type="text"
                  name="poNumber"
                  value={formData.poNumber}
                  onChange={handleChange}
                  className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                  placeholder="PO-2024-001"
                />
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className={`${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <h2 className={`text-base md:text-lg font-semibold ${theme.colors.text} flex items-center gap-2`}>
                <FaBox className={theme.colors.primary} /> Items
              </h2>
              <button
                type="button"
                onClick={addItem}
                className={`${theme.colors.button} text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:scale-105 transition-all text-sm w-full sm:w-auto justify-center`}
              >
                <FaPlus /> Add Item
              </button>
            </div>

            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-[600px] sm:min-w-full">
                {formData.items.map((item, index) => {
                  const itemTotals = calculateItemTotal(item);
                  return (
                    <div key={index} className={`grid grid-cols-12 gap-2 p-2 md:p-3 mb-2 rounded-xl ${theme.colors.background} border ${theme.colors.border}`}>
                      <div className="col-span-12 sm:col-span-4">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          className={`w-full px-2 md:px-3 py-1.5 md:py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                          placeholder="Item description *"
                        />
                      </div>
                      <div className="col-span-3 sm:col-span-1">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className={`w-full px-2 md:px-3 py-1.5 md:py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-center`}
                          min="0.01"
                          step="0.01"
                          placeholder="Qty"
                        />
                      </div>
                      <div className="col-span-3 sm:col-span-1">
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                          className={`w-full px-2 md:px-3 py-1.5 md:py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-center`}
                          min="0"
                          step="0.01"
                          placeholder="Rate"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <input
                          type="number"
                          value={item.discount}
                          onChange={(e) => handleItemChange(index, 'discount', parseFloat(e.target.value) || 0)}
                          className={`w-full px-1 md:px-2 py-1.5 md:py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-center`}
                          min="0"
                          max="100"
                          step="0.5"
                          placeholder="Disc%"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <select
                          value={item.taxRate}
                          onChange={(e) => handleItemChange(index, 'taxRate', parseFloat(e.target.value))}
                          className={`w-full px-1 md:px-2 py-1.5 md:py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                        >
                          {TAX_OPTIONS.map((tax, i) => (
                            <option key={i} value={tax.rate}>{tax.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-1 sm:col-span-1 flex items-center justify-end">
                        <span className={`text-sm font-semibold ${theme.colors.text}`}>
                          ₹{itemTotals.total.toFixed(2)}
                        </span>
                      </div>
                      <div className="col-span-1 sm:col-span-1 flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => duplicateItem(index)}
                          className={`p-1.5 rounded-lg ${theme.colors.hover} transition-colors`}
                          title="Duplicate"
                        >
                          <FaCopy className={`text-sm ${theme.colors.text} opacity-60`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className={`p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors`}
                          title="Remove"
                        >
                          <FaTrash className="text-sm text-red-500" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className={`${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border}`}>
              <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base resize-none`}
                rows="3"
                placeholder="Additional notes..."
              />
            </div>
            <div className={`${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border}`}>
              <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                Terms & Conditions
              </label>
              <textarea
                name="terms"
                value={formData.terms}
                onChange={handleChange}
                className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base resize-none`}
                rows="3"
                placeholder="Payment terms..."
              />
            </div>
          </div>

          {/* Summary */}
          <div className={`${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border}`}>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <div className="w-full sm:w-72 space-y-2">
                <div className="flex justify-between py-1">
                  <span className={`text-sm ${theme.colors.text} opacity-70`}>Subtotal:</span>
                  <span className={`text-sm font-medium ${theme.colors.text}`}>₹{totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.totalDiscount > 0 && (
                  <div className="flex justify-between py-1 text-green-600">
                    <span className="text-sm">Discount:</span>
                    <span className="text-sm font-medium">-₹{totals.totalDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between py-1">
                  <span className={`text-sm ${theme.colors.text} opacity-70`}>Tax:</span>
                  <span className={`text-sm font-medium ${theme.colors.primary}`}>+₹{totals.totalTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-t-2 border-primary-500/30">
                  <span className={`text-base md:text-lg font-bold ${theme.colors.text}`}>Total:</span>
                  <span className={`text-base md:text-lg font-bold ${theme.colors.primary}`}>₹{totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={`flex flex-col sm:flex-row justify-end gap-3 ${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border}`}>
            <button
              type="button"
              onClick={() => navigate('/invoices')}
              className={`px-4 md:px-6 py-2.5 md:py-3 rounded-xl border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-colors text-sm w-full sm:w-auto`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${theme.colors.button} text-white px-4 md:px-8 py-2.5 md:py-3 rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-all text-sm w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FaSave /> Create Invoice
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimpleInvoiceForm;