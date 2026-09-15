// frontend/src/components/settings/InvoiceSettings.jsx
import React, { useState } from 'react';
import { FaFileInvoice, FaSave, FaSpinner } from 'react-icons/fa';
import { useTheme } from '../../themes/ThemeProvider';

const InvoiceSettings = ({ company, onUpdate }) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    invoiceSettings: {
      prefix: company?.invoiceSettings?.prefix || 'INV',
      numberFormat: company?.invoiceSettings?.numberFormat || 'YYYYMM-XXXXX',
      footerText: company?.invoiceSettings?.footerText || '',
      termsText: company?.invoiceSettings?.termsText || '',
      showLogo: company?.invoiceSettings?.showLogo !== false,
      showGST: company?.invoiceSettings?.showGST !== false,
      showBankDetails: company?.invoiceSettings?.showBankDetails || false,
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      invoiceSettings: {
        ...prev.invoiceSettings,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate({ ...company, ...formData });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${theme.colors.card} rounded-2xl p-4 md:p-6 border ${theme.colors.border}`}>
      <h2 className={`text-lg font-semibold ${theme.colors.text} mb-4 flex items-center gap-2`}>
        <FaFileInvoice className={theme.colors.primary} />
        Invoice Settings
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
              Invoice Prefix
            </label>
            <input
              type="text"
              name="prefix"
              value={formData.invoiceSettings.prefix}
              onChange={handleChange}
              className={`w-full px-3 md:px-4 py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
              placeholder="INV"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
              Number Format
            </label>
            <select
              name="numberFormat"
              value={formData.invoiceSettings.numberFormat}
              onChange={handleChange}
              className={`w-full px-3 md:px-4 py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
            >
              <option value="YYYYMM-XXXXX">YYYYMM-XXXXX</option>
              <option value="YYYY-XXXXX">YYYY-XXXXX</option>
              <option value="MMYYYY-XXXXX">MMYYYY-XXXXX</option>
              <option value="INV-XXXXX">INV-XXXXX</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
              Footer Text
            </label>
            <input
              type="text"
              name="footerText"
              value={formData.invoiceSettings.footerText}
              onChange={handleChange}
              className={`w-full px-3 md:px-4 py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
              placeholder="Thank you for your business!"
            />
          </div>
          <div className="md:col-span-2">
            <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
              Terms & Conditions Text
            </label>
            <textarea
              name="termsText"
              value={formData.invoiceSettings.termsText}
              onChange={handleChange}
              className={`w-full px-3 md:px-4 py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base resize-none`}
              rows="2"
              placeholder="Payment due within 30 days..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="showLogo"
              checked={formData.invoiceSettings.showLogo}
              onChange={handleChange}
              className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
            <span className={`text-sm ${theme.colors.text}`}>Show Logo</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="showGST"
              checked={formData.invoiceSettings.showGST}
              onChange={handleChange}
              className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
            <span className={`text-sm ${theme.colors.text}`}>Show GST</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="showBankDetails"
              checked={formData.invoiceSettings.showBankDetails}
              onChange={handleChange}
              className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
            <span className={`text-sm ${theme.colors.text}`}>Show Bank Details</span>
          </label>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`${theme.colors.button} text-white px-6 py-2.5 rounded-xl flex items-center gap-2 hover:scale-105 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FaSave /> Save Invoice Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceSettings;