// frontend/src/components/invoices/forms/shared/FormHeader.jsx
import React from 'react';
import { FaEye } from 'react-icons/fa';

const colorMap = {
  blue: 'text-blue-800',
  purple: 'text-purple-800',
  pink: 'text-pink-800',
  green: 'text-green-800',
  amber: 'text-amber-800',
  gray: 'text-gray-800',
  cyan: 'text-cyan-800',
  indigo: 'text-indigo-800',
  violet: 'text-violet-800',
  orange: 'text-orange-800',
  red: 'text-red-800',
  yellow: 'text-yellow-800',
  emerald: 'text-emerald-800',
  fuchsia: 'text-fuchsia-800',
};

const descColorMap = {
  blue: 'text-blue-600',
  purple: 'text-purple-600',
  pink: 'text-pink-600',
  green: 'text-green-600',
  amber: 'text-amber-600',
  gray: 'text-gray-600',
  cyan: 'text-cyan-600',
  indigo: 'text-indigo-600',
  violet: 'text-violet-600',
  orange: 'text-orange-600',
  red: 'text-red-600',
  yellow: 'text-yellow-600',
  emerald: 'text-emerald-600',
  fuchsia: 'text-fuchsia-600',
};

const FormHeader = ({ 
  title, 
  description, 
  accentColor = 'blue', 
  lightText = false, 
  onPreview 
}) => {
  const textColor = lightText ? 'text-white' : (colorMap[accentColor] || 'text-blue-800');
  const descColor = lightText ? 'text-white/80' : (descColorMap[accentColor] || 'text-blue-600');

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className={`text-2xl font-bold ${textColor}`}>{title}</h2>
        {description && <p className={`text-sm ${descColor} mt-1`}>{description}</p>}
      </div>
      <button 
        onClick={onPreview}
        className={`${lightText ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} 
          px-4 py-2 rounded-lg transition-colors flex items-center gap-2`}
      >
        <FaEye /> Preview
      </button>
    </div>
  );
};

export default FormHeader;