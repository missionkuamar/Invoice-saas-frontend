// frontend/src/components/settings/LogoUpload.jsx
import React, { useRef } from 'react';
import { FaUpload, FaTrash, FaImage } from 'react-icons/fa';
import { useTheme } from '../../themes/ThemeProvider';

const LogoUpload = ({ company, onUpload, onDelete }) => {
  const { theme } = useTheme();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className={`${theme.colors.card} rounded-2xl p-4 md:p-6 border ${theme.colors.border}`}>
      <h2 className={`text-lg font-semibold ${theme.colors.text} mb-4 flex items-center gap-2`}>
        <FaImage className={theme.colors.primary} />
        Company Logo
      </h2>

      <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
        <div className="relative">
          {company?.logo?.url ? (
            <div className="relative group">
              <img
                src={company.logo.url}
                alt="Company Logo"
                className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-700"
              />
              <button
                type="button"
                onClick={onDelete}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <FaTrash size={12} />
              </button>
            </div>
          ) : (
            <div className={`w-24 h-24 md:w-32 md:h-32 ${theme.colors.background} rounded-xl border-2 border-dashed ${theme.colors.border} flex items-center justify-center`}>
              <FaImage className={`text-3xl md:text-4xl ${theme.colors.text} opacity-30`} />
            </div>
          )}
        </div>

        <div className="flex flex-col items-center sm:items-start gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`${theme.colors.button} text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:scale-105 transition-all text-sm w-full sm:w-auto justify-center`}
          >
            <FaUpload /> Upload Logo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <p className={`text-xs ${theme.colors.text} opacity-60 text-center sm:text-left`}>
            Recommended: Square image, max 2MB (PNG, JPG, SVG)
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogoUpload;