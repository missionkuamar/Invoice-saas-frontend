// frontend/src/components/invoices/MinimalInvoiceForm.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaPlus, FaTrash, FaSave, FaSpinner, FaCopy,
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEye,
  FaFileInvoice, FaBox, FaCalendar, FaTag, FaArrowLeft,
  FaBuilding, FaSignature, FaFilePdf, FaUpload,
  FaDownload, FaPrint, FaShare, FaWhatsapp, FaEnvelopeOpen,
  FaPercent, FaTruck, FaMoneyBillWave, FaCalendarCheck,
  FaUserCircle, FaIdCard, FaGlobe, FaPhoneAlt,
  FaCreditCard, FaQrcode, FaClock, FaHistory, FaChartLine,
  FaStar, FaRocket, FaMagic, FaPalette, FaBrush,
  FaMinus, FaCircle, FaSquare, 
} from 'react-icons/fa';
import { FaDiamond } from "react-icons/fa6";
import { BsBank2 } from "react-icons/bs";
import { createInvoice } from '../../../store/slices/invoiceSlice';
import { useTheme } from '../../../themes/ThemeProvider';
import toast from 'react-hot-toast';

// Options
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
  { value: '₹', label: 'INR (₹)', symbol: '₹' },
  { value: '$', label: 'USD ($)', symbol: '$' },
  { value: '€', label: 'EUR (€)', symbol: '€' },
  { value: '£', label: 'GBP (£)', symbol: '£' },
];

const PAYMENT_TERMS = [
  { value: 'due_on_receipt', label: 'Due on Receipt' },
  { value: 'net_7', label: 'Net 7 Days' },
  { value: 'net_15', label: 'Net 15 Days' },
  { value: 'net_30', label: 'Net 30 Days' },
  { value: 'net_45', label: 'Net 45 Days' },
  { value: 'net_60', label: 'Net 60 Days' },
];

const MINIMAL_THEMES = [
  { id: 'light', name: 'Light', bg: 'bg-white', text: 'text-gray-900', border: 'border-gray-200', accent: 'gray-600' },
  { id: 'dark', name: 'Dark', bg: 'bg-gray-900', text: 'text-white', border: 'border-gray-700', accent: 'gray-400' },
  { id: 'warm', name: 'Warm', bg: 'bg-amber-50', text: 'text-amber-900', border: 'border-amber-200', accent: 'amber-600' },
  { id: 'cool', name: 'Cool', bg: 'bg-blue-50', text: 'text-blue-900', border: 'border-blue-200', accent: 'blue-600' },
  { id: 'forest', name: 'Forest', bg: 'bg-emerald-50', text: 'text-emerald-900', border: 'border-emerald-200', accent: 'emerald-600' },
  { id: 'rose', name: 'Rose', bg: 'bg-rose-50', text: 'text-rose-900', border: 'border-rose-200', accent: 'rose-600' },
];

const MinimalInvoiceForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useSelector((state) => state.auth);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(MINIMAL_THEMES[0]);
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [isMinimalView, setIsMinimalView] = useState(true);

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
      logo: null,
    },
    // Client Details
    client: {
      name: '',
      email: '',
      phone: '',
      address: '',
      gst: '',
    },
    // Invoice Details
    invoice: {
      number: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      poNumber: '',
      paymentTerms: 'net_30',
      currency: '₹',
      discount: 0,
      shipping: 0,
      notes: '',
      terms: '',
    },
    // Items
    items: [
      { 
        description: '', 
        quantity: 1, 
        rate: 0, 
        taxRate: 18, 
        discount: 0,
      }
    ],
    // Bank Details (minimal)
    bank: {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      upiId: '',
    },
  });

  // Auto-generate invoice number
  const generateInvoiceNumber = useCallback(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    return `INV-${year}${month}${day}-${random}`;
  }, []);

  // Update invoice number on mount
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      invoice: {
        ...prev.invoice,
        number: generateInvoiceNumber()
      }
    }));
  }, [generateInvoiceNumber]);

  // Handle logo upload
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
      invoice: { ...prev.invoice, [name]: parsedValue }
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

  // Bank details handler
  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      bank: { ...prev.bank, [name]: value }
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
      items: [...prev.items, { description: '', quantity: 1, rate: 0, taxRate: 18, discount: 0 }]
    }));
    toast.success('Item added');
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
    toast.success('Item duplicated');
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
  const calculateTotals = useCallback(() => {
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

    const overallDiscount = Number(formData.invoice.discount) || 0;
    const shipping = Number(formData.invoice.shipping) || 0;
    const total = subtotal - totalDiscount - overallDiscount + totalTax + shipping;

    return { 
      subtotal, 
      totalTax, 
      totalDiscount, 
      overallDiscount,
      shipping,
      total 
    };
  }, [formData.items, formData.invoice]);

  const totals = calculateTotals();

  // Format currency
  const formatCurrency = (amount) => {
    const currency = CURRENCY_OPTIONS.find(c => c.value === formData.invoice.currency);
    return `${currency?.symbol || '₹'}${amount.toFixed(2)}`;
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
      const invoiceData = {
        ...formData,
        theme: selectedTheme,
        totals: totals,
        createdAt: new Date().toISOString(),
      };

      await dispatch(createInvoice(invoiceData)).unwrap();
      toast.success('✨ Minimal invoice created successfully!');
      navigate('/invoices');
    } catch (error) {
      toast.error(error.message || 'Failed to create invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick fill sample data
  const fillSampleData = () => {
    setFormData(prev => ({
      ...prev,
      client: {
        name: 'Sarah Johnson',
        email: 'sarah@designstudio.com',
        phone: '+1 234 567 890',
        address: '123 Creative Lane, Art District, NYC 10001',
        gst: '22AAAAA0000A1Z5',
      },
      items: [
        { description: 'Brand Identity Design', quantity: 1, rate: 1200, taxRate: 18, discount: 0 },
        { description: 'Website UI/UX Design', quantity: 2, rate: 800, taxRate: 18, discount: 5 },
        { description: 'Social Media Graphics', quantity: 5, rate: 150, taxRate: 18, discount: 0 },
      ],
      invoice: {
        ...prev.invoice,
        discount: 0,
        shipping: 0,
        notes: 'Thank you for your business!',
        terms: 'Payment due within 30 days',
      }
    }));
    toast.success('Sample data loaded!');
  };

  // Steps for progress
  const steps = [
    { id: 1, label: 'Client', icon: FaUser },
    { id: 2, label: 'Items', icon: FaBox },
    { id: 3, label: 'Details', icon: FaFileInvoice },
    { id: 4, label: 'Review', icon: FaEye },
  ];

  // Preview Modal
  const PreviewModal = () => {
    if (!showPreview) return null;

    const previewTheme = selectedTheme;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto ${previewTheme.bg} ${previewTheme.text} rounded-2xl shadow-2xl p-8 animate-scaleIn`}>
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-inherit z-10 pb-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className={`text-xl font-light ${previewTheme.text} flex items-center gap-2`}>
              <FaEye className="opacity-60" /> Invoice Preview
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className={`px-4 py-2 rounded-lg border ${previewTheme.border} ${previewTheme.text} hover:bg-black/5 transition-all text-sm flex items-center gap-2`}
              >
                <FaPrint /> Print
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className={`px-4 py-2 rounded-lg border ${previewTheme.border} ${previewTheme.text} hover:bg-black/5 transition-all text-sm`}
              >
                Close
              </button>
            </div>
          </div>

          {/* Minimal Preview Content */}
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                {logoPreview && (
                  <img src={logoPreview} alt="Logo" className="h-12 w-auto object-contain mb-2" />
                )}
                <h1 className={`text-2xl font-light ${previewTheme.text}`}>
                  {formData.company.name || 'Your Company'}
                </h1>
                <p className={`text-sm opacity-60 ${previewTheme.text}`}>{formData.company.address}</p>
                <p className={`text-sm opacity-60 ${previewTheme.text}`}>{formData.company.phone} | {formData.company.email}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm opacity-60 ${previewTheme.text}`}>INVOICE</p>
                <p className={`text-xl font-light ${previewTheme.text}`}>{formData.invoice.number}</p>
              </div>
            </div>

            {/* Client & Dates */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className={`text-xs uppercase tracking-wider opacity-40 ${previewTheme.text}`}>Bill To</p>
                <p className={`font-medium ${previewTheme.text}`}>{formData.client.name}</p>
                <p className={`text-sm opacity-60 ${previewTheme.text}`}>{formData.client.address}</p>
                <p className={`text-sm opacity-60 ${previewTheme.text}`}>{formData.client.email}</p>
                <p className={`text-sm opacity-60 ${previewTheme.text}`}>{formData.client.phone}</p>
                {formData.client.gst && (
                  <p className={`text-xs opacity-40 ${previewTheme.text}`}>GST: {formData.client.gst}</p>
                )}
              </div>
              <div className="text-right">
                <p className={`text-xs uppercase tracking-wider opacity-40 ${previewTheme.text}`}>Invoice Details</p>
                <div className="space-y-1">
                  <p className={`text-sm ${previewTheme.text}`}>
                    <span className="opacity-60">Date:</span> {new Date(formData.invoice.issueDate).toLocaleDateString()}
                  </p>
                  <p className={`text-sm ${previewTheme.text}`}>
                    <span className="opacity-60">Due:</span> {new Date(formData.invoice.dueDate).toLocaleDateString()}
                  </p>
                  <p className={`text-sm ${previewTheme.text}`}>
                    <span className="opacity-60">Terms:</span> {PAYMENT_TERMS.find(t => t.value === formData.invoice.paymentTerms)?.label || 'Net 30'}
                  </p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className={`border-b ${previewTheme.border}`}>
                    <th className="text-left py-2 px-3 text-xs uppercase tracking-wider opacity-40">#</th>
                    <th className="text-left py-2 px-3 text-xs uppercase tracking-wider opacity-40">Description</th>
                    <th className="text-right py-2 px-3 text-xs uppercase tracking-wider opacity-40">Qty</th>
                    <th className="text-right py-2 px-3 text-xs uppercase tracking-wider opacity-40">Rate</th>
                    <th className="text-right py-2 px-3 text-xs uppercase tracking-wider opacity-40">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => {
                    const itemTotal = calculateItemTotal(item);
                    return (
                      <tr key={index} className={`border-b ${previewTheme.border}`}>
                        <td className="py-2 px-3 text-sm opacity-60">{index + 1}</td>
                        <td className="py-2 px-3">
                          <p className={`font-medium ${previewTheme.text}`}>{item.description}</p>
                          {item.taxRate > 0 && (
                            <p className={`text-xs opacity-40 ${previewTheme.text}`}>Tax: {item.taxRate}%</p>
                          )}
                        </td>
                        <td className="text-right py-2 px-3 text-sm">{item.quantity}</td>
                        <td className="text-right py-2 px-3 text-sm">{formatCurrency(item.rate)}</td>
                        <td className="text-right py-2 px-3 text-sm font-medium">
                          {formatCurrency(itemTotal.total)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" className="text-right py-2 px-3 text-sm opacity-60">Subtotal</td>
                    <td className="text-right py-2 px-3 text-sm">{formatCurrency(totals.subtotal)}</td>
                  </tr>
                  {totals.totalDiscount > 0 && (
                    <tr>
                      <td colSpan="4" className="text-right py-2 px-3 text-sm opacity-60">Discount</td>
                      <td className="text-right py-2 px-3 text-sm text-green-600">-{formatCurrency(totals.totalDiscount)}</td>
                    </tr>
                  )}
                  {totals.overallDiscount > 0 && (
                    <tr>
                      <td colSpan="4" className="text-right py-2 px-3 text-sm opacity-60">Overall Discount</td>
                      <td className="text-right py-2 px-3 text-sm text-green-600">-{formatCurrency(totals.overallDiscount)}</td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan="4" className="text-right py-2 px-3 text-sm opacity-60">Tax</td>
                    <td className="text-right py-2 px-3 text-sm">{formatCurrency(totals.totalTax)}</td>
                  </tr>
                  <tr>
                    <td colSpan="4" className="text-right py-2 px-3 text-sm opacity-60">Shipping</td>
                    <td className="text-right py-2 px-3 text-sm">{formatCurrency(totals.shipping)}</td>
                  </tr>
                  <tr className={`border-t-2 ${previewTheme.border}`}>
                    <td colSpan="4" className="text-right py-3 px-3 text-lg font-medium">Total</td>
                    <td className="text-right py-3 px-3 text-lg font-medium">
                      {formatCurrency(totals.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Notes & Terms */}
            {(formData.invoice.notes || formData.invoice.terms) && (
              <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                {formData.invoice.notes && (
                  <div>
                    <p className={`text-xs uppercase tracking-wider opacity-40 ${previewTheme.text}`}>Notes</p>
                    <p className={`text-sm ${previewTheme.text}`}>{formData.invoice.notes}</p>
                  </div>
                )}
                {formData.invoice.terms && (
                  <div>
                    <p className={`text-xs uppercase tracking-wider opacity-40 ${previewTheme.text}`}>Terms</p>
                    <p className={`text-sm ${previewTheme.text}`}>{formData.invoice.terms}</p>
                  </div>
                )}
              </div>
            )}

            {/* Bank Details (minimal) */}
            {formData.bank.bankName && (
              <div className={`pt-4 border-t ${previewTheme.border}`}>
                <p className={`text-xs uppercase tracking-wider opacity-40 ${previewTheme.text} mb-2`}>Bank Details</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><span className="opacity-60">Bank:</span> {formData.bank.bankName}</p>
                  <p><span className="opacity-60">Account:</span> {formData.bank.accountNumber}</p>
                  <p><span className="opacity-60">IFSC:</span> {formData.bank.ifscCode}</p>
                  {formData.bank.upiId && <p><span className="opacity-60">UPI:</span> {formData.bank.upiId}</p>}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className={`pt-4 border-t ${previewTheme.border} text-center`}>
              <p className={`text-xs opacity-40 ${previewTheme.text}`}>
                Thank you for your business!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Theme selector
  const ThemeSelector = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      {MINIMAL_THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => setSelectedTheme(t)}
          className={`px-3 py-1.5 rounded-lg border-2 transition-all text-sm ${
            selectedTheme.id === t.id
              ? `border-primary-500 ${t.bg} ${t.text} shadow-md`
              : `${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover}`
          }`}
        >
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${t.bg} border ${t.border}`} />
            {t.name}
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <div className={`min-h-screen ${theme.colors.background} p-3 md:p-6`}>
      <div className="max-w-5xl mx-auto">
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
              <h1 className={`text-xl md:text-2xl font-light ${theme.colors.text}`}>
                Minimal Invoice
              </h1>
              <p className={`text-sm ${theme.colors.text} opacity-60`}>
                Clean, simple, and elegant invoicing
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto flex-wrap">
            <button
              type="button"
              onClick={fillSampleData}
              className={`px-4 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-all text-sm flex items-center gap-2`}
            >
              <FaMagic /> Sample
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className={`px-4 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-all text-sm flex items-center gap-2`}
            >
              <FaEye /> Preview
            </button>
          </div>
        </div>

        {/* Theme Selector */}
        <ThemeSelector />

        {/* Progress Steps */}
        <div className={`flex mb-6 ${theme.colors.card} p-2 rounded-xl border ${theme.colors.border}`}>
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                activeStep === step.id
                  ? `${theme.colors.button} text-white shadow-md`
                  : `${theme.colors.text} hover:${theme.colors.hover}`
              }`}
            >
              <step.icon /> {step.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* Step 1: Client */}
          {activeStep === 1 && (
            <div className={`${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border} animate-fadeIn`}>
              <h2 className={`text-base font-light ${theme.colors.text} mb-4 flex items-center gap-2`}>
                <FaUserCircle className="opacity-60" /> Client Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className={`block text-xs uppercase tracking-wider opacity-60 ${theme.colors.text} mb-1`}>
                    Client Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.client.name}
                    onChange={handleClientChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                    placeholder="Enter client name"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-xs uppercase tracking-wider opacity-60 ${theme.colors.text} mb-1`}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.client.email}
                    onChange={handleClientChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                    placeholder="client@example.com"
                  />
                </div>
                <div>
                  <label className={`block text-xs uppercase tracking-wider opacity-60 ${theme.colors.text} mb-1`}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.client.phone}
                    onChange={handleClientChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className={`block text-xs uppercase tracking-wider opacity-60 ${theme.colors.text} mb-1`}>
                    GST Number
                  </label>
                  <input
                    type="text"
                    name="gst"
                    value={formData.client.gst}
                    onChange={handleClientChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-xs uppercase tracking-wider opacity-60 ${theme.colors.text} mb-1`}>
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.client.address}
                    onChange={handleClientChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base resize-none transition-all`}
                    rows="2"
                    placeholder="Client address"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Items */}
          {activeStep === 2 && (
            <div className={`${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border} animate-fadeIn`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <h2 className={`text-base font-light ${theme.colors.text} flex items-center gap-2`}>
                  <FaBox className="opacity-60" /> Items
                </h2>
                <button
                  type="button"
                  onClick={addItem}
                  className={`px-4 py-2 rounded-xl ${theme.colors.button} text-white flex items-center gap-2 hover:scale-105 transition-all text-sm`}
                >
                  <FaPlus /> Add Item
                </button>
              </div>

              <div className="space-y-3">
                {formData.items.map((item, index) => {
                  const itemTotal = calculateItemTotal(item);
                  return (
                    <div key={index} className={`grid grid-cols-12 gap-2 p-3 rounded-xl ${theme.colors.background} border ${theme.colors.border}`}>
                      <div className="col-span-12 sm:col-span-4">
                        <label className={`text-xs uppercase tracking-wider opacity-60 ${theme.colors.text}`}>Item</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          className={`w-full px-2 md:px-3 py-1.5 md:py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all`}
                          placeholder="Description *"
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <label className={`text-xs uppercase tracking-wider opacity-60 ${theme.colors.text}`}>Qty</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className={`w-full px-2 md:px-3 py-1.5 md:py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-center transition-all`}
                          min="0.01"
                          step="0.01"
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <label className={`text-xs uppercase tracking-wider opacity-60 ${theme.colors.text}`}>Rate</label>
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                          className={`w-full px-2 md:px-3 py-1.5 md:py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-center transition-all`}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className={`text-xs uppercase tracking-wider opacity-60 ${theme.colors.text}`}>Disc%</label>
                        <input
                          type="number"
                          value={item.discount}
                          onChange={(e) => handleItemChange(index, 'discount', parseFloat(e.target.value) || 0)}
                          className={`w-full px-1 md:px-2 py-1.5 md:py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-center transition-all`}
                          min="0"
                          max="100"
                          step="0.5"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className={`text-xs uppercase tracking-wider opacity-60 ${theme.colors.text}`}>Tax%</label>
                        <select
                          value={item.taxRate}
                          onChange={(e) => handleItemChange(index, 'taxRate', parseFloat(e.target.value))}
                          className={`w-full px-1 md:px-2 py-1.5 md:py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all`}
                        >
                          {TAX_OPTIONS.map((tax, i) => (
                            <option key={i} value={tax.rate}>{tax.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-6 sm:col-span-1 flex items-center justify-end">
                        <span className={`text-sm font-medium ${theme.colors.text}`}>
                          {formatCurrency(itemTotal.total)}
                        </span>
                      </div>
                      <div className="col-span-6 sm:col-span-1 flex items-center justify-end gap-1">
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
          )}

          {/* Step 3: Details */}
          {activeStep === 3 && (
            <div className={`${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border} animate-fadeIn`}>
              <h2 className={`text-base font-light ${theme.colors.text} mb-4 flex items-center gap-2`}>
                <FaFileInvoice className="opacity-60" /> Invoice Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className={`block text-xs uppercase tracking-wider opacity-60 ${theme.colors.text} mb-1`}>
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    name="number"
                    value={formData.invoice.number}
                    onChange={handleInputChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                  />
                </div>
                <div>
                  <label className={`block text-xs uppercase tracking-wider opacity-60 ${theme.colors.text} mb-1`}>
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={formData.invoice.currency}
                    onChange={handleInputChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                  >
                    {CURRENCY_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-xs uppercase tracking-wider opacity-60 ${theme.colors.text} mb-1`}>
                    Issue Date
                  </label>
                  <input
                    type="date"
                    name="issueDate"
                    value={formData.invoice.issueDate}
                    onChange={handleInputChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                  />
                </div>
                <div>
                  <label className={`block text-xs uppercase tracking-wider opacity-60 ${theme.colors.text} mb-1`}>
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.invoice.dueDate}
                    onChange={handleInputChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                  />
                </div>
                <div>
                  <label className={`block text-xs uppercase tracking-wider opacity-60 ${theme.colors.text} mb-1`}>
                    Payment Terms
                  </label>
                  <select
                    name="paymentTerms"
                    value={formData.invoice.paymentTerms}
                    onChange={handleInputChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                  >
                    {PAYMENT_TERMS.map(term => (
                      <option key={term.value} value={term.value}>
                        {term.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-xs uppercase tracking-wider opacity-60 ${theme.colors.text} mb-1`}>
                    PO Number
                  </label>
                  <input
                    type="text"
                    name="poNumber"
                    value={formData.invoice.poNumber}
                    onChange={handleInputChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                    placeholder="PO-2024-001"
                  />
                </div>
                <div>
                  <label className={`block text-xs uppercase tracking-wider opacity-60 ${theme.colors.text} mb-1`}>
                    Discount
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.invoice.discount}
                    onChange={handleInputChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                    min="0"
                    step="0.01"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className={`block text-xs uppercase tracking-wider opacity-60 ${theme.colors.text} mb-1`}>
                    Shipping Charges
                  </label>
                  <input
                    type="number"
                    name="shipping"
                    value={formData.invoice.shipping}
                    onChange={handleInputChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                    min="0"
                    step="0.01"
                    placeholder="0"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-xs uppercase tracking-wider opacity-60 ${theme.colors.text} mb-1`}>
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.invoice.notes}
                    onChange={handleInputChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base resize-none transition-all`}
                    rows="2"
                    placeholder="Additional notes..."
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-xs uppercase tracking-wider opacity-60 ${theme.colors.text} mb-1`}>
                    Terms & Conditions
                  </label>
                  <textarea
                    name="terms"
                    value={formData.invoice.terms}
                    onChange={handleInputChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base resize-none transition-all`}
                    rows="2"
                    placeholder="Payment terms..."
                  />
                </div>
              </div>

              {/* Bank Details */}
              <div className="mt-6 pt-6 border-t">
                <h3 className={`text-sm font-light ${theme.colors.text} mb-3 flex items-center gap-2`}>
                  <BsBank2 className="opacity-60" /> Bank Details (Optional)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className={`block text-xs uppercase tracking-wider opacity-60 ${theme.colors.text} mb-1`}>
                      Bank Name
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bank.bankName}
                      onChange={handleBankChange}
                      className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                      placeholder="HDFC Bank"
                    />
                  </div>
                  <div>
                    <label className={`block text-xs uppercase tracking-wider opacity-60 ${theme.colors.text} mb-1`}>
                      Account Number
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.bank.accountNumber}
                      onChange={handleBankChange}
                      className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                      placeholder="1234567890"
                    />
                  </div>
                  <div>
                    <label className={`block text-xs uppercase tracking-wider opacity-60 ${theme.colors.text} mb-1`}>
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={formData.bank.ifscCode}
                      onChange={handleBankChange}
                      className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                      placeholder="HDFC0001234"
                    />
                  </div>
                  <div>
                    <label className={`block text-xs uppercase tracking-wider opacity-60 ${theme.colors.text} mb-1`}>
                      UPI ID
                    </label>
                    <input
                      type="text"
                      name="upiId"
                      value={formData.bank.upiId}
                      onChange={handleBankChange}
                      className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                      placeholder="company@upi"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {activeStep === 4 && (
            <div className={`${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border} animate-fadeIn`}>
              <h2 className={`text-base font-light ${theme.colors.text} mb-4 flex items-center gap-2`}>
                <FaEye className="opacity-60" /> Review & Summary
              </h2>

              <div className="space-y-4">
                {/* Client Summary */}
                <div className={`p-4 rounded-xl ${theme.colors.background} border ${theme.colors.border}`}>
                  <p className={`text-xs uppercase tracking-wider opacity-60 ${theme.colors.text} mb-2`}>Client</p>
                  <p className={`font-medium ${theme.colors.text}`}>{formData.client.name}</p>
                  <p className={`text-sm opacity-60 ${theme.colors.text}`}>{formData.client.email}</p>
                </div>

                {/* Items Summary */}
                <div className={`p-4 rounded-xl ${theme.colors.background} border ${theme.colors.border}`}>
                  <p className={`text-xs uppercase tracking-wider opacity-60 ${theme.colors.text} mb-2`}>Items</p>
                  <div className="space-y-1">
                    {formData.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.description}</span>
                        <span className="opacity-60">{item.quantity} × {formatCurrency(item.rate)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className={`p-4 rounded-xl ${theme.colors.background} border ${theme.colors.border}`}>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="opacity-60">Subtotal</span>
                      <span>{formatCurrency(totals.subtotal)}</span>
                    </div>
                    {totals.totalDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-{formatCurrency(totals.totalDiscount)}</span>
                      </div>
                    )}
                    {totals.overallDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Overall Discount</span>
                        <span>-{formatCurrency(totals.overallDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="opacity-60">Tax</span>
                      <span>{formatCurrency(totals.totalTax)}</span>
                    </div>
                    {totals.shipping > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="opacity-60">Shipping</span>
                        <span>{formatCurrency(totals.shipping)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t font-medium">
                      <span>Total</span>
                      <span className="text-lg">{formatCurrency(totals.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Theme Preview */}
                <div className={`p-4 rounded-xl ${theme.colors.background} border ${theme.colors.border}`}>
                  <p className={`text-xs uppercase tracking-wider opacity-60 ${theme.colors.text} mb-2`}>Theme</p>
                  <div className={`flex items-center gap-2 ${selectedTheme.bg} ${selectedTheme.text} p-2 rounded-lg`}>
                    <div className={`w-4 h-4 rounded-full ${selectedTheme.bg} border ${selectedTheme.border}`} />
                    <span>{selectedTheme.name} Theme</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className={`flex justify-between gap-3 ${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border}`}>
            <button
              type="button"
              onClick={() => {
                if (activeStep > 1) setActiveStep(activeStep - 1);
                else navigate('/invoices');
              }}
              className={`px-4 md:px-6 py-2.5 md:py-3 rounded-xl border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-colors text-sm`}
            >
              {activeStep > 1 ? '← Back' : 'Cancel'}
            </button>
            {activeStep < 4 ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep + 1)}
                className={`px-4 md:px-8 py-2.5 md:py-3 rounded-xl ${theme.colors.button} text-white hover:scale-105 transition-all text-sm`}
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 md:px-8 py-2.5 md:py-3 rounded-xl ${theme.colors.button} text-white flex items-center gap-2 hover:scale-105 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
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
            )}
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      <PreviewModal />

      {/* Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MinimalInvoiceForm;