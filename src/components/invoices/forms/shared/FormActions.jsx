// frontend/src/components/invoices/forms/shared/FormActions.jsx
import React from 'react';
import { FaSave, FaSpinner } from 'react-icons/fa';

// Map accent colors to Tailwind classes
const buttonStyles = {
  blue: 'bg-blue-500 hover:bg-blue-600',
  purple: 'bg-purple-500 hover:bg-purple-600',
  pink: 'bg-pink-500 hover:bg-pink-600',
  green: 'bg-green-500 hover:bg-green-600',
  amber: 'bg-amber-500 hover:bg-amber-600',
  gray: 'bg-gray-500 hover:bg-gray-600',
  cyan: 'bg-cyan-500 hover:bg-cyan-600',
  indigo: 'bg-indigo-500 hover:bg-indigo-600',
  violet: 'bg-violet-500 hover:bg-violet-600',
  orange: 'bg-orange-500 hover:bg-orange-600',
  red: 'bg-red-500 hover:bg-red-600',
  yellow: 'bg-yellow-500 hover:bg-yellow-600',
  emerald: 'bg-emerald-500 hover:bg-emerald-600',
  fuchsia: 'bg-fuchsia-500 hover:bg-fuchsia-600',
};

const gradientStyles = {
  blue: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
  purple: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
  pink: 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700',
  green: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
  amber: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700',
  gray: 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700',
  cyan: 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700',
  indigo: 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
  violet: 'bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700',
  orange: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
  red: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
  yellow: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
  emerald: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
  fuchsia: 'bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 hover:from-fuchsia-600 hover:to-fuchsia-700',
};

const FormActions = ({ 
  onCancel, 
  isSubmitting, 
  accentColor = 'blue',
  gradient = false
}) => {
  const buttonClass = gradient 
    ? gradientStyles[accentColor] || gradientStyles.blue
    : buttonStyles[accentColor] || buttonStyles.blue;

  return (
    <div className="flex justify-end gap-4 border-t pt-6">
      <button 
        type="button" 
        onClick={onCancel} 
        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
      >
        Cancel
      </button>
      <button 
        type="submit" 
        disabled={isSubmitting} 
        className={`px-6 py-2 ${buttonClass} text-white rounded-lg flex items-center gap-2 shadow-lg transition-colors`}
      >
        {isSubmitting ? (
          <><FaSpinner className="animate-spin" /> Creating...</>
        ) : (
          <><FaSave /> Create Invoice</>
        )}
      </button>
    </div>
  );
};

export default FormActions;