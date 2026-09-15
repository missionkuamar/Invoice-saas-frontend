// frontend/src/components/invoices/forms/shared/ItemsSection.jsx
import React from 'react';
import { FaPlus, FaTrash, FaCopy, FaBox } from 'react-icons/fa';

// Color mapping with complete classes
const colorStyles = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-300',
    hover: 'hover:bg-blue-50',
    ring: 'ring-blue-500',
    bgHover: 'hover:border-blue-400',
    icon: 'text-blue-500',
    button: 'bg-blue-500 hover:bg-blue-600',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-300',
    hover: 'hover:bg-purple-50',
    ring: 'ring-purple-500',
    bgHover: 'hover:border-purple-400',
    icon: 'text-purple-500',
    button: 'bg-purple-500 hover:bg-purple-600',
  },
  gray: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-300',
    hover: 'hover:bg-gray-50',
    ring: 'ring-gray-500',
    bgHover: 'hover:border-gray-400',
    icon: 'text-gray-500',
    button: 'bg-gray-500 hover:bg-gray-600',
  },
  pink: {
    bg: 'bg-pink-50',
    text: 'text-pink-700',
    border: 'border-pink-300',
    hover: 'hover:bg-pink-50',
    ring: 'ring-pink-500',
    bgHover: 'hover:border-pink-400',
    icon: 'text-pink-500',
    button: 'bg-pink-500 hover:bg-pink-600',
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-300',
    hover: 'hover:bg-green-50',
    ring: 'ring-green-500',
    bgHover: 'hover:border-green-400',
    icon: 'text-green-500',
    button: 'bg-green-500 hover:bg-green-600',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-300',
    hover: 'hover:bg-amber-50',
    ring: 'ring-amber-500',
    bgHover: 'hover:border-amber-400',
    icon: 'text-amber-500',
    button: 'bg-amber-500 hover:bg-amber-600',
  },
  cyan: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-300',
    hover: 'hover:bg-cyan-50',
    ring: 'ring-cyan-500',
    bgHover: 'hover:border-cyan-400',
    icon: 'text-cyan-500',
    button: 'bg-cyan-500 hover:bg-cyan-600',
  },
  indigo: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-300',
    hover: 'hover:bg-indigo-50',
    ring: 'ring-indigo-500',
    bgHover: 'hover:border-indigo-400',
    icon: 'text-indigo-500',
    button: 'bg-indigo-500 hover:bg-indigo-600',
  },
  violet: {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-300',
    hover: 'hover:bg-violet-50',
    ring: 'ring-violet-500',
    bgHover: 'hover:border-violet-400',
    icon: 'text-violet-500',
    button: 'bg-violet-500 hover:bg-violet-600',
  },
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-300',
    hover: 'hover:bg-orange-50',
    ring: 'ring-orange-500',
    bgHover: 'hover:border-orange-400',
    icon: 'text-orange-500',
    button: 'bg-orange-500 hover:bg-orange-600',
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-300',
    hover: 'hover:bg-red-50',
    ring: 'ring-red-500',
    bgHover: 'hover:border-red-400',
    icon: 'text-red-500',
    button: 'bg-red-500 hover:bg-red-600',
  },
  fuchsia: {
    bg: 'bg-fuchsia-50',
    text: 'text-fuchsia-700',
    border: 'border-fuchsia-300',
    hover: 'hover:bg-fuchsia-50',
    ring: 'ring-fuchsia-500',
    bgHover: 'hover:border-fuchsia-400',
    icon: 'text-fuchsia-500',
    button: 'bg-fuchsia-500 hover:bg-fuchsia-600',
  },
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-300',
    hover: 'hover:bg-emerald-50',
    ring: 'ring-emerald-500',
    bgHover: 'hover:border-emerald-400',
    icon: 'text-emerald-500',
    button: 'bg-emerald-500 hover:bg-emerald-600',
  },
};

const ItemsSection = ({ 
  formData, 
  handleItemChange,
  addItem,
  removeItem,
  duplicateItem,
  calculateItemTotal,
  taxOptions,
  accentColor = 'blue'
}) => {
  const colors = colorStyles[accentColor] || colorStyles.blue;

  return (
    <div className="border-t pt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-lg font-semibold ${colors.text} flex items-center gap-2`}>
          <FaBox className={colors.icon} /> Invoice Items
        </h3>
        <button 
          type="button" 
          onClick={addItem} 
          className={`${colors.button} text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors`}
        >
          <FaPlus /> Add Item
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={colors.bg}>
            <tr>
              <th className={`px-3 py-2 text-left text-sm font-medium ${colors.text}`}>Description</th>
              <th className={`px-3 py-2 text-center text-sm font-medium ${colors.text} w-20`}>Qty</th>
              <th className={`px-3 py-2 text-center text-sm font-medium ${colors.text} w-28`}>Rate</th>
              <th className={`px-3 py-2 text-center text-sm font-medium ${colors.text} w-20`}>Disc%</th>
              <th className={`px-3 py-2 text-center text-sm font-medium ${colors.text} w-28`}>Tax%</th>
              <th className={`px-3 py-2 text-right text-sm font-medium ${colors.text} w-24`}>Amount</th>
              <th className={`px-3 py-2 text-right text-sm font-medium ${colors.text} w-24`}>Tax</th>
              <th className={`px-3 py-2 text-right text-sm font-medium ${colors.text} w-28`}>Total</th>
              <th className="px-3 py-2 text-center w-12"></th>
            </tr>
          </thead>
          <tbody>
            {formData?.items.map((item, index) => {
              const totals = calculateItemTotal(item);
              return (
                <tr key={index} className={`border-b ${colors.hover}`}>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Item description"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                      min="0.01"
                      step="0.01"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={item.discount}
                      onChange={(e) => handleItemChange(index, 'discount', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                      min="0"
                      max="100"
                      step="0.5"
                      placeholder="0"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={item.taxRate}
                      onChange={(e) => handleItemChange(index, 'taxRate', parseFloat(e.target.value))}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                    >
                      {taxOptions.map((tax, idx) => (
                        <option key={idx} value={tax.rate}>{tax.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-right font-medium">₹{totals.amount.toFixed(2)}</td>
                  <td className={`px-3 py-2 text-right ${colors.text} font-medium`}>₹{totals.taxAmount.toFixed(2)}</td>
                  <td className={`px-3 py-2 text-right font-bold ${colors.text}`}>₹{totals.total.toFixed(2)}</td>
                  <td className="px-3 py-2 text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <button 
                        type="button" 
                        onClick={() => duplicateItem(index)} 
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <FaCopy size={14} />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => removeItem(index)} 
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button 
        type="button" 
        onClick={addItem} 
        className={`mt-3 w-full md:w-auto px-4 py-2 border-2 border-dashed ${colors.border} rounded hover:${colors.bgHover} ${colors.hover} transition-colors ${colors.text} flex items-center justify-center gap-2`}
      >
        <FaPlus size={14} /> Add Another Item
      </button>
    </div>
  );
};

export default ItemsSection;