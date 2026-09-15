// frontend/src/components/invoices/ModernInvoiceForm.jsx
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
  FaStar, FaRocket, FaMagic, FaPalette, FaBrush
} from 'react-icons/fa';
import { createInvoice } from '../../../store/slices/invoiceSlice';
import { useTheme } from '../../../themes/ThemeProvider';
import toast from 'react-hot-toast';
import { BsBank2 } from "react-icons/bs";

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
  { value: '¥', label: 'JPY (¥)', symbol: '¥' },
];

const PAYMENT_TERMS = [
  { value: 'due_on_receipt', label: 'Due on Receipt' },
  { value: 'net_7', label: 'Net 7 Days' },
  { value: 'net_15', label: 'Net 15 Days' },
  { value: 'net_30', label: 'Net 30 Days' },
  { value: 'net_45', label: 'Net 45 Days' },
  { value: 'net_60', label: 'Net 60 Days' },
  { value: '2_10_net_30', label: '2/10 Net 30' },
];

const INVOICE_TEMPLATES = [
  { id: 'modern', name: 'Modern', icon: FaRocket, color: 'from-blue-500 to-purple-600' },
  { id: 'minimal', name: 'Minimal', icon: FaMagic, color: 'from-gray-500 to-gray-700' },
  { id: 'corporate', name: 'Corporate', icon: FaBuilding, color: 'from-indigo-500 to-blue-600' },
  { id: 'creative', name: 'Creative', icon: FaPalette, color: 'from-pink-500 to-orange-500' },
];

const COLOR_SCHEMES = [
  { name: 'Blue', primary: '#3B82F6', secondary: '#1D4ED8', gradient: 'from-blue-500 to-blue-700' },
  { name: 'Purple', primary: '#8B5CF6', secondary: '#6D28D9', gradient: 'from-purple-500 to-purple-700' },
  { name: 'Green', primary: '#10B981', secondary: '#065F46', gradient: 'from-green-500 to-green-700' },
  { name: 'Red', primary: '#EF4444', secondary: '#991B1B', gradient: 'from-red-500 to-red-700' },
  { name: 'Orange', primary: '#F59E0B', secondary: '#92400E', gradient: 'from-orange-500 to-orange-700' },
  { name: 'Teal', primary: '#14B8A6', secondary: '#0F766E', gradient: 'from-teal-500 to-teal-700' },
];

const ModernInvoiceForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useSelector((state) => state.auth);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState('company');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [selectedColor, setSelectedColor] = useState(COLOR_SCHEMES[0]);
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [animation, setAnimation] = useState(false);

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
      tagline: 'Invoicing Simplified',
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
      type: 'individual', // individual, business, government
    },
    // Invoice Details
    invoice: {
      number: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      poNumber: '',
      paymentTerms: 'net_30',
      currency: '₹',
      discountType: 'percentage',
      discount: 0,
      shipping: 0,
      lateFee: 0,
      taxInclusive: false,
      showTaxBreakdown: true,
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
        notes: '',
      }
    ],
    // Bank Details
    bank: {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      branch: '',
      upiId: '',
      qrCode: null,
    },
    // Additional
    additional: {
      notes: '',
      terms: '',
      signature: '',
      signatureDate: new Date().toISOString().split('T')[0],
      authorizedPerson: '',
      department: '',
      projectCode: '',
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
    const { name, value, type, checked } = e.target;
    const parsedValue = type === 'checkbox' ? checked : 
                       type === 'number' ? parseFloat(value) || 0 : value;
    
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

  // Additional fields handler
  const handleAdditionalChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      additional: { ...prev.additional, [name]: value }
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
        notes: '',
      }]
    }));
    setAnimation(true);
    setTimeout(() => setAnimation(false), 500);
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
    toast.success('Item duplicated!');
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
    const taxAmount = formData.invoice.taxInclusive ? 
      0 : (taxableAmount * taxRate) / 100;
    
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
      
      if (!formData.invoice.taxInclusive) {
        totalTax += ((amount - discountAmount) * taxRate) / 100;
      }
    });

    // Apply overall discount
    let overallDiscount = Number(formData.invoice.discount) || 0;
    if (formData.invoice.discountType === 'percentage') {
      overallDiscount = (subtotal * overallDiscount) / 100;
    }

    const shipping = Number(formData.invoice.shipping) || 0;
    const lateFee = Number(formData.invoice.lateFee) || 0;
    const total = subtotal - totalDiscount - overallDiscount + totalTax + shipping + lateFee;

    return { 
      subtotal, 
      totalTax, 
      totalDiscount, 
      overallDiscount,
      shipping,
      lateFee,
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
        template: selectedTemplate,
        colorScheme: selectedColor,
        totals: totals,
        createdAt: new Date().toISOString(),
      };

      await dispatch(createInvoice(invoiceData)).unwrap();
      toast.success('✨ Modern invoice created successfully!');
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
        name: 'Tech Solutions Inc.',
        email: 'contact@techsolutions.com',
        phone: '+1 234 567 8900',
        address: '123 Innovation Drive, Silicon Valley, CA 94025',
        gst: '22AAAAA0000A1Z5',
        pan: 'AAAAA0000A',
        state: 'California',
        country: 'USA',
        pincode: '94025',
        type: 'business',
      },
      items: [
        { description: 'Web Development Services', quantity: 40, rate: 150, taxRate: 18, discount: 5, unit: 'hours', hsCode: '9983', notes: 'Frontend & Backend' },
        { description: 'UI/UX Design', quantity: 20, rate: 200, taxRate: 18, discount: 0, unit: 'hours', hsCode: '9984', notes: 'Figma Design' },
        { description: 'Digital Marketing', quantity: 1, rate: 500, taxRate: 18, discount: 0, unit: 'package', hsCode: '9985', notes: 'SEO & Social Media' },
      ],
    }));
    toast.success('Sample data loaded! 🚀');
  };

  // Sections for navigation
  const sections = [
    { id: 'company', label: 'Company', icon: FaBuilding },
    { id: 'client', label: 'Client', icon: FaUserCircle },
    { id: 'invoice', label: 'Invoice', icon: FaFileInvoice },
    { id: 'items', label: 'Items', icon: FaBox },
    { id: 'bank', label: 'Bank', icon: BsBank2 },
    { id: 'additional', label: 'Additional', icon: FaTag },
    { id: 'design', label: 'Design', icon: FaPalette },
  ];

  // Preview Modal
  const PreviewModal = () => {
    if (!showPreview) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div className={`relative w-full max-w-5xl max-h-[90vh] overflow-y-auto ${theme.colors.card} rounded-2xl shadow-2xl p-6 animate-scaleIn`}>
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-inherit z-10 pb-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className={`text-2xl font-bold ${theme.colors.text} flex items-center gap-2`}>
              <FaEye className="text-primary-500" /> Invoice Preview
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className={`px-4 py-2 rounded-xl bg-gradient-to-r ${selectedColor.gradient} text-white flex items-center gap-2 hover:scale-105 transition-all`}
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

          {/* Modern Preview Content */}
          <div className="space-y-6">
            {/* Header with Gradient */}
            <div className={`bg-gradient-to-r ${selectedColor.gradient} p-6 rounded-xl text-white`}>
              <div className="flex justify-between items-start">
                <div>
                  {logoPreview && (
                    <img src={logoPreview} alt="Logo" className="h-16 w-auto object-contain mb-2 bg-white/10 p-2 rounded-lg" />
                  )}
                  <h2 className="text-2xl font-bold">{formData.company.name || 'Your Company'}</h2>
                  <p className="text-sm opacity-90">{formData.company.tagline}</p>
                  <p className="text-sm opacity-80 mt-2">{formData.company.address}</p>
                  <p className="text-sm opacity-80">{formData.company.phone} | {formData.company.email}</p>
                </div>
                <div className="text-right">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <p className="text-sm font-semibold">INVOICE</p>
                    <p className="text-2xl font-bold">{formData.invoice.number}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Client & Invoice Info */}
            <div className="grid grid-cols-2 gap-6">
              <div className={`p-4 rounded-xl ${theme.colors.background}`}>
                <h5 className={`font-semibold ${theme.colors.text} mb-2 flex items-center gap-2`}>
                  <FaUserCircle /> Bill To:
                </h5>
                <p className={`font-medium ${theme.colors.text}`}>{formData.client.name}</p>
                <p className={`text-sm ${theme.colors.text} opacity-70`}>{formData.client.address}</p>
                <p className={`text-sm ${theme.colors.text} opacity-70`}>{formData.client.email}</p>
                <p className={`text-sm ${theme.colors.text} opacity-70`}>{formData.client.phone}</p>
                {formData.client.gst && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded text-xs">
                    GST: {formData.client.gst}
                  </span>
                )}
              </div>
              <div className={`p-4 rounded-xl ${theme.colors.background}`}>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className={`${theme.colors.text} opacity-60`}>Issue Date:</span>
                  <span className={`${theme.colors.text} font-medium`}>
                    {new Date(formData.invoice.issueDate).toLocaleDateString()}
                  </span>
                  <span className={`${theme.colors.text} opacity-60`}>Due Date:</span>
                  <span className={`${theme.colors.text} font-medium`}>
                    {new Date(formData.invoice.dueDate).toLocaleDateString()}
                  </span>
                  <span className={`${theme.colors.text} opacity-60`}>Payment Terms:</span>
                  <span className={`${theme.colors.text} font-medium`}>
                    {PAYMENT_TERMS.find(t => t.value === formData.invoice.paymentTerms)?.label || 'Net 30'}
                  </span>
                  <span className={`${theme.colors.text} opacity-60`}>Currency:</span>
                  <span className={`${theme.colors.text} font-medium`}>{formData.invoice.currency}</span>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className={`bg-gradient-to-r ${selectedColor.gradient} text-white`}>
                    <th className="text-left py-3 px-4 rounded-l-lg">#</th>
                    <th className="text-left py-3 px-4">Description</th>
                    <th className="text-right py-3 px-4">Qty</th>
                    <th className="text-right py-3 px-4">Rate</th>
                    <th className="text-right py-3 px-4">Disc.</th>
                    <th className="text-right py-3 px-4">Tax</th>
                    <th className="text-right py-3 px-4 rounded-r-lg">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => {
                    const itemTotal = calculateItemTotal(item);
                    return (
                      <tr key={index} className={`border-b ${theme.colors.border} hover:${theme.colors.hover} transition-colors`}>
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4">
                          <div className="font-medium">{item.description}</div>
                          {item.notes && <div className="text-xs opacity-60">{item.notes}</div>}
                        </td>
                        <td className="text-right py-3 px-4">{item.quantity} {item.unit}</td>
                        <td className="text-right py-3 px-4">{formatCurrency(item.rate)}</td>
                        <td className="text-right py-3 px-4">{item.discount}%</td>
                        <td className="text-right py-3 px-4">{item.taxRate}%</td>
                        <td className="text-right py-3 px-4 font-semibold">
                          {formatCurrency(itemTotal.total)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="6" className="text-right py-2 px-4 font-medium">Subtotal:</td>
                    <td className="text-right py-2 px-4">{formatCurrency(totals.subtotal)}</td>
                  </tr>
                  {totals.totalDiscount > 0 && (
                    <tr>
                      <td colSpan="6" className="text-right py-2 px-4 text-green-600">Item Discount:</td>
                      <td className="text-right py-2 px-4 text-green-600">-{formatCurrency(totals.totalDiscount)}</td>
                    </tr>
                  )}
                  {totals.overallDiscount > 0 && (
                    <tr>
                      <td colSpan="6" className="text-right py-2 px-4 text-green-600">Overall Discount:</td>
                      <td className="text-right py-2 px-4 text-green-600">-{formatCurrency(totals.overallDiscount)}</td>
                    </tr>
                  )}
                  {totals.shipping > 0 && (
                    <tr>
                      <td colSpan="6" className="text-right py-2 px-4">Shipping:</td>
                      <td className="text-right py-2 px-4">{formatCurrency(totals.shipping)}</td>
                    </tr>
                  )}
                  {totals.lateFee > 0 && (
                    <tr>
                      <td colSpan="6" className="text-right py-2 px-4 text-red-500">Late Fee:</td>
                      <td className="text-right py-2 px-4 text-red-500">{formatCurrency(totals.lateFee)}</td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan="6" className="text-right py-2 px-4">Tax:</td>
                    <td className="text-right py-2 px-4">{formatCurrency(totals.totalTax)}</td>
                  </tr>
                  <tr className={`border-t-2 border-primary-500 bg-gradient-to-r ${selectedColor.gradient} bg-opacity-5`}>
                    <td colSpan="6" className="text-right py-3 px-4 text-lg font-bold">Total:</td>
                    <td className="text-right py-3 px-4 text-lg font-bold" style={{ color: selectedColor.primary }}>
                      {formatCurrency(totals.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Bank Details */}
            {formData.bank.bankName && (
              <div className={`p-4 rounded-xl bg-gradient-to-r ${selectedColor.gradient} bg-opacity-10 border border-${selectedColor.primary}`}>
                <h6 className={`font-semibold ${theme.colors.text} mb-2 flex items-center gap-2`}>
                  <BsBank2 /> Bank Details
                </h6>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  <p><span className="opacity-60">Bank:</span> {formData.bank.bankName}</p>
                  <p><span className="opacity-60">Account:</span> {formData.bank.accountNumber}</p>
                  <p><span className="opacity-60">IFSC:</span> {formData.bank.ifscCode}</p>
                  <p><span className="opacity-60">Branch:</span> {formData.bank.branch}</p>
                  {formData.bank.upiId && (
                    <p><span className="opacity-60">UPI:</span> {formData.bank.upiId}</p>
                  )}
                </div>
              </div>
            )}

            {/* Notes & Terms */}
            {(formData.additional.notes || formData.additional.terms) && (
              <div className="grid grid-cols-2 gap-4">
                {formData.additional.notes && (
                  <div className={`p-4 rounded-xl ${theme.colors.background}`}>
                    <h6 className={`font-semibold ${theme.colors.text} mb-1`}>📝 Notes</h6>
                    <p className={`text-sm ${theme.colors.text} opacity-70`}>{formData.additional.notes}</p>
                  </div>
                )}
                {formData.additional.terms && (
                  <div className={`p-4 rounded-xl ${theme.colors.background}`}>
                    <h6 className={`font-semibold ${theme.colors.text} mb-1`}>📋 Terms</h6>
                    <p className={`text-sm ${theme.colors.text} opacity-70`}>{formData.additional.terms}</p>
                  </div>
                )}
              </div>
            )}

            {/* Signature */}
            {formData.additional.signature && (
              <div className="flex justify-end mt-4">
                <div className="text-center">
                  <p className={`text-sm ${theme.colors.text} opacity-60`}>Authorized Signature</p>
                  <div className="border-t-2 border-gray-300 w-48 mt-1 pt-1">
                    <p className={`font-medium ${theme.colors.text}`}>{formData.additional.signature}</p>
                    <p className={`text-xs ${theme.colors.text} opacity-60`}>
                      {formData.additional.authorizedPerson || ''}
                    </p>
                    <p className={`text-xs ${theme.colors.text} opacity-60`}>
                      {formData.additional.signatureDate ? new Date(formData.additional.signatureDate).toLocaleDateString() : ''}
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

  return (
    <div className={`min-h-screen ${theme.colors.background} p-3 md:p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6 ${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border} shadow-lg`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/invoices')}
              className={`p-2 rounded-xl ${theme.colors.hover} transition-colors hover:scale-110`}
            >
              <FaArrowLeft className={theme.colors.text} />
            </button>
            <div>
              <h1 className={`text-xl md:text-2xl font-bold ${theme.colors.text} flex items-center gap-2`}>
                <FaRocket className="text-primary-500" /> Modern Invoice
              </h1>
              <p className={`text-sm ${theme.colors.text} opacity-70`}>
                Create stunning, professional invoices with modern design
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto flex-wrap">
            <button
              type="button"
              onClick={fillSampleData}
              className={`px-4 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-all text-sm flex items-center gap-2`}
            >
              <FaMagic /> Sample Data
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className={`px-4 py-2 rounded-xl bg-gradient-to-r ${selectedColor.gradient} text-white flex items-center gap-2 hover:scale-105 transition-all text-sm`}
            >
              <FaEye /> Preview
            </button>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className={`flex flex-wrap gap-1 mb-4 ${theme.colors.card} p-2 rounded-xl border ${theme.colors.border}`}>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all text-sm ${
                activeSection === section.id
                  ? `bg-gradient-to-r ${selectedColor.gradient} text-white shadow-lg`
                  : `${theme.colors.text} hover:${theme.colors.hover}`
              }`}
            >
              <section.icon /> {section.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* Company Section */}
          {activeSection === 'company' && (
            <div className={`${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border} shadow-lg animate-fadeIn`}>
              <h2 className={`text-base md:text-lg font-semibold ${theme.colors.text} mb-4 flex items-center gap-2`}>
                <FaBuilding className="text-primary-500" /> Company Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="sm:col-span-2">
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Logo
                  </label>
                  <div className="flex items-center gap-4">
                    {logoPreview && (
                      <img src={logoPreview} alt="Logo" className="h-16 w-16 object-contain rounded-lg border-2 border-primary-500 p-1" />
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`px-4 py-2 rounded-xl border-2 border-dashed ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-colors text-sm flex items-center gap-2`}
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                    placeholder="Your company name"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Tagline
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.company.tagline}
                    onChange={handleCompanyChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                    placeholder="Your company tagline"
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.company.phone}
                    onChange={handleCompanyChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.company.email}
                    onChange={handleCompanyChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                    placeholder="company@example.com"
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base resize-none transition-all`}
                    rows="2"
                    placeholder="Company address"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Client Section */}
          {activeSection === 'client' && (
            <div className={`${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border} shadow-lg animate-fadeIn`}>
              <h2 className={`text-base md:text-lg font-semibold ${theme.colors.text} mb-4 flex items-center gap-2`}>
                <FaUserCircle className="text-primary-500" /> Client Information
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                    placeholder="Enter client name"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Client Type
                  </label>
                  <select
                    name="type"
                    value={formData.client.type}
                    onChange={handleClientChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                  >
                    <option value="individual">Individual</option>
                    <option value="business">Business</option>
                    <option value="government">Government</option>
                  </select>
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base resize-none transition-all`}
                    rows="2"
                    placeholder="Client address"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Invoice Section */}
          {activeSection === 'invoice' && (
            <div className={`${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border} shadow-lg animate-fadeIn`}>
              <h2 className={`text-base md:text-lg font-semibold ${theme.colors.text} mb-4 flex items-center gap-2`}>
                <FaFileInvoice className="text-primary-500" /> Invoice Details
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
                    onChange={handleInputChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
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
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
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
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
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
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
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
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
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
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Discount
                  </label>
                  <div className="flex gap-2">
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
                    <select
                      name="discountType"
                      value={formData.invoice.discountType}
                      onChange={handleInputChange}
                      className={`px-3 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all`}
                    >
                      <option value="percentage">%</option>
                      <option value="fixed">₹</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
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
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Late Fee
                  </label>
                  <input
                    type="number"
                    name="lateFee"
                    value={formData.invoice.lateFee}
                    onChange={handleInputChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                    min="0"
                    step="0.01"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    <input
                      type="checkbox"
                      name="taxInclusive"
                      checked={formData.invoice.taxInclusive}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Tax Inclusive Pricing
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Items Section */}
          {activeSection === 'items' && (
            <div className={`${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border} shadow-lg animate-fadeIn`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <h2 className={`text-base md:text-lg font-semibold ${theme.colors.text} flex items-center gap-2`}>
                  <FaBox className="text-primary-500" /> Items
                </h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addItem}
                    className={`px-4 py-2 rounded-xl bg-gradient-to-r ${selectedColor.gradient} text-white flex items-center gap-2 hover:scale-105 transition-all text-sm`}
                  >
                    <FaPlus /> Add Item
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="min-w-[800px] sm:min-w-full">
                  {formData.items.map((item, index) => {
                    const itemTotals = calculateItemTotal(item);
                    return (
                      <div 
                        key={index} 
                        className={`grid grid-cols-12 gap-2 p-3 mb-3 rounded-xl ${theme.colors.background} border ${theme.colors.border} transition-all ${animation ? 'scale-105' : 'scale-100'}`}
                      >
                        <div className="col-span-12 sm:col-span-3">
                          <label className={`text-xs ${theme.colors.text} opacity-70`}>Item Name</label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            className={`w-full px-2 md:px-3 py-1.5 md:py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all`}
                            placeholder="Item description *"
                          />
                          <input
                            type="text"
                            value={item.notes}
                            onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                            className={`w-full px-2 md:px-3 py-1 md:py-1.5 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs mt-1 transition-all`}
                            placeholder="Item notes"
                          />
                        </div>
                        <div className="col-span-3 sm:col-span-1">
                          <label className={`text-xs ${theme.colors.text} opacity-70`}>Qty</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                            className={`w-full px-2 md:px-3 py-1.5 md:py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-center transition-all`}
                            min="0.01"
                            step="0.01"
                          />
                        </div>
                        <div className="col-span-3 sm:col-span-1">
                          <label className={`text-xs ${theme.colors.text} opacity-70`}>Unit</label>
                          <input
                            type="text"
                            value={item.unit}
                            onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                            className={`w-full px-2 md:px-3 py-1.5 md:py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-center transition-all`}
                            placeholder="pcs"
                          />
                        </div>
                        <div className="col-span-3 sm:col-span-1">
                          <label className={`text-xs ${theme.colors.text} opacity-70`}>Rate</label>
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
                          <label className={`text-xs ${theme.colors.text} opacity-70`}>Disc%</label>
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
                          <label className={`text-xs ${theme.colors.text} opacity-70`}>Tax%</label>
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
                          <span className={`text-sm font-semibold ${theme.colors.text} bg-primary-500/10 px-3 py-1 rounded-lg`}>
                            {formatCurrency(itemTotals.total)}
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

              {/* Summary */}
              <div className="mt-4 flex flex-col sm:flex-row justify-end gap-3">
                <div className="w-full sm:w-80 space-y-2">
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
                  {totals.overallDiscount > 0 && (
                    <div className="flex justify-between py-1 text-green-600">
                      <span className="text-sm">Overall Discount:</span>
                      <span className="text-sm font-medium">-{formatCurrency(totals.overallDiscount)}</span>
                    </div>
                  )}
                  {totals.shipping > 0 && (
                    <div className="flex justify-between py-1">
                      <span className={`text-sm ${theme.colors.text} opacity-70`}>Shipping:</span>
                      <span className={`text-sm font-medium ${theme.colors.text}`}>
                        +{formatCurrency(totals.shipping)}
                      </span>
                    </div>
                  )}
                  {totals.lateFee > 0 && (
                    <div className="flex justify-between py-1 text-red-500">
                      <span className="text-sm">Late Fee:</span>
                      <span className="text-sm font-medium">+{formatCurrency(totals.lateFee)}</span>
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
                    <span className={`text-base md:text-lg font-bold`} style={{ color: selectedColor.primary }}>
                      {formatCurrency(totals.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bank Section */}
          {activeSection === 'bank' && (
            <div className={`${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border} shadow-lg animate-fadeIn`}>
              <h2 className={`text-base md:text-lg font-semibold ${theme.colors.text} mb-4 flex items-center gap-2`}>
                <BsBank2 className="text-primary-500" /> Bank Details
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                    placeholder="company@upi"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Additional Section */}
          {activeSection === 'additional' && (
            <div className={`${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border} shadow-lg animate-fadeIn`}>
              <h2 className={`text-base md:text-lg font-semibold ${theme.colors.text} mb-4 flex items-center gap-2`}>
                <FaTag className="text-primary-500" /> Additional Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.additional.notes}
                    onChange={handleAdditionalChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base resize-none transition-all`}
                    rows="3"
                    placeholder="Additional notes..."
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Terms & Conditions
                  </label>
                  <textarea
                    name="terms"
                    value={formData.additional.terms}
                    onChange={handleAdditionalChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base resize-none transition-all`}
                    rows="3"
                    placeholder="Payment terms..."
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Authorized Person
                  </label>
                  <input
                    type="text"
                    name="authorizedPerson"
                    value={formData.additional.authorizedPerson}
                    onChange={handleAdditionalChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                    placeholder="Authorized person name"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.additional.department}
                    onChange={handleAdditionalChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                    placeholder="Finance, Sales, etc."
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Project Code
                  </label>
                  <input
                    type="text"
                    name="projectCode"
                    value={formData.additional.projectCode}
                    onChange={handleAdditionalChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                    placeholder="PRJ-2024-001"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Signature
                  </label>
                  <input
                    type="text"
                    name="signature"
                    value={formData.additional.signature}
                    onChange={handleAdditionalChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                    placeholder="Signature name"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Signature Date
                  </label>
                  <input
                    type="date"
                    name="signatureDate"
                    value={formData.additional.signatureDate}
                    onChange={handleAdditionalChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Design Section */}
          {activeSection === 'design' && (
            <div className={`${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border} shadow-lg animate-fadeIn`}>
              <h2 className={`text-base md:text-lg font-semibold ${theme.colors.text} mb-4 flex items-center gap-2`}>
                <FaPalette className="text-primary-500" /> Design & Styling
              </h2>
              
              <div className="space-y-6">
                {/* Templates */}
                <div>
                  <h3 className={`text-sm font-medium ${theme.colors.text} mb-3`}>Templates</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {INVOICE_TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedTemplate === template.id
                            ? `border-primary-500 bg-gradient-to-r ${template.color} text-white shadow-lg`
                            : `${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover}`
                        }`}
                      >
                        <template.icon className="text-2xl mb-2" />
                        <p className="text-sm font-medium">{template.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Schemes */}
                <div>
                  <h3 className={`text-sm font-medium ${theme.colors.text} mb-3`}>Color Schemes</h3>
                  <div className="flex flex-wrap gap-3">
                    {COLOR_SCHEMES.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`p-2 rounded-xl border-2 transition-all ${
                          selectedColor.name === color.name
                            ? 'border-primary-500 shadow-lg scale-110'
                            : `${theme.colors.border}`
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${color.gradient}`} />
                        <p className={`text-xs mt-1 ${theme.colors.text}`}>{color.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview of selected design */}
                <div className={`p-4 rounded-xl ${theme.colors.background} border ${theme.colors.border}`}>
                  <p className={`text-sm ${theme.colors.text} opacity-70 mb-2`}>Preview</p>
                  <div className={`bg-gradient-to-r ${selectedColor.gradient} p-4 rounded-lg text-white`}>
                    <p className="text-sm opacity-90">Your invoice will look amazing with this design!</p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-white/20 rounded text-xs">Modern</span>
                      <span className="px-2 py-0.5 bg-white/20 rounded text-xs">Professional</span>
                      <span className="px-2 py-0.5 bg-white/20 rounded text-xs">Clean</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className={`flex flex-col sm:flex-row justify-end gap-3 ${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border} shadow-lg`}>
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
              className={`px-4 md:px-8 py-2.5 md:py-3 rounded-xl bg-gradient-to-r ${selectedColor.gradient} text-white flex items-center justify-center gap-2 hover:scale-105 transition-all text-sm w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FaRocket /> Create Modern Invoice
                </>
              )}
            </button>
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
          from { opacity: 0; transform: scale(0.9); }
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

export default ModernInvoiceForm;