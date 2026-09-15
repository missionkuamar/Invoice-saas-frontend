import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { 
  FaPalette, 
  FaEye, 
  FaSpinner,
  FaFileInvoice,
  FaBuilding,
  FaSave,
} from 'react-icons/fa';
import { createInvoice } from '../../store/slices/invoiceSlice';
import InvoiceTemplateSelector from './InvoiceTemplateSelector';
import TemplatePreview from './TemplatePreview';
import InvoiceItems from './InvoiceItems';
import InvoiceSummary from './InvoiceSummary';
import api, { companyAPI } from '../../services/api';
import toast from 'react-hot-toast';

const InvoiceForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      items: [{ 
        description: '', 
        quantity: 1, 
        rate: 0, 
        taxRate: 18,
        discount: 0,
      }],
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      template: null,
      discount: 0,
      shipping: 0,
      client: {
        name: '',
        email: '',
        phone: '',
        address: '',
        gst: '',
      },
    },
  });

  const watchedItems = watch('items') || [];
  const discount = Number(watch('discount')) || 0;
  const shipping = Number(watch('shipping')) || 0;

  // Calculate totals with per-item tax
  const calculateTotals = () => {
    let subtotal = 0;
    let totalTax = 0;
    
    watchedItems.forEach(item => {
      const qty = Number(item?.quantity) || 0;
      const rate = Number(item?.rate) || 0;
      const taxRate = Number(item?.taxRate) || 0;
      const disc = Number(item?.discount) || 0;
      
      const amount = qty * rate;
      const discountAmount = (amount * disc) / 100;
      const taxableAmount = amount - discountAmount;
      const tax = (taxableAmount * taxRate) / 100;
      
      subtotal += amount;
      totalTax += tax;
    });
    
    const total = subtotal + totalTax + shipping - discount;
    return { subtotal, totalTax, total };
  };

  const totals = calculateTotals();

  // Fetch data on load
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchTemplates(),
          fetchCompanyProfile(),
        ]);
      } catch (error) {
      //  console.error('Error loading form data:', error);
      toast.error(error.message || 'Internal server error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await api.get('/templates');
      setTemplates(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedTemplate(response.data.data[0]);
        setValue('template', response.data.data[0]._id);
      }
    } catch (error) {
     // console.error('Failed to load templates:', error);
     toast.error(error.message || 'Internal server error');
    }
  };

  const fetchCompanyProfile = async () => {
    try {
      const response = await companyAPI.getProfile();
      setCompany(response.data);
      
      // Set default tax from company
      const defaultTax = response.data.taxSettings?.taxTypes?.find(t => t.isDefault);
      if (defaultTax) {
        // Update existing items with default tax
        const currentItems = watch('items') || [];
        if (currentItems.length > 0) {
          const updatedItems = currentItems.map(item => ({
            ...item,
            taxRate: defaultTax.rate,
          }));
          setValue('items', updatedItems);
        }
      }
    } catch (error) {
    //  console.error('Failed to load company profile:', error);
    toast.error(error.message || 'Internal server error');
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      const invoiceData = {
        ...data,
        items: watchedItems.map(item => ({
          description: item.description,
          quantity: Number(item.quantity) || 0,
          rate: Number(item.rate) || 0,
          amount: (Number(item.quantity) || 0) * (Number(item.rate) || 0),
          taxRate: Number(item.taxRate) || 0,
          discount: Number(item.discount) || 0,
        })),
        subtotal: totals.subtotal,
        tax: totals.totalTax,
        total: totals.total,
        discount: discount,
        shipping: shipping,
        companyId: company?._id,
        template: selectedTemplate?._id,
      };
      
      const result = await dispatch(createInvoice(invoiceData)).unwrap();
      toast.success(`Invoice ${result.invoiceNumber} created successfully!`);
      navigate('/invoices');
    } catch (error) {
      toast.error(error.message || 'Failed to create invoice');
      setIsSubmitting(false);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setValue('template', template._id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-primary-500 text-4xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Company Info */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          {company?.logo?.url ? (
            <img 
              src={company.logo.url} 
              alt="Company Logo" 
              className="h-12 w-auto object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <FaBuilding className="text-gray-400 text-xl" />
            </div>
          )}
          <div>
            <h2 className="font-semibold text-gray-800">{company?.companyName || 'Your Company'}</h2>
            <p className="text-sm text-gray-500">{company?.companyEmail || ''}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowTemplateSelector(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all shadow-md"
          >
            <FaPalette />
            <span className="hidden sm:inline">Change Template</span>
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
          >
            <FaEye />
            <span className="hidden sm:inline">Preview</span>
          </button>
        </div>
      </div>

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <InvoiceTemplateSelector
          selectedTemplate={selectedTemplate}
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div className="fixed inset-0 bg-gray-500 opacity-75" onClick={() => setShowPreview(false)}></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowPreview(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <TemplatePreview 
                invoice={{
                  invoiceNumber: 'INV-PREVIEW-001',
                  client: watch('client') || { name: 'Client Name' },
                  items: watchedItems,
                  subtotal: totals.subtotal,
                  tax: totals.totalTax,
                  total: totals.total,
                  discount: discount,
                  shipping: shipping,
                  issueDate: watch('issueDate'),
                  dueDate: watch('dueDate'),
                  notes: watch('notes'),
                  terms: watch('terms'),
                  company: company,
                }}
                template={selectedTemplate}
              />
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Client Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaFileInvoice className="text-primary-500" />
            Client Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name *
              </label>
              <input
                {...register('client.name', { required: 'Client name is required' })}
                className="input-field"
                placeholder="Enter client name"
              />
              {errors.client?.name && (
                <p className="text-red-500 text-sm mt-1">{errors.client.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Email
              </label>
              <input
                {...register('client.email')}
                className="input-field"
                placeholder="client@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                {...register('client.phone')}
                className="input-field"
                placeholder="9876543210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GST Number
              </label>
              <input
                {...register('client.gst')}
                className="input-field"
                placeholder="GSTIN"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                {...register('client.address')}
                className="input-field"
                rows="2"
                placeholder="Client's full address"
              />
            </div>
          </div>
        </div>

        {/* Invoice Items - New Component */}
        <InvoiceItems
          control={control}
          register={register}
          watch={watch}
          setValue={setValue}
          errors={errors}
          company={company}
          defaultTaxRate={company?.taxSettings?.defaultTaxRate || 18}
        />

        {/* Invoice Summary - New Component */}
        <InvoiceSummary
          subtotal={totals.subtotal}
          totalTax={totals.totalTax}
          total={totals.total}
          discount={discount}
          shipping={shipping}
          currency={company?.currency || 'INR'}
          items={watchedItems}
        />

        {/* Additional Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Date
              </label>
              <input
                type="date"
                {...register('issueDate')}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                {...register('dueDate', { required: 'Due date is required' })}
                className="input-field"
              />
              {errors.dueDate && (
                <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                {...register('notes')}
                className="input-field"
                rows="2"
                placeholder="Additional notes (optional)"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Terms & Conditions
              </label>
              <textarea
                {...register('terms')}
                className="input-field"
                rows="2"
                placeholder="Payment terms (optional)"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/invoices')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <FaSave />
                Create Invoice
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;