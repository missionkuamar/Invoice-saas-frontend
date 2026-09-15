// frontend/src/components/settings/CompanyInfo.jsx
import React, { useState } from 'react';
import { FaBuilding, FaPhone, FaSave, FaSpinner } from 'react-icons/fa';
import { useTheme } from '../../themes/ThemeProvider';
import LogoUpload from './LogoUpload';

const CompanyInfo = ({ company, onUpdate, onLogoUpload, onDeleteLogo }) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: company?.companyName || '',
    companyPhone: company?.companyPhone || '',
    gstNumber: company?.gstNumber || '',
    panNumber: company?.panNumber || '',
    currency: company?.currency || 'INR',
    companyAddress: {
      street: company?.companyAddress?.street || '',
      city: company?.companyAddress?.city || '',
      state: company?.companyAddress?.state || '',
      zipCode: company?.companyAddress?.zipCode || '',
      country: company?.companyAddress?.country || '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
    <div className="space-y-4 md:space-y-6">
      <LogoUpload 
        company={company} 
        onUpload={onLogoUpload} 
        onDelete={onDeleteLogo} 
      />

      <div className={`${theme.colors.card} rounded-2xl p-4 md:p-6 border ${theme.colors.border}`}>
        <h2 className={`text-lg font-semibold ${theme.colors.text} mb-4 flex items-center gap-2`}>
          <FaBuilding className={theme.colors.primary} />
          Company Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className={`w-full px-3 md:px-4 py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
              placeholder="Your company name"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
              Company Address
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                name="companyAddress.street"
                value={formData.companyAddress.street}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                placeholder="Street"
              />
              <input
                type="text"
                name="companyAddress.city"
                value={formData.companyAddress.city}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                placeholder="City"
              />
              <input
                type="text"
                name="companyAddress.state"
                value={formData.companyAddress.state}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                placeholder="State"
              />
              <input
                type="text"
                name="companyAddress.zipCode"
                value={formData.companyAddress.zipCode}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                placeholder="Zip Code"
              />
              <input
                type="text"
                name="companyAddress.country"
                value={formData.companyAddress.country}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:col-span-2`}
                placeholder="Country"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                <FaPhone className="inline mr-1" /> Phone Number
              </label>
              <input
                type="text"
                name="companyPhone"
                value={formData.companyPhone}
                onChange={handleChange}
                className={`w-full px-3 md:px-4 py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                GST Number
              </label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                className={`w-full px-3 md:px-4 py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                placeholder="GSTIN"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                PAN Number
              </label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                className={`w-full px-3 md:px-4 py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                placeholder="PAN Number"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                Currency
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className={`w-full px-3 md:px-4 py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
              >
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
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
                  <FaSave /> Save Company Info
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyInfo;