// frontend/src/components/settings/BankDetails.jsx
import React, { useState } from 'react';
import { FaSave, FaSpinner } from 'react-icons/fa';
import { CiBank } from "react-icons/ci";
import { useTheme } from '../../themes/ThemeProvider';

const BankDetails = ({ company, onUpdate }) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bankDetails: {
      bankName: company?.bankDetails?.bankName || '',
      accountNumber: company?.bankDetails?.accountNumber || '',
      ifscCode: company?.bankDetails?.ifscCode || '',
      accountHolder: company?.bankDetails?.accountHolder || '',
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      bankDetails: { ...prev.bankDetails, [name]: value }
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
        <CiBank className={theme.colors.primary} size={24} />
        Bank Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
              Bank Name
            </label>
            <input
              type="text"
              name="bankName"
              value={formData.bankDetails.bankName}
              onChange={handleChange}
              className={`w-full px-3 md:px-4 py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
              placeholder="Bank Name"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
              Account Number
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.bankDetails.accountNumber}
              onChange={handleChange}
              className={`w-full px-3 md:px-4 py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
              placeholder="Account Number"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
              IFSC Code
            </label>
            <input
              type="text"
              name="ifscCode"
              value={formData.bankDetails.ifscCode}
              onChange={handleChange}
              className={`w-full px-3 md:px-4 py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
              placeholder="IFSC Code"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
              Account Holder Name
            </label>
            <input
              type="text"
              name="accountHolder"
              value={formData.bankDetails.accountHolder}
              onChange={handleChange}
              className={`w-full px-3 md:px-4 py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
              placeholder="Account Holder Name"
            />
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
                <FaSave /> Save Bank Details
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BankDetails;