// frontend/src/components/invoices/StandardInvoiceForm.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaPlus, FaTrash, FaSave, FaSpinner, FaCopy,
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEye,
  FaFileInvoice, FaBox, FaCalendar, FaTag, FaArrowLeft,
  FaBuilding,  FaSignature, FaFilePdf, FaUpload,
  FaDownload, FaPrint, FaShare, FaWhatsapp, FaEnvelopeOpen,
  FaPercent, FaTruck, FaMoneyBillWave, FaCalendarCheck,
  FaUserCircle, FaIdCard, FaGlobe, FaPhoneAlt
} from 'react-icons/fa';
import { BsBank2 } from "react-icons/bs";
import { createInvoice } from '../../../store/slices/invoiceSlice';
import { useTheme } from '../../../themes/ThemeProvider';
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

const CURRENCY_OPTIONS = [
  { value: '₹', label: 'INR (₹)' },
  { value: '$', label: 'USD ($)' },
  { value: '€', label: 'EUR (€)' },
  { value: '£', label: 'GBP (£)' },
  { value: '¥', label: 'JPY (¥)' },
];

const PAYMENT_TERMS = [
  'Due on Receipt',
  'Net 7 Days',
  'Net 15 Days',
  'Net 30 Days',
  'Net 45 Days',
  'Net 60 Days',
  '2/10 Net 30',
];

const StandardInvoiceForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useSelector((state) => state.auth);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [showPreview, setShowPreview] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    // Company Details
    company: {
      name: user?.company?.name || '',
      address: user?.company?.address || '',
      phone: user?.company?.phone || '',
      email: user?.email || '',
      website: user?.company?.website || '',
      gst: user?.company?.gst || '',
      pan: user?.company?.pan || '',
      cin: user?.company?.cin || '',
      logo: null,
    },
    // Client Details
    client: {
      name: '',
      email: '',
      phone: '',
      address: '',
      gst: '',
      pan: '',
      state: '',
      country: 'India',
      pincode: '',
    },
    // Invoice Details
    invoice: {
      number: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      poNumber: '',
      paymentTerms: 'Net 30 Days',
      currency: '₹',
    },
    // Items
    items: [
      { 
        description: '', 
        quantity: 1, 
        rate: 0, 
        taxRate: 18, 
        discount: 0,
        unit: 'pcs',
        hsCode: '',
      }
    ],
    // Bank Details
    bank: {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      branch: '',
      upiId: '',
    },
    // Additional
    additional: {
      notes: '',
      terms: '',
      discount: 0,
      shipping: 0,
      discountType: 'percentage', // percentage or fixed
      showDiscount: false,
      showShipping: false,
      showSignature: false,
      signature: null,
    },
  });

  // Generate invoice number
  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    return `INV-${year}${month}${day}-${random}`;
  };

  // Handle file upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setFormData(prev => ({
          ...prev,
          company: { ...prev.company, logo: reader.result }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Generic input handler
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? parseFloat(value) || 0 : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  // Company input handler
  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      company: { ...prev.company, [name]: value }
    }));
  };

  // Client input handler
  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      client: { ...prev.client, [name]: value }
    }));
  };

  // Invoice details handler
  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      invoice: { ...prev.invoice, [name]: value }
    }));
  };

  // Bank details handler
  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      bank: { ...prev.bank, [name]: value }
    }));
  };

  // Additional fields handler
  const handleAdditionalChange = (e) => {
    const { name, value, type, checked } = e.target;
    const parsedValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({
      ...prev,
      additional: { ...prev.additional, [name]: parsedValue }
    }));
  };

  // Item handler
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  // Add item
  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { 
        description: '', 
        quantity: 1, 
        rate: 0, 
        taxRate: 18, 
        discount: 0,
        unit: 'pcs',
        hsCode: '',
      }]
    }));
  };

  // Remove item
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

    // Apply overall discount
    let overallDiscount = Number(formData.additional.discount) || 0;
    if (formData.additional.discountType === 'percentage') {
      overallDiscount = (subtotal * overallDiscount) / 100;
    }

    const shipping = Number(formData.additional.shipping) || 0;
    const total = subtotal - totalDiscount - overallDiscount + totalTax + shipping;

    return { 
      subtotal, 
      totalTax, 
      totalDiscount, 
      overallDiscount,
      shipping,
      total 
    };
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `${formData.invoice.currency}${amount.toFixed(2)}`;
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
        company: formData.company,
        client: formData.client,
        invoice: formData.invoice,
        items: formData.items.map(item => ({
          description: item.description,
          quantity: Number(item.quantity) || 0,
          rate: Number(item.rate) || 0,
          amount: (Number(item.quantity) || 0) * (Number(item.rate) || 0),
          taxRate: Number(item.taxRate) || 0,
          discount: Number(item.discount) || 0,
          unit: item.unit,
          hsCode: item.hsCode,
        })),
        bank: formData.bank,
        additional: {
          ...formData.additional,
          signature: formData.additional.signature,
        },
        subtotal: totals.subtotal,
        tax: totals.totalTax,
        discount: totals.overallDiscount,
        shipping: totals.shipping,
        total: totals.total,
        currency: formData.invoice.currency,
      };

      await dispatch(createInvoice(invoiceData)).unwrap();
      toast.success('Invoice created successfully! 🎉');
      navigate('/invoices');
    } catch (error) {
      toast.error(error.message || 'Failed to create invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totals = calculateTotals();

  // Preview Modal
  const PreviewModal = () => {
    if (!showPreview) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto ${theme.colors.card} rounded-2xl border ${theme.colors.border} p-6`}>
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-inherit z-10 pb-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className={`text-xl font-bold ${theme.colors.text}`}>Invoice Preview</h2>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className={`px-4 py-2 rounded-xl ${theme.colors.button} text-white flex items-center gap-2 hover:scale-105 transition-all`}
              >
                <FaPrint /> Print
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className={`px-4 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-all`}
              >
                Close
              </button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="space-y-6">
            {/* Company Header */}
            <div className="flex justify-between items-start">
              <div>
                {logoPreview && (
                  <img src={logoPreview} alt="Logo" className="h-20 w-auto object-contain mb-2" />
                )}
                <h3 className={`text-2xl font-bold ${theme.colors.text}`}>
                  {formData.company.name || 'Your Company'}
                </h3>
                <p className={`text-sm ${theme.colors.text} opacity-70`}>
                  {formData.company.address}
                </p>
                <p className={`text-sm ${theme.colors.text} opacity-70`}>
                  Phone: {formData.company.phone} | Email: {formData.company.email}
                </p>
                {formData.company.gst && (
                  <p className={`text-sm ${theme.colors.text} opacity-70`}>
                    GST: {formData.company.gst}
                  </p>
                )}
              </div>
              <div className="text-right">
                <h4 className={`text-lg font-bold ${theme.colors.text}`}>INVOICE</h4>
                <p className={`text-sm ${theme.colors.text} opacity-70`}>
                  #{formData.invoice.number}
                </p>
                <p className={`text-sm ${theme.colors.text} opacity-70`}>
                  Date: {new Date(formData.invoice.issueDate).toLocaleDateString()}
                </p>
                <p className={`text-sm ${theme.colors.text} opacity-70`}>
                  Due: {new Date(formData.invoice.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Client & Invoice Details */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h5 className={`font-semibold ${theme.colors.text} mb-2`}>Bill To:</h5>
                <p className={`text-sm ${theme.colors.text}`}>{formData.client.name}</p>
                <p className={`text-sm ${theme.colors.text} opacity-70`}>{formData.client.address}</p>
                <p className={`text-sm ${theme.colors.text} opacity-70`}>
                  {formData.client.city}, {formData.client.state} - {formData.client.pincode}
                </p>
                <p className={`text-sm ${theme.colors.text} opacity-70`}>
                  Phone: {formData.client.phone} | Email: {formData.client.email}
                </p>
                {formData.client.gst && (
                  <p className={`text-sm ${theme.colors.text} opacity-70`}>GST: {formData.client.gst}</p>
                )}
              </div>
              <div className="text-right">
                <p className={`text-sm ${theme.colors.text} opacity-70`}>
                  PO Number: {formData.invoice.poNumber || 'N/A'}
                </p>
                <p className={`text-sm ${theme.colors.text} opacity-70`}>
                  Payment Terms: {formData.invoice.paymentTerms}
                </p>
                <p className={`text-sm ${theme.colors.text} opacity-70`}>
                  Currency: {formData.invoice.currency}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className={`border-b ${theme.colors.border}`}>
                    <th className="text-left py-2 px-3">#</th>
                    <th className="text-left py-2 px-3">Description</th>
                    <th className="text-right py-2 px-3">Qty</th>
                    <th className="text-right py-2 px-3">Rate</th>
                    <th className="text-right py-2 px-3">Discount</th>
                    <th className="text-right py-2 px-3">Tax</th>
                    <th className="text-right py-2 px-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => {
                    const itemTotal = calculateItemTotal(item);
                    return (
                      <tr key={index} className={`border-b ${theme.colors.border}`}>
                        <td className="py-2 px-3">{index + 1}</td>
                        <td className="py-2 px-3">{item.description}</td>
                        <td className="text-right py-2 px-3">{item.quantity}</td>
                        <td className="text-right py-2 px-3">{formatCurrency(item.rate)}</td>
                        <td className="text-right py-2 px-3">{item.discount}%</td>
                        <td className="text-right py-2 px-3">{item.taxRate}%</td>
                        <td className="text-right py-2 px-3 font-semibold">
                          {formatCurrency(itemTotal.total)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="6" className="text-right py-2 px-3 font-medium">Subtotal:</td>
                    <td className="text-right py-2 px-3">{formatCurrency(totals.subtotal)}</td>
                  </tr>
                  {totals.overallDiscount > 0 && (
                    <tr>
                      <td colSpan="6" className="text-right py-2 px-3 text-green-600">Discount:</td>
                      <td className="text-right py-2 px-3 text-green-600">
                        -{formatCurrency(totals.overallDiscount)}
                      </td>
                    </tr>
                  )}
                  {totals.shipping > 0 && (
                    <tr>
                      <td colSpan="6" className="text-right py-2 px-3">Shipping:</td>
                      <td className="text-right py-2 px-3">{formatCurrency(totals.shipping)}</td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan="6" className="text-right py-2 px-3">Tax:</td>
                    <td className="text-right py-2 px-3">{formatCurrency(totals.totalTax)}</td>
                  </tr>
                  <tr className="border-t-2 border-primary-500">
                    <td colSpan="6" className="text-right py-3 px-3 text-lg font-bold">Total:</td>
                    <td className="text-right py-3 px-3 text-lg font-bold text-primary-500">
                      {formatCurrency(totals.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Bank Details */}
            {formData.bank.bankName && (
              <div className={`mt-4 p-4 rounded-xl ${theme.colors.background}`}>
                <h6 className={`font-semibold ${theme.colors.text} mb-2`}>Bank Details</h6>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className={`${theme.colors.text} opacity-70`}>Bank: {formData.bank.bankName}</p>
                  <p className={`${theme.colors.text} opacity-70`}>Account: {formData.bank.accountNumber}</p>
                  <p className={`${theme.colors.text} opacity-70`}>IFSC: {formData.bank.ifscCode}</p>
                  <p className={`${theme.colors.text} opacity-70`}>Branch: {formData.bank.branch}</p>
                  {formData.bank.upiId && (
                    <p className={`${theme.colors.text} opacity-70`}>UPI: {formData.bank.upiId}</p>
                  )}
                </div>
              </div>
            )}

            {/* Notes & Terms */}
            {(formData.additional.notes || formData.additional.terms) && (
              <div className="grid grid-cols-2 gap-4">
                {formData.additional.notes && (
                  <div>
                    <h6 className={`font-semibold ${theme.colors.text} mb-1`}>Notes</h6>
                    <p className={`text-sm ${theme.colors.text} opacity-70`}>
                      {formData.additional.notes}
                    </p>
                  </div>
                )}
                {formData.additional.terms && (
                  <div>
                    <h6 className={`font-semibold ${theme.colors.text} mb-1`}>Terms</h6>
                    <p className={`text-sm ${theme.colors.text} opacity-70`}>
                      {formData.additional.terms}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Signature */}
            {formData.additional.signature && (
              <div className="flex justify-end mt-6">
                <div className="text-center">
                  <p className={`text-sm ${theme.colors.text} opacity-70`}>Authorized Signature</p>
                  <div className="border-t-2 border-gray-300 w-48 mt-1 pt-1">
                    <p className={`text-sm ${theme.colors.text}`}>
                      {formData.additional.signature}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Tabs
  const tabs = [
    { id: 'details', label: '📋 Details', icon: FaFileInvoice },
    { id: 'items', label: '📦 Items', icon: FaBox },
    { id: 'bank', label: '🏦 Bank', icon: BsBank2 },
    { id: 'additional', label: '⚙️ Additional', icon: FaTag },
  ];

  return (
    <div className={`min-h-screen ${theme.colors.background} p-3 md:p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6 ${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border}`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/invoices')}
              className={`p-2 rounded-xl ${theme.colors.hover} transition-colors`}
            >
              <FaArrowLeft className={theme.colors.text} />
            </button>
            <div>
              <h1 className={`text-xl md:text-2xl font-bold ${theme.colors.text}`}>
                Standard Invoice
              </h1>
              <p className={`text-sm ${theme.colors.text} opacity-70`}>
                Professional invoice with all standard features
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className={`${theme.colors.button} text-white px-4 md:px-6 py-2 rounded-xl flex items-center gap-2 hover:scale-105 transition-all text-sm w-full sm:w-auto justify-center`}
            >
              <FaEye /> Preview
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex flex-wrap gap-2 mb-4 ${theme.colors.card} p-2 rounded-xl border ${theme.colors.border}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all text-sm ${
                activeTab === tab.id
                  ? `${theme.colors.button} text-white`
                  : `${theme.colors.text} hover:${theme.colors.hover}`
              }`}
            >
              <tab.icon /> {tab.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <>
              {/* Company Section */}
              <div className={`${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border}`}>
                <h2 className={`text-base md:text-lg font-semibold ${theme.colors.text} mb-4 flex items-center gap-2`}>
                  <FaBuilding className={theme.colors.primary} /> Company Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="sm:col-span-2">
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                      Logo
                    </label>
                    <div className="flex items-center gap-4">
                      {logoPreview && (
                        <img src={logoPreview} alt="Logo" className="h-16 w-16 object-contain" />
                      )}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`px-4 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-colors text-sm flex items-center gap-2`}
                      >
                        <FaUpload /> Upload Logo
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.company.name}
                      onChange={handleCompanyChange}
                      className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                      placeholder="Your company name"
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                      GST Number
                    </label>
                    <input
                      type="text"
                      name="gst"
                      value={formData.company.gst}
                      onChange={handleCompanyChange}
                      className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                      placeholder="22AAAAA0000A1Z5"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                      PAN Number
                    </label>
                    <input
                      type="text"
                      name="pan"
                      value={formData.company.pan}
                      onChange={handleCompanyChange}
                      className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                      placeholder="AAAAA0000A"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                      CIN Number
                    </label>
                    <input
                      type="text"
                      name="cin"
                      value={formData.company.cin}
                      onChange={handleCompanyChange}
                      className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                      placeholder="U12345XX2024XXX1234"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.company.website}
                      onChange={handleCompanyChange}
                      className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                      placeholder="https://yourcompany.com"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.company.address}
                      onChange={handleCompanyChange}
                      className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base resize-none`}
                      rows="2"
                      placeholder="Company address"
                    />
                  </div>
                </div>
              </div>

              {/* Client Section */}
              <div className={`${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border}`}>
                <h2 className={`text-base md:text-lg font-semibold ${theme.colors.text} mb-4 flex items-center gap-2`}>
                  <FaUserCircle className={theme.colors.primary} /> Client Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                      Client Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.client.name}
                      onChange={handleClientChange}
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
                      name="email"
                      value={formData.client.email}
                      onChange={handleClientChange}
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
                      name="phone"
                      value={formData.client.phone}
                      onChange={handleClientChange}
                      className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.client.state}
                      onChange={handleClientChange}
                      className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                      placeholder="Maharashtra"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.client.country}
                      onChange={handleClientChange}
                      className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                      placeholder="India"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.client.pincode}
                      onChange={handleClientChange}
                      className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                      placeholder="400001"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                      GST Number
                    </label>
                    <input
                      type="text"
                      name="gst"
                      value={formData.client.gst}
                      onChange={handleClientChange}
                      className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                      placeholder="22AAAAA0000A1Z5"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                      PAN Number
                    </label>
                    <input
                      type="text"
                      name="pan"
                      value={formData.client.pan}
                      onChange={handleClientChange}
                      className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                      placeholder="AAAAA0000A"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.client.address}
                      onChange={handleClientChange}
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
                      Invoice Number
                    </label>
                    <input
                      type="text"
                      name="number"
                      value={formData.invoice.number}
                      onChange={handleInvoiceChange}
                      className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                      Currency
                    </label>
                    <select
                      name="currency"
                      value={formData.invoice.currency}
                      onChange={handleInvoiceChange}
                      className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                    >
                      {CURRENCY_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                      Issue Date
                    </label>
                    <input
                      type="date"
                      name="issueDate"
                      value={formData.invoice.issueDate}
                      onChange={handleInvoiceChange}
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
                      value={formData.invoice.dueDate}
                      onChange={handleInvoiceChange}
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
                      value={formData.invoice.poNumber}
                      onChange={handleInvoiceChange}
                      className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                      placeholder="PO-2024-001"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                      Payment Terms
                    </label>
                    <select
                      name="paymentTerms"
                      value={formData.invoice.paymentTerms}
                      onChange={handleInvoiceChange}
                      className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                    >
                      {PAYMENT_TERMS.map(term => (
                        <option key={term} value={term}>{term}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Items Tab */}
          {activeTab === 'items' && (
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
                <div className="min-w-[700px] sm:min-w-full">
                  {formData.items.map((item, index) => {
                    const itemTotals = calculateItemTotal(item);
                    return (
                      <div key={index} className={`grid grid-cols-12 gap-2 p-2 md:p-3 mb-2 rounded-xl ${theme.colors.background} border ${theme.colors.border}`}>
                        <div className="col-span-12 sm:col-span-3">
                          <label className={`text-xs ${theme.colors.text} opacity-70`}>Item Name</label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            className={`w-full px-2 md:px-3 py-1.5 md:py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                            placeholder="Item description *"
                          />
                        </div>
                        <div className="col-span-3 sm:col-span-1">
                          <label className={`text-xs ${theme.colors.text} opacity-70`}>Qty</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                            className={`w-full px-2 md:px-3 py-1.5 md:py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-center`}
                            min="0.01"
                            step="0.01"
                          />
                        </div>
                        <div className="col-span-3 sm:col-span-1">
                          <label className={`text-xs ${theme.colors.text} opacity-70`}>Rate</label>
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                            className={`w-full px-2 md:px-3 py-1.5 md:py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-center`}
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label className={`text-xs ${theme.colors.text} opacity-70`}>Disc%</label>
                          <input
                            type="number"
                            value={item.discount}
                            onChange={(e) => handleItemChange(index, 'discount', parseFloat(e.target.value) || 0)}
                            className={`w-full px-1 md:px-2 py-1.5 md:py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-center`}
                            min="0"
                            max="100"
                            step="0.5"
                          />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label className={`text-xs ${theme.colors.text} opacity-70`}>Tax%</label>
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
                        <div className="col-span-8 sm:col-span-1 flex items-center justify-end">
                          <span className={`text-sm font-semibold ${theme.colors.text}`}>
                            {formatCurrency(itemTotals.total)}
                          </span>
                        </div>
                        <div className="col-span-4 sm:col-span-1 flex items-center justify-end gap-1">
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

              {/* Summary */}
              <div className="mt-4 flex flex-col sm:flex-row justify-end gap-3">
                <div className="w-full sm:w-72 space-y-2">
                  <div className="flex justify-between py-1">
                    <span className={`text-sm ${theme.colors.text} opacity-70`}>Subtotal:</span>
                    <span className={`text-sm font-medium ${theme.colors.text}`}>
                      {formatCurrency(totals.subtotal)}
                    </span>
                  </div>
                  {totals.totalDiscount > 0 && (
                    <div className="flex justify-between py-1 text-green-600">
                      <span className="text-sm">Item Discount:</span>
                      <span className="text-sm font-medium">-{formatCurrency(totals.totalDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1">
                    <span className={`text-sm ${theme.colors.text} opacity-70`}>Tax:</span>
                    <span className={`text-sm font-medium ${theme.colors.primary}`}>
                      +{formatCurrency(totals.totalTax)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-t-2 border-primary-500/30">
                    <span className={`text-base md:text-lg font-bold ${theme.colors.text}`}>Total:</span>
                    <span className={`text-base md:text-lg font-bold ${theme.colors.primary}`}>
                      {formatCurrency(totals.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bank Tab */}
          {activeTab === 'bank' && (
            <div className={`${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border}`}>
              <h2 className={`text-base md:text-lg font-semibold ${theme.colors.text} mb-4 flex items-center gap-2`}>
                <BsBank2 className={theme.colors.primary} /> Bank Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bank.bankName}
                    onChange={handleBankChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                    placeholder="HDFC Bank"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.bank.accountNumber}
                    onChange={handleBankChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                    placeholder="1234567890"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={formData.bank.ifscCode}
                    onChange={handleBankChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                    placeholder="HDFC0001234"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Branch
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.bank.branch}
                    onChange={handleBankChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                    placeholder="Mumbai Main"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    UPI ID
                  </label>
                  <input
                    type="text"
                    name="upiId"
                    value={formData.bank.upiId}
                    onChange={handleBankChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                    placeholder="company@upi"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Additional Tab */}
          {activeTab === 'additional' && (
            <>
              <div className={`${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border}`}>
                <h2 className={`text-base md:text-lg font-semibold ${theme.colors.text} mb-4 flex items-center gap-2`}>
                  <FaTag className={theme.colors.primary} /> Additional Options
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                      <div className="flex items-center gap-2">
                        <FaPercent className={theme.colors.primary} />
                        Discount
                      </div>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="discount"
                        value={formData.additional.discount}
                        onChange={handleAdditionalChange}
                        className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                        min="0"
                        step="0.01"
                        placeholder="0"
                      />
                      <select
                        name="discountType"
                        value={formData.additional.discountType}
                        onChange={handleAdditionalChange}
                        className={`px-3 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                      >
                        <option value="percentage">%</option>
                        <option value="fixed">₹</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                      <div className="flex items-center gap-2">
                        <FaTruck className={theme.colors.primary} />
                        Shipping Charges
                      </div>
                    </label>
                    <input
                      type="number"
                      name="shipping"
                      value={formData.additional.shipping}
                      onChange={handleAdditionalChange}
                      className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                      min="0"
                      step="0.01"
                      placeholder="0"
                    />
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
                    value={formData.additional.notes}
                    onChange={handleAdditionalChange}
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
                    value={formData.additional.terms}
                    onChange={handleAdditionalChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base resize-none`}
                    rows="3"
                    placeholder="Payment terms..."
                  />
                </div>
              </div>

              {/* Signature */}
              <div className={`${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaSignature className={theme.colors.primary} />
                    <label className={`text-sm font-medium ${theme.colors.text}`}>
                      Authorized Signature
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      name="signature"
                      value={formData.additional.signature || ''}
                      onChange={handleAdditionalChange}
                      className={`px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                      placeholder="Enter authorized person's name"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

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
                  <FaSave /> Create Standard Invoice
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      <PreviewModal />
    </div>
  );
};

export default StandardInvoiceForm;