// frontend/src/components/invoices/ProfessionalInvoiceForm.jsx
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
  FaMinus, FaCircle, FaSquare,  FaBriefcase,
  FaShieldAlt, FaAward, FaCertificate, FaMedal, FaTrophy,
  FaChartBar,  FaUsers, FaHandshake
} from 'react-icons/fa';
import { FaArrowTrendUp } from "react-icons/fa6";
import { GiPieChart } from "react-icons/gi";
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
  { name: 'CST 2%', rate: 2 },
  { name: 'IGST 18%', rate: 18 },
];

const CURRENCY_OPTIONS = [
  { value: '₹', label: 'INR (₹)', symbol: '₹' },
  { value: '$', label: 'USD ($)', symbol: '$' },
  { value: '€', label: 'EUR (€)', symbol: '€' },
  { value: '£', label: 'GBP (£)', symbol: '£' },
  { value: '¥', label: 'JPY (¥)', symbol: '¥' },
  { value: 'A$', label: 'AUD (A$)', symbol: 'A$' },
  { value: 'C$', label: 'CAD (C$)', symbol: 'C$' },
];

const PAYMENT_TERMS = [
  { value: 'due_on_receipt', label: 'Due on Receipt' },
  { value: 'net_7', label: 'Net 7 Days' },
  { value: 'net_15', label: 'Net 15 Days' },
  { value: 'net_30', label: 'Net 30 Days' },
  { value: 'net_45', label: 'Net 45 Days' },
  { value: 'net_60', label: 'Net 60 Days' },
  { value: '2_10_net_30', label: '2/10 Net 30' },
  { value: '1_15_net_45', label: '1/15 Net 45' },
];

const PROFESSIONAL_TEMPLATES = [
  { id: 'executive', name: 'Executive', icon: FaBriefcase, color: 'from-blue-600 to-indigo-700' },
  { id: 'corporate', name: 'Corporate', icon: FaBuilding, color: 'from-gray-700 to-gray-900' },
  { id: 'premium', name: 'Premium', icon: FaAward, color: 'from-amber-600 to-amber-800' },
  { id: 'modern_pro', name: 'Modern Pro', icon: FaRocket, color: 'from-purple-600 to-pink-600' },
  { id: 'classic', name: 'Classic', icon: FaCertificate, color: 'from-emerald-600 to-teal-700' },
  { id: 'elegant', name: 'Elegant', icon: FaStar, color: 'from-rose-600 to-red-700' },
];

const PROFESSIONAL_COLORS = [
  { name: 'Navy', primary: '#1A237E', secondary: '#0D47A1', accent: '#42A5F5' },
  { name: 'Forest', primary: '#1B5E20', secondary: '#2E7D32', accent: '#66BB6A' },
  { name: 'Burgundy', primary: '#880E4F', secondary: '#AD1457', accent: '#EC407A' },
  { name: 'Steel', primary: '#37474F', secondary: '#455A64', accent: '#78909C' },
  { name: 'Royal', primary: '#4A148C', secondary: '#6A1B9A', accent: '#AB47BC' },
  { name: 'Teal', primary: '#004D40', secondary: '#00695C', accent: '#26A69A' },
  { name: 'Crimson', primary: '#B71C1C', secondary: '#C62828', accent: '#EF5350' },
  { name: 'Gold', primary: '#BF360C', secondary: '#E65100', accent: '#FFA726' },
];

const INVOICE_TYPES = [
  { value: 'standard', label: 'Standard Invoice' },
  { value: 'proforma', label: 'Proforma Invoice' },
  { value: 'credit_note', label: 'Credit Note' },
  { value: 'debit_note', label: 'Debit Note' },
  { value: 'recurring', label: 'Recurring Invoice' },
];

const DISCOUNT_TYPES = [
  { value: 'percentage', label: 'Percentage (%)' },
  { value: 'fixed', label: 'Fixed Amount (₹)' },
];

const ProfessionalInvoiceForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useSelector((state) => state.auth);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState('company');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(PROFESSIONAL_TEMPLATES[0]);
  const [selectedColor, setSelectedColor] = useState(PROFESSIONAL_COLORS[0]);
  const [logoPreview, setLogoPreview] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const fileInputRef = useRef(null);
  const signatureInputRef = useRef(null);
  const [invoiceType, setInvoiceType] = useState('standard');

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
      registrationNumber: '',
      taxId: '',
      businessType: 'private_limited',
      industry: '',
      establishedYear: new Date().getFullYear(),
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
      type: 'business',
      contactPerson: '',
      designation: '',
      clientId: '',
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
      showPaymentDetails: true,
      showBankDetails: true,
      showSignature: true,
      showTerms: true,
      invoiceType: 'standard',
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
        category: '',
        taxCategory: 'standard',
      }
    ],
    // Bank Details
    bank: {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      branch: '',
      upiId: '',
      swiftCode: '',
      iban: '',
      beneficiaryName: '',
    },
    // Additional
    additional: {
      notes: '',
      terms: 'Payment due within 30 days. Late payment may incur additional charges.',
      signature: '',
      signatureDate: new Date().toISOString().split('T')[0],
      authorizedPerson: '',
      department: '',
      projectCode: '',
      reference: '',
      additionalNotes: '',
      customField1: '',
      customField2: '',
      customField3: '',
    },
    // Footer
    footer: {
      message: 'Thank you for your business!',
      disclaimer: 'This is a system generated invoice.',
      website: '',
      socialLinks: {
        linkedin: '',
        twitter: '',
        facebook: '',
        instagram: '',
      },
    },
  });

  // Auto-generate invoice number
  const generateInvoiceNumber = useCallback(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    return `${invoiceType === 'credit_note' ? 'CN' : invoiceType === 'debit_note' ? 'DN' : 'INV'}-${year}${month}${day}-${random}`;
  }, [invoiceType]);

  // Update invoice number when type changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      invoice: {
        ...prev.invoice,
        number: generateInvoiceNumber(),
        invoiceType: invoiceType,
      }
    }));
  }, [invoiceType, generateInvoiceNumber]);

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

  // Handle signature upload
  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          additional: { ...prev.additional, signature: reader.result }
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

  // Footer handler
  const handleFooterChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      footer: { ...prev.footer, [name]: value }
    }));
  };

  // Social links handler
  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        socialLinks: { ...prev.footer.socialLinks, [name]: value }
      }
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
        category: '',
        taxCategory: 'standard',
      }]
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
        invoiceType: invoiceType,
        totals: totals,
        createdAt: new Date().toISOString(),
      };

      await dispatch(createInvoice(invoiceData)).unwrap();
      toast.success('🏢 Professional invoice created successfully!');
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
      company: {
        ...prev.company,
        name: 'Global Tech Solutions Pvt Ltd',
        address: '789 Corporate Tower, Business District, Mumbai - 400001',
        phone: '+91 22 1234 5678',
        email: 'finance@globaltech.com',
        website: 'www.globaltech.com',
        gst: '22AAAAA0000A1Z5',
        pan: 'AAAAA0000A',
        cin: 'U12345MH2024XXX1234',
        registrationNumber: 'REG-2024-001',
        taxId: 'TAX-2024-001',
        businessType: 'private_limited',
        industry: 'Information Technology',
        establishedYear: 2010,
      },
      client: {
        name: 'ABC Enterprises Ltd',
        email: 'accounts@abcenterprises.com',
        phone: '+91 33 9876 5432',
        address: '456 Business Park, Salt Lake, Kolkata - 700091',
        gst: '33BBBBB0000B1Z5',
        pan: 'BBBBB0000B',
        state: 'West Bengal',
        country: 'India',
        pincode: '700091',
        type: 'business',
        contactPerson: 'Mr. Rajesh Kumar',
        designation: 'Finance Manager',
        clientId: 'CL-2024-001',
      },
      items: [
        { description: 'Enterprise Software Development', quantity: 2, rate: 2500, taxRate: 18, discount: 5, unit: 'months', hsCode: '9983', notes: 'Full stack development', category: 'Software', taxCategory: 'standard' },
        { description: 'Cloud Infrastructure Setup', quantity: 1, rate: 5000, taxRate: 18, discount: 0, unit: 'project', hsCode: '9984', notes: 'AWS + Azure', category: 'Cloud', taxCategory: 'standard' },
        { description: 'IT Consulting Services', quantity: 40, rate: 150, taxRate: 18, discount: 0, unit: 'hours', hsCode: '9985', notes: 'Strategic consulting', category: 'Consulting', taxCategory: 'standard' },
        { description: 'Training & Support', quantity: 20, rate: 200, taxRate: 18, discount: 10, unit: 'hours', hsCode: '9986', notes: 'Team training', category: 'Training', taxCategory: 'standard' },
      ],
      bank: {
        bankName: 'HDFC Bank',
        accountNumber: '12345678901234',
        ifscCode: 'HDFC0001234',
        branch: 'Corporate Branch, Mumbai',
        upiId: 'globaltech@hdfc',
        swiftCode: 'HDFCINBB',
        iban: 'IN33HDFC00012345678901234',
        beneficiaryName: 'Global Tech Solutions Pvt Ltd',
      },
      additional: {
        notes: 'Please process payment at the earliest. For any queries, contact accounts@globaltech.com',
        terms: 'Payment due within 30 days. Late payment may incur additional charges. All prices are in INR.',
        signature: 'John Doe',
        signatureDate: new Date().toISOString().split('T')[0],
        authorizedPerson: 'John Doe - CEO',
        department: 'Finance',
        projectCode: 'PRJ-2024-001',
        reference: 'REF-2024-001',
        additionalNotes: 'This is a professional invoice for services rendered.',
        customField1: 'GST: 22AAAAA0000A1Z5',
        customField2: 'PAN: AAAAA0000A',
        customField3: 'CIN: U12345MH2024XXX1234',
      },
      footer: {
        message: 'Thank you for choosing Global Tech Solutions!',
        disclaimer: 'This is a computer generated invoice.',
        website: 'www.globaltech.com',
        socialLinks: {
          linkedin: 'https://linkedin.com/company/globaltech',
          twitter: 'https://twitter.com/globaltech',
          facebook: 'https://facebook.com/globaltech',
          instagram: 'https://instagram.com/globaltech',
        },
      },
    }));
    toast.success('Professional sample data loaded! 🏢');
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
    { id: 'footer', label: 'Footer', icon: FaCertificate },
  ];

  // Preview Modal
  const PreviewModal = () => {
    if (!showPreview) return null;

    const color = selectedColor;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto ${theme.colors.card} rounded-2xl shadow-2xl p-6 animate-scaleIn`}>
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-inherit z-10 pb-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className={`text-2xl font-bold ${theme.colors.text} flex items-center gap-2`}>
              <FaEye className="text-primary-500" /> Invoice Preview
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className={`px-4 py-2 rounded-xl`}
                style={{ backgroundColor: color.primary, color: 'white' }}
              >
                <FaPrint className="inline mr-2" /> Print
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className={`px-4 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-all`}
              >
                Close
              </button>
            </div>
          </div>

          {/* Professional Preview Content */}
          <div className="space-y-6" style={{ color: theme.colors.text }}>
            {/* Header with Color Accent */}
            <div className="flex justify-between items-start pb-4 border-b-4" style={{ borderColor: color.primary }}>
              <div>
                {logoPreview && (
                  <img src={logoPreview} alt="Logo" className="h-16 w-auto object-contain mb-2" />
                )}
                <h1 className="text-3xl font-bold" style={{ color: color.primary }}>
                  {formData.company.name || 'Your Company'}
                </h1>
                <p className="text-sm opacity-70">{formData.company.address}</p>
                <p className="text-sm opacity-70">{formData.company.phone} | {formData.company.email}</p>
                <div className="flex gap-3 mt-1 text-xs">
                  {formData.company.gst && <span className="opacity-60">GST: {formData.company.gst}</span>}
                  {formData.company.pan && <span className="opacity-60">PAN: {formData.company.pan}</span>}
                  {formData.company.cin && <span className="opacity-60">CIN: {formData.company.cin}</span>}
                </div>
              </div>
              <div className="text-right">
                <div className="p-3 rounded-lg" style={{ backgroundColor: color.primary + '15' }}>
                  <p className="text-sm opacity-60">INVOICE</p>
                  <p className="text-2xl font-bold" style={{ color: color.primary }}>
                    {formData.invoice.number}
                  </p>
                  <p className="text-xs opacity-60 mt-1">{formData.invoice.invoiceType?.toUpperCase() || 'STANDARD'}</p>
                </div>
              </div>
            </div>

            {/* Invoice Type Badge */}
            {invoiceType !== 'standard' && (
              <div className="text-center py-2 rounded-lg" style={{ backgroundColor: color.primary + '10' }}>
                <span className="text-sm font-semibold" style={{ color: color.primary }}>
                  {INVOICE_TYPES.find(t => t.value === invoiceType)?.label.toUpperCase() || 'STANDARD'}
                </span>
              </div>
            )}

            {/* Client & Invoice Info */}
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                <p className="text-xs uppercase tracking-wider opacity-60 mb-2">Bill To</p>
                <p className="text-lg font-semibold">{formData.client.name}</p>
                <p className="text-sm opacity-70">{formData.client.address}</p>
                <p className="text-sm opacity-70">{formData.client.email}</p>
                <p className="text-sm opacity-70">{formData.client.phone}</p>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {formData.client.gst && (
                    <span className="px-2 py-0.5 text-xs rounded" style={{ backgroundColor: color.primary + '15', color: color.primary }}>
                      GST: {formData.client.gst}
                    </span>
                  )}
                  {formData.client.pan && (
                    <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-600">
                      PAN: {formData.client.pan}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                <p className="text-xs uppercase tracking-wider opacity-60 mb-2">Invoice Details</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="opacity-60">Issue Date:</span>
                  <span className="font-medium">{new Date(formData.invoice.issueDate).toLocaleDateString()}</span>
                  <span className="opacity-60">Due Date:</span>
                  <span className="font-medium">{new Date(formData.invoice.dueDate).toLocaleDateString()}</span>
                  <span className="opacity-60">Payment Terms:</span>
                  <span className="font-medium">{PAYMENT_TERMS.find(t => t.value === formData.invoice.paymentTerms)?.label || 'Net 30'}</span>
                  <span className="opacity-60">PO Number:</span>
                  <span className="font-medium">{formData.invoice.poNumber || 'N/A'}</span>
                  <span className="opacity-60">Currency:</span>
                  <span className="font-medium">{formData.invoice.currency}</span>
                </div>
              </div>
            </div>

            {/* Items Table - Professional Layout */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ backgroundColor: color.primary, color: 'white' }}>
                    <th className="text-left py-3 px-4 rounded-tl-lg">#</th>
                    <th className="text-left py-3 px-4">Description</th>
                    <th className="text-left py-3 px-4">HSN/SAC</th>
                    <th className="text-right py-3 px-4">Qty</th>
                    <th className="text-right py-3 px-4">Rate</th>
                    <th className="text-right py-3 px-4">Disc.</th>
                    <th className="text-right py-3 px-4">Tax</th>
                    <th className="text-right py-3 px-4 rounded-tr-lg">Total</th>
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
                          {item.category && <div className="text-xs opacity-40">{item.category}</div>}
                        </td>
                        <td className="py-3 px-4 text-sm">{item.hsCode || '-'}</td>
                        <td className="text-right py-3 px-4">{item.quantity} {item.unit}</td>
                        <td className="text-right py-3 px-4">{formatCurrency(item.rate)}</td>
                        <td className="text-right py-3 px-4">{item.discount > 0 ? `${item.discount}%` : '-'}</td>
                        <td className="text-right py-3 px-4">{item.taxRate > 0 ? `${item.taxRate}%` : '-'}</td>
                        <td className="text-right py-3 px-4 font-semibold">
                          {formatCurrency(itemTotal.total)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="7" className="text-right py-2 px-4 font-medium">Subtotal:</td>
                    <td className="text-right py-2 px-4">{formatCurrency(totals.subtotal)}</td>
                  </tr>
                  {totals.totalDiscount > 0 && (
                    <tr>
                      <td colSpan="7" className="text-right py-2 px-4 text-green-600">Item Discount:</td>
                      <td className="text-right py-2 px-4 text-green-600">-{formatCurrency(totals.totalDiscount)}</td>
                    </tr>
                  )}
                  {totals.overallDiscount > 0 && (
                    <tr>
                      <td colSpan="7" className="text-right py-2 px-4 text-green-600">Overall Discount:</td>
                      <td className="text-right py-2 px-4 text-green-600">-{formatCurrency(totals.overallDiscount)}</td>
                    </tr>
                  )}
                  {totals.shipping > 0 && (
                    <tr>
                      <td colSpan="7" className="text-right py-2 px-4">Shipping:</td>
                      <td className="text-right py-2 px-4">{formatCurrency(totals.shipping)}</td>
                    </tr>
                  )}
                  {totals.lateFee > 0 && (
                    <tr>
                      <td colSpan="7" className="text-right py-2 px-4 text-red-500">Late Fee:</td>
                      <td className="text-right py-2 px-4 text-red-500">{formatCurrency(totals.lateFee)}</td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan="7" className="text-right py-2 px-4">Tax:</td>
                    <td className="text-right py-2 px-4">{formatCurrency(totals.totalTax)}</td>
                  </tr>
                  <tr className="border-t-2" style={{ borderColor: color.primary }}>
                    <td colSpan="7" className="text-right py-3 px-4 text-lg font-bold">Total:</td>
                    <td className="text-right py-3 px-4 text-lg font-bold" style={{ color: color.primary }}>
                      {formatCurrency(totals.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Amount in Words */}
            <div className="p-3 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
              <p className="text-sm opacity-60">Amount in Words:</p>
              <p className="font-medium">Rupees {formatCurrency(totals.total)} Only</p>
            </div>

            {/* Bank Details */}
            {formData.bank.bankName && (
              <div className="p-4 rounded-lg border" style={{ borderColor: color.primary + '30' }}>
                <p className="text-xs uppercase tracking-wider opacity-60 mb-2">Bank Details</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  <p><span className="opacity-60">Bank:</span> {formData.bank.bankName}</p>
                  <p><span className="opacity-60">Account:</span> {formData.bank.accountNumber}</p>
                  <p><span className="opacity-60">IFSC:</span> {formData.bank.ifscCode}</p>
                  <p><span className="opacity-60">Branch:</span> {formData.bank.branch}</p>
                  {formData.bank.upiId && <p><span className="opacity-60">UPI:</span> {formData.bank.upiId}</p>}
                  {formData.bank.swiftCode && <p><span className="opacity-60">SWIFT:</span> {formData.bank.swiftCode}</p>}
                </div>
              </div>
            )}

            {/* Notes & Terms */}
            {(formData.additional.notes || formData.additional.terms) && (
              <div className="grid grid-cols-2 gap-4">
                {formData.additional.notes && (
                  <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                    <p className="text-xs uppercase tracking-wider opacity-60 mb-1">📝 Notes</p>
                    <p className="text-sm opacity-80">{formData.additional.notes}</p>
                  </div>
                )}
                {formData.additional.terms && (
                  <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                    <p className="text-xs uppercase tracking-wider opacity-60 mb-1">📋 Terms</p>
                    <p className="text-sm opacity-80">{formData.additional.terms}</p>
                  </div>
                )}
              </div>
            )}

            {/* Signature */}
            {formData.additional.signature && (
              <div className="flex justify-end">
                <div className="text-center">
                  <p className="text-xs uppercase tracking-wider opacity-60">Authorized Signature</p>
                  {signaturePreview ? (
                    <img src={signaturePreview} alt="Signature" className="h-12 object-contain mx-auto" />
                  ) : (
                    <div className="border-t-2 border-gray-300 w-48 mt-1 pt-1">
                      <p className="font-medium">{formData.additional.signature}</p>
                    </div>
                  )}
                  <p className="text-xs opacity-60">{formData.additional.authorizedPerson}</p>
                  <p className="text-xs opacity-60">
                    {formData.additional.signatureDate ? new Date(formData.additional.signatureDate).toLocaleDateString() : ''}
                  </p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="pt-4 border-t text-center space-y-1">
              <p className="text-sm opacity-70">{formData.footer.message}</p>
              <p className="text-xs opacity-50">{formData.footer.disclaimer}</p>
              {formData.footer.website && (
                <p className="text-xs opacity-50">{formData.footer.website}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${theme.colors.background} p-3 md:p-6`}>
      <div className="max-w-7xl mx-auto">
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
                <FaBriefcase className="text-primary-500" /> Professional Invoice
              </h1>
              <p className={`text-sm ${theme.colors.text} opacity-70`}>
                Create polished, corporate-grade invoices for your business
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
              className={`px-4 py-2 rounded-xl text-white flex items-center gap-2 hover:scale-105 transition-all text-sm`}
              style={{ backgroundColor: selectedColor.primary }}
            >
              <FaEye /> Preview
            </button>
          </div>
        </div>

        {/* Invoice Type Selector */}
        <div className={`flex flex-wrap gap-2 mb-4 ${theme.colors.card} p-3 rounded-xl border ${theme.colors.border}`}>
          <span className={`text-sm font-medium ${theme.colors.text} opacity-70 flex items-center mr-2`}>
            <FaFileInvoice className="mr-1" /> Type:
          </span>
          {INVOICE_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setInvoiceType(type.value)}
              className={`px-4 py-1.5 rounded-lg text-sm transition-all ${
                invoiceType === type.value
                  ? 'text-white'
                  : `${theme.colors.text} hover:${theme.colors.hover}`
              }`}
              style={invoiceType === type.value ? { backgroundColor: selectedColor.primary } : {}}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Quick Navigation */}
        <div className={`flex flex-wrap gap-1 mb-4 ${theme.colors.card} p-2 rounded-xl border ${theme.colors.border}`}>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all text-sm ${
                activeSection === section.id
                  ? 'text-white shadow-lg'
                  : `${theme.colors.text} hover:${theme.colors.hover}`
              }`}
              style={activeSection === section.id ? { backgroundColor: selectedColor.primary } : {}}
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
              <h2 className={`text-base md:text-lg font-bold ${theme.colors.text} mb-4 flex items-center gap-2`}>
                <FaBuilding className="text-primary-500" /> Company Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                <div className="lg:col-span-3">
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Logo
                  </label>
                  <div className="flex items-center gap-4">
                    {logoPreview && (
                      <img src={logoPreview} alt="Logo" className="h-16 w-16 object-contain rounded-lg border-2 p-1" style={{ borderColor: selectedColor.primary }} />
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="Your company name"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Business Type
                  </label>
                  <select
                    name="businessType"
                    value={formData.company.businessType}
                    onChange={handleCompanyChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                  >
                    <option value="private_limited">Private Limited</option>
                    <option value="public_limited">Public Limited</option>
                    <option value="llp">LLP</option>
                    <option value="proprietorship">Proprietorship</option>
                    <option value="partnership">Partnership</option>
                    <option value="trust">Trust</option>
                    <option value="ngo">NGO</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Industry
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.company.industry}
                    onChange={handleCompanyChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="Information Technology"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Established Year
                  </label>
                  <input
                    type="number"
                    name="establishedYear"
                    value={formData.company.establishedYear}
                    onChange={handleCompanyChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Registration Number
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.company.registrationNumber}
                    onChange={handleCompanyChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="REG-2024-001"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Tax ID
                  </label>
                  <input
                    type="text"
                    name="taxId"
                    value={formData.company.taxId}
                    onChange={handleCompanyChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="TAX-2024-001"
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="U12345XX2024XXX1234"
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="company@example.com"
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="https://yourcompany.com"
                  />
                </div>
                <div className="lg:col-span-3">
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.company.address}
                    onChange={handleCompanyChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base resize-none`}
                    style={{ focusRing: selectedColor.primary }}
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
              <h2 className={`text-base md:text-lg font-bold ${theme.colors.text} mb-4 flex items-center gap-2`}>
                <FaUserCircle className="text-primary-500" /> Client Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Client Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.client.name}
                    onChange={handleClientChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="Enter client name"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Client ID
                  </label>
                  <input
                    type="text"
                    name="clientId"
                    value={formData.client.clientId}
                    onChange={handleClientChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="CL-2024-001"
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                  >
                    <option value="individual">Individual</option>
                    <option value="business">Business</option>
                    <option value="government">Government</option>
                    <option value="non_profit">Non-Profit</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Contact Person
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.client.contactPerson}
                    onChange={handleClientChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="Contact person name"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.client.designation}
                    onChange={handleClientChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="Finance Manager"
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="AAAAA0000A"
                  />
                </div>
                <div className="lg:col-span-3">
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.client.address}
                    onChange={handleClientChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base resize-none`}
                    style={{ focusRing: selectedColor.primary }}
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
              <h2 className={`text-base md:text-lg font-bold ${theme.colors.text} mb-4 flex items-center gap-2`}>
                <FaFileInvoice className="text-primary-500" /> Invoice Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    name="number"
                    value={formData.invoice.number}
                    onChange={handleInputChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
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
                    Payment Terms
                  </label>
                  <select
                    name="paymentTerms"
                    value={formData.invoice.paymentTerms}
                    onChange={handleInputChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
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
                    Issue Date
                  </label>
                  <input
                    type="date"
                    name="issueDate"
                    value={formData.invoice.issueDate}
                    onChange={handleInputChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
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
                    onChange={handleInputChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="PO-2024-001"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    <div className="flex items-center gap-2">
                      <FaPercent /> Discount
                    </div>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="discount"
                      value={formData.invoice.discount}
                      onChange={handleInputChange}
                      className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                      style={{ focusRing: selectedColor.primary }}
                      min="0"
                      step="0.01"
                      placeholder="0"
                    />
                    <select
                      name="discountType"
                      value={formData.invoice.discountType}
                      onChange={handleInputChange}
                      className={`px-3 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm`}
                      style={{ focusRing: selectedColor.primary }}
                    >
                      {DISCOUNT_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    <FaTruck className="inline mr-1" /> Shipping Charges
                  </label>
                  <input
                    type="number"
                    name="shipping"
                    value={formData.invoice.shipping}
                    onChange={handleInputChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    min="0"
                    step="0.01"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    <FaClock className="inline mr-1" /> Late Fee
                  </label>
                  <input
                    type="number"
                    name="lateFee"
                    value={formData.invoice.lateFee}
                    onChange={handleInputChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
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
                      style={{ accentColor: selectedColor.primary }}
                    />
                    Tax Inclusive Pricing
                  </label>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    <input
                      type="checkbox"
                      name="showTaxBreakdown"
                      checked={formData.invoice.showTaxBreakdown}
                      onChange={handleInputChange}
                      className="mr-2"
                      style={{ accentColor: selectedColor.primary }}
                    />
                    Show Tax Breakdown
                  </label>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    <input
                      type="checkbox"
                      name="showBankDetails"
                      checked={formData.invoice.showBankDetails}
                      onChange={handleInputChange}
                      className="mr-2"
                      style={{ accentColor: selectedColor.primary }}
                    />
                    Show Bank Details
                  </label>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    <input
                      type="checkbox"
                      name="showSignature"
                      checked={formData.invoice.showSignature}
                      onChange={handleInputChange}
                      className="mr-2"
                      style={{ accentColor: selectedColor.primary }}
                    />
                    Show Signature
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Items Section */}
          {activeSection === 'items' && (
            <div className={`${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border} shadow-lg animate-fadeIn`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <h2 className={`text-base md:text-lg font-bold ${theme.colors.text} flex items-center gap-2`}>
                  <FaBox className="text-primary-500" /> Items
                </h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addItem}
                    className={`px-4 py-2 rounded-xl text-white flex items-center gap-2 hover:scale-105 transition-all text-sm`}
                    style={{ backgroundColor: selectedColor.primary }}
                  >
                    <FaPlus /> Add Item
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="min-w-[900px] sm:min-w-full">
                  {formData.items.map((item, index) => {
                    const itemTotal = calculateItemTotal(item);
                    return (
                      <div 
                        key={index} 
                        className={`grid grid-cols-12 gap-2 p-3 mb-3 rounded-xl ${theme.colors.background} border ${theme.colors.border} transition-all`}
                      >
                        <div className="col-span-12 sm:col-span-3">
                          <label className={`text-xs ${theme.colors.text} opacity-70`}>Item Name</label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            className={`w-full px-2 md:px-3 py-1.5 md:py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm`}
                            style={{ focusRing: selectedColor.primary }}
                            placeholder="Item description *"
                          />
                          <input
                            type="text"
                            value={item.notes}
                            onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                            className={`w-full px-2 md:px-3 py-1 md:py-1.5 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-xs mt-1`}
                            style={{ focusRing: selectedColor.primary }}
                            placeholder="Item notes"
                          />
                        </div>
                        <div className="col-span-3 sm:col-span-1">
                          <label className={`text-xs ${theme.colors.text} opacity-70`}>Qty</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                            className={`w-full px-2 md:px-3 py-1.5 md:py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm text-center`}
                            style={{ focusRing: selectedColor.primary }}
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
                            className={`w-full px-2 md:px-3 py-1.5 md:py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm text-center`}
                            style={{ focusRing: selectedColor.primary }}
                            placeholder="pcs"
                          />
                        </div>
                        <div className="col-span-3 sm:col-span-1">
                          <label className={`text-xs ${theme.colors.text} opacity-70`}>Rate</label>
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                            className={`w-full px-2 md:px-3 py-1.5 md:py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm text-center`}
                            style={{ focusRing: selectedColor.primary }}
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label className={`text-xs ${theme.colors.text} opacity-70`}>HSN/SAC</label>
                          <input
                            type="text"
                            value={item.hsCode}
                            onChange={(e) => handleItemChange(index, 'hsCode', e.target.value)}
                            className={`w-full px-1 md:px-2 py-1.5 md:py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm text-center`}
                            style={{ focusRing: selectedColor.primary }}
                            placeholder="9983"
                          />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label className={`text-xs ${theme.colors.text} opacity-70`}>Disc%</label>
                          <input
                            type="number"
                            value={item.discount}
                            onChange={(e) => handleItemChange(index, 'discount', parseFloat(e.target.value) || 0)}
                            className={`w-full px-1 md:px-2 py-1.5 md:py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm text-center`}
                            style={{ focusRing: selectedColor.primary }}
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
                            className={`w-full px-1 md:px-2 py-1.5 md:py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm`}
                            style={{ focusRing: selectedColor.primary }}
                          >
                            {TAX_OPTIONS.map((tax, i) => (
                              <option key={i} value={tax.rate}>{tax.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-6 sm:col-span-1 flex items-center justify-end">
                          <span className={`text-sm font-semibold ${theme.colors.text} px-3 py-1 rounded-lg`} style={{ backgroundColor: selectedColor.primary + '15', color: selectedColor.primary }}>
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
                    <span className={`text-sm font-medium`} style={{ color: selectedColor.primary }}>
                      +{formatCurrency(totals.totalTax)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-t-2" style={{ borderColor: selectedColor.primary + '50' }}>
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
              <h2 className={`text-base md:text-lg font-bold ${theme.colors.text} mb-4 flex items-center gap-2`}>
                <FaBank className="text-primary-500" /> Bank Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bank.bankName}
                    onChange={handleBankChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="HDFC Bank"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Beneficiary Name
                  </label>
                  <input
                    type="text"
                    name="beneficiaryName"
                    value={formData.bank.beneficiaryName}
                    onChange={handleBankChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="Beneficiary name"
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="Mumbai Main"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    SWIFT Code
                  </label>
                  <input
                    type="text"
                    name="swiftCode"
                    value={formData.bank.swiftCode}
                    onChange={handleBankChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="HDFCINBB"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    IBAN
                  </label>
                  <input
                    type="text"
                    name="iban"
                    value={formData.bank.iban}
                    onChange={handleBankChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="IN33HDFC00012345678901234"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    UPI ID
                  </label>
                  <input
                    type="text"
                    name="upiId"
                    value={formData.bank.upiId}
                    onChange={handleBankChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="company@upi"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Additional Section */}
          {activeSection === 'additional' && (
            <div className={`${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border} shadow-lg animate-fadeIn`}>
              <h2 className={`text-base md:text-lg font-bold ${theme.colors.text} mb-4 flex items-center gap-2`}>
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base resize-none`}
                    style={{ focusRing: selectedColor.primary }}
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base resize-none`}
                    style={{ focusRing: selectedColor.primary }}
                    rows="3"
                    placeholder="Payment terms..."
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Reference Number
                  </label>
                  <input
                    type="text"
                    name="reference"
                    value={formData.additional.reference}
                    onChange={handleAdditionalChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="REF-2024-001"
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="PRJ-2024-001"
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="Finance"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Additional Notes
                  </label>
                  <input
                    type="text"
                    name="additionalNotes"
                    value={formData.additional.additionalNotes}
                    onChange={handleAdditionalChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="Any additional information..."
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Custom Field 1
                  </label>
                  <input
                    type="text"
                    name="customField1"
                    value={formData.additional.customField1}
                    onChange={handleAdditionalChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="Custom field"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Custom Field 2
                  </label>
                  <input
                    type="text"
                    name="customField2"
                    value={formData.additional.customField2}
                    onChange={handleAdditionalChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="Custom field"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Custom Field 3
                  </label>
                  <input
                    type="text"
                    name="customField3"
                    value={formData.additional.customField3}
                    onChange={handleAdditionalChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="Custom field"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Signature
                  </label>
                  <div className="flex items-center gap-4 flex-wrap">
                    <input
                      type="text"
                      name="signature"
                      value={formData.additional.signature}
                      onChange={handleAdditionalChange}
                      className={`flex-1 px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                      style={{ focusRing: selectedColor.primary }}
                      placeholder="Signature name"
                    />
                    <button
                      type="button"
                      onClick={() => signatureInputRef.current?.click()}
                      className={`px-4 py-2 rounded-xl border-2 border-dashed ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-colors text-sm flex items-center gap-2`}
                    >
                      <FaUpload /> Upload Signature
                    </button>
                    <input
                      ref={signatureInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleSignatureUpload}
                      className="hidden"
                    />
                    {signaturePreview && (
                      <img src={signaturePreview} alt="Signature" className="h-10 object-contain" />
                    )}
                  </div>
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="Authorized person name & designation"
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
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Design Section */}
          {activeSection === 'design' && (
            <div className={`${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border} shadow-lg animate-fadeIn`}>
              <h2 className={`text-base md:text-lg font-bold ${theme.colors.text} mb-4 flex items-center gap-2`}>
                <FaPalette className="text-primary-500" /> Design & Styling
              </h2>
              
              <div className="space-y-6">
                {/* Templates */}
                <div>
                  <h3 className={`text-sm font-medium ${theme.colors.text} mb-3`}>Professional Templates</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {PROFESSIONAL_TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedTemplate.id === template.id
                            ? `border-primary-500 shadow-lg scale-105`
                            : `${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover}`
                        }`}
                      >
                        <div className={`w-full h-12 rounded-lg bg-gradient-to-r ${template.color} flex items-center justify-center text-white text-2xl mb-2`}>
                          <template.icon />
                        </div>
                        <p className="text-sm font-medium text-center">{template.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Schemes */}
                <div>
                  <h3 className={`text-sm font-medium ${theme.colors.text} mb-3`}>Color Schemes</h3>
                  <div className="flex flex-wrap gap-3">
                    {PROFESSIONAL_COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`p-2 rounded-xl border-2 transition-all ${
                          selectedColor.name === color.name
                            ? 'border-primary-500 shadow-lg scale-110'
                            : `${theme.colors.border}`
                        }`}
                      >
                        <div className="flex gap-1">
                          <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: color.primary }} />
                          <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: color.secondary }} />
                          <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: color.accent }} />
                        </div>
                        <p className={`text-xs mt-1 ${theme.colors.text}`}>{color.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className={`p-4 rounded-xl ${theme.colors.background} border ${theme.colors.border}`}>
                  <p className={`text-sm ${theme.colors.text} opacity-70 mb-2`}>Design Preview</p>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: selectedColor.primary + '10', borderColor: selectedColor.primary + '30', border: '1px solid' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl" style={{ backgroundColor: selectedColor.primary }}>
                        <FaBriefcase />
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: selectedColor.primary }}>
                          {selectedTemplate.name} Template
                        </p>
                        <p className="text-sm opacity-70">Using {selectedColor.name} color scheme</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <span className="px-2 py-0.5 text-xs rounded" style={{ backgroundColor: selectedColor.primary, color: 'white' }}>
                        Professional
                      </span>
                      <span className="px-2 py-0.5 text-xs rounded" style={{ backgroundColor: selectedColor.secondary, color: 'white' }}>
                        Corporate
                      </span>
                      <span className="px-2 py-0.5 text-xs rounded" style={{ backgroundColor: selectedColor.accent, color: 'white' }}>
                        Trustworthy
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Section */}
          {activeSection === 'footer' && (
            <div className={`${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border} shadow-lg animate-fadeIn`}>
              <h2 className={`text-base md:text-lg font-bold ${theme.colors.text} mb-4 flex items-center gap-2`}>
                <FaCertificate className="text-primary-500" /> Footer & Social
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Footer Message
                  </label>
                  <input
                    type="text"
                    name="message"
                    value={formData.footer.message}
                    onChange={handleFooterChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="Thank you for your business!"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Disclaimer
                  </label>
                  <input
                    type="text"
                    name="disclaimer"
                    value={formData.footer.disclaimer}
                    onChange={handleFooterChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="System generated invoice"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Website
                  </label>
                  <input
                    type="text"
                    name="website"
                    value={formData.footer.website}
                    onChange={handleFooterChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="www.yourcompany.com"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.footer.socialLinks.linkedin}
                    onChange={handleSocialChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="https://linkedin.com/company/..."
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Twitter
                  </label>
                  <input
                    type="url"
                    name="twitter"
                    value={formData.footer.socialLinks.twitter}
                    onChange={handleSocialChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Facebook
                  </label>
                  <input
                    type="url"
                    name="facebook"
                    value={formData.footer.socialLinks.facebook}
                    onChange={handleSocialChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Instagram
                  </label>
                  <input
                    type="url"
                    name="instagram"
                    value={formData.footer.socialLinks.instagram}
                    onChange={handleSocialChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 transition-all text-sm md:text-base`}
                    style={{ focusRing: selectedColor.primary }}
                    placeholder="https://instagram.com/..."
                  />
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
              className={`px-4 md:px-8 py-2.5 md:py-3 rounded-xl text-white flex items-center justify-center gap-2 hover:scale-105 transition-all text-sm w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
              style={{ backgroundColor: selectedColor.primary }}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FaSave /> Create Professional Invoice
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

export default ProfessionalInvoiceForm;