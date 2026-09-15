// frontend/src/components/invoices/forms/shared/SummarySection.jsx
import React from 'react';

const colorStyles = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
    gradient: 'from-blue-50 to-blue-100',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-200',
    gradient: 'from-purple-50 to-indigo-50',
  },
  gray: {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
    gradient: 'from-gray-50 to-gray-100',
  },
  pink: {
    bg: 'bg-pink-50',
    text: 'text-pink-600',
    border: 'border-pink-200',
    gradient: 'from-pink-50 via-red-50 to-yellow-50',
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    border: 'border-green-200',
    gradient: 'from-green-50 to-emerald-50',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-200',
    gradient: 'from-amber-50 to-yellow-50',
  },
  cyan: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-600',
    border: 'border-cyan-200',
    gradient: 'from-cyan-50 to-blue-50',
  },
  indigo: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    border: 'border-indigo-200',
    gradient: 'from-indigo-50 to-purple-50',
  },
  violet: {
    bg: 'bg-violet-50',
    text: 'text-violet-600',
    border: 'border-violet-200',
    gradient: 'from-violet-50 to-fuchsia-50',
  },
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    border: 'border-orange-200',
    gradient: 'from-orange-50 to-pink-50',
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
    gradient: 'from-red-50 to-pink-50',
  },
  fuchsia: {
    bg: 'bg-fuchsia-50',
    text: 'text-fuchsia-600',
    border: 'border-fuchsia-200',
    gradient: 'from-fuchsia-50 to-pink-50',
  },
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
    gradient: 'from-emerald-50 to-green-50',
  },
};

const SummarySection = ({ 
  totals, 
  accentColor = 'blue', 
  gradient = false 
}) => {
  const colors = colorStyles[accentColor] || colorStyles.blue;
  
  const bgClass = gradient 
    ? `bg-gradient-to-r ${colors.gradient}`
    : colors.bg;

  // Safe default values if totals is undefined
  const safeTotals = totals || { subtotal: 0, totalTax: 0, totalDiscount: 0, total: 0 };

  return (
    <div className={`${bgClass} rounded-xl p-6`}>
      <div className="flex justify-end">
        <div className="w-80 space-y-2">
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">₹{safeTotals.subtotal?.toFixed(2) || '0.00'}</span>
          </div>
          {safeTotals.totalDiscount > 0 && (
            <div className="flex justify-between py-1 text-green-600">
              <span>Discount:</span>
              <span>-₹{safeTotals.totalDiscount?.toFixed(2) || '0.00'}</span>
            </div>
          )}
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Tax:</span>
            <span className={`font-medium ${colors.text}`}>+₹{safeTotals.totalTax?.toFixed(2) || '0.00'}</span>
          </div>
          <div className={`flex justify-between py-2 border-t-2 ${colors.border}`}>
            <span className="text-lg font-bold text-gray-800">Total:</span>
            <span className={`text-lg font-bold ${colors.text}`}>₹{safeTotals.total?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummarySection;