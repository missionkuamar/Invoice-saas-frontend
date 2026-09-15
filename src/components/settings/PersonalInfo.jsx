// frontend/src/components/settings/PersonalInfo.jsx
import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaSave, FaSpinner } from 'react-icons/fa';
import { useTheme } from '../../themes/ThemeProvider';

const PersonalInfo = ({ company, onUpdate, user }) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: company?.companyName || '',
    companyEmail: company?.companyEmail || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        <FaUser className={theme.colors.primary} />
        Personal Information
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
              Full Name *
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className={`w-full px-3 md:px-4 py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
              placeholder="Your full name"
              required
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
              Email Address *
            </label>
            <div className="relative">
              <FaEnvelope className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.colors.text} opacity-40`} />
              <input
                type="email"
                name="companyEmail"
                value={formData.companyEmail}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
                placeholder="your@email.com"
                required
              />
            </div>
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
                <FaSave /> Save Personal Info
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfo;