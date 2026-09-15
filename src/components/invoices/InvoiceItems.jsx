// frontend/src/components/invoices/InvoiceItems.jsx
import React, { useState, useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';
import { 
  FaPlus, 
  FaTrash, 
  FaCopy, 
  FaTaxi,
  FaPercent,
  FaRupeeSign,
  FaBox,
  FaTag,
  FaEdit,
} from 'react-icons/fa';

const InvoiceItems = ({ 
  control, 
  register, 
  watch, 
  setValue, 
  errors, 
  company,
  defaultTaxRate = 18 
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const [taxTypes, setTaxTypes] = useState([]);
  const [editingTax, setEditingTax] = useState(null);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [customTax, setCustomTax] = useState({ name: '', rate: '' });

  useEffect(() => {
    // Set default tax types from company
    if (company?.taxSettings?.taxTypes && company.taxSettings.taxTypes.length > 0) {
      setTaxTypes(company.taxSettings.taxTypes);
    } else {
      // Fallback default tax types
      setTaxTypes([
        { id: 'gst', name: 'GST', rate: 18, isDefault: true },
        { id: 'vat', name: 'VAT', rate: 5, isDefault: false },
        { id: 'service', name: 'Service Tax', rate: 14, isDefault: false },
        { id: 'cst', name: 'CST', rate: 2, isDefault: false },
      ]);
    }
  }, [company]);

  // Get default tax
  const getDefaultTax = () => {
    const defaultTax = taxTypes.find(t => t.isDefault);
    return defaultTax?.rate || defaultTaxRate;
  };

  // Add new item with default tax
  const addItem = () => {
    const newItem = { 
      description: '', 
      quantity: 1, 
      rate: 0, 
      taxRate: getDefaultTax(),
      discount: 0,
    };
    append(newItem);
  };

  // Duplicate item
  const duplicateItem = (index) => {
    const item = watch(`items.${index}`) || {};
    append({
      description: item.description || '',
      quantity: item.quantity || 1,
      rate: item.rate || 0,
      taxRate: item.taxRate || getDefaultTax(),
      discount: item.discount || 0,
    });
  };

  // Calculate item totals
  const calculateItemTotals = (index) => {
    const qty = parseFloat(watch(`items.${index}.quantity`)) || 0;
    const rate = parseFloat(watch(`items.${index}.rate`)) || 0;
    const taxRate = parseFloat(watch(`items.${index}.taxRate`)) || 0;
    const discount = parseFloat(watch(`items.${index}.discount`)) || 0;
    
    const amount = qty * rate;
    const discountAmount = (amount * discount) / 100;
    const taxableAmount = amount - discountAmount;
    const taxAmount = (taxableAmount * taxRate) / 100;
    const total = taxableAmount + taxAmount;
    
    return {
      amount,
      discountAmount,
      taxableAmount,
      taxAmount,
      total,
    };
  };

  // Handle tax rate change
  const handleTaxChange = (index, value) => {
    const currentItems = watch('items') || [];
    const updatedItems = [...currentItems];
    updatedItems[index] = {
      ...updatedItems[index],
      taxRate: parseFloat(value) || 0,
    };
    setValue('items', updatedItems);
  };

  // Handle custom tax addition
  const handleAddCustomTax = (e) => {
    e.preventDefault();
    const taxName = customTax.name.trim();
    const taxRate = parseFloat(customTax.rate);
    
    if (!taxName || isNaN(taxRate)) {
      alert('Please enter valid tax name and rate');
      return;
    }

    const newTax = {
      id: `custom-${Date.now()}`,
      name: taxName,
      rate: taxRate,
      isDefault: false,
      isCustom: true,
    };

    setTaxTypes([...taxTypes, newTax]);
    setShowTaxModal(false);
    setCustomTax({ name: '', rate: '' });
    
    // Optionally set this as the selected tax for the current item
    if (editingTax !== null) {
      handleTaxChange(editingTax, taxRate);
      setEditingTax(null);
    }
    
    toast.success(`Tax "${taxName}" added successfully!`);
  };

  if (fields.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Items Added</h3>
        <p className="text-gray-500 mb-4">Start adding items to your invoice</p>
        <button
          type="button"
          onClick={addItem}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
        >
          <FaPlus /> Add First Item
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FaBox className="text-blue-500 text-xl" />
            <h3 className="text-lg font-semibold text-gray-800">Invoice Items</h3>
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
              {fields.length} items
            </span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setEditingTax(null);
                setCustomTax({ name: '', rate: '' });
                setShowTaxModal(true);
              }}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors inline-flex items-center gap-2 text-sm"
            >
              <FaTaxi size={14} />
              Add Tax Type
            </button>
            <button
              type="button"
              onClick={addItem}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-2 shadow-md"
            >
              <FaPlus size={14} />
              Add Item
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <FaTag size={12} />
                  Description
                </div>
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
                <div className="flex items-center justify-center gap-1">
                  <FaBox size={12} />
                  Qty
                </div>
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">
                <div className="flex items-center justify-center gap-1">
                  <FaRupeeSign size={12} />
                  Rate
                </div>
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
                <div className="flex items-center justify-center gap-1">
                  <FaPercent size={12} />
                  Disc %
                </div>
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">
                <div className="flex items-center justify-center gap-1">
                  <FaTaxi size={12} />
                  Tax %
                </div>
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                Amount
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                Tax
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">
                Total
              </th>
              <th className="px-3 py-3 text-center w-16">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {fields.map((field, index) => {
              const totals = calculateItemTotals(index);
              const item = watch(`items.${index}`) || {};
              const taxValue = parseFloat(watch(`items.${index}.taxRate`)) || 0;

              // ✅ FIX: Use unique key - field.id from react-hook-form
              const uniqueKey = field.id || `item-${index}-${Date.now()}`;

              return (
                <tr key={uniqueKey} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-3 py-2">
                    <input
                      {...register(`items.${index}.description`, {
                        required: 'Description required',
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      placeholder="Enter item description..."
                      onChange={(e) => {
                        const value = e.target.value;
                        const currentItems = watch('items') || [];
                        const updatedItems = [...currentItems];
                        updatedItems[index] = { ...updatedItems[index], description: value };
                        setValue('items', updatedItems);
                      }}
                    />
                    {errors.items?.[index]?.description && (
                      <p className="text-red-500 text-xs mt-1">{errors.items[index].description.message}</p>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center bg-white"
                      min="0.01"
                      step="0.01"
                      value={parseFloat(watch(`items.${index}.quantity`)) || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : parseFloat(e.target.value);
                        const currentItems = watch('items') || [];
                        const updatedItems = [...currentItems];
                        updatedItems[index] = { ...updatedItems[index], quantity: value || 0 };
                        setValue('items', updatedItems);
                      }}
                      placeholder="0"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-400">₹</span>
                      <input
                        type="number"
                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center bg-white"
                        min="0"
                        step="0.01"
                        value={parseFloat(watch(`items.${index}.rate`)) || ''}
                        onChange={(e) => {
                          const value = e.target.value === '' ? '' : parseFloat(e.target.value);
                          const currentItems = watch('items') || [];
                          const updatedItems = [...currentItems];
                          updatedItems[index] = { ...updatedItems[index], rate: value || 0 };
                          setValue('items', updatedItems);
                        }}
                        placeholder="0"
                      />
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center bg-white"
                      min="0"
                      max="100"
                      step="0.5"
                      value={parseFloat(watch(`items.${index}.discount`)) || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : parseFloat(e.target.value);
                        const currentItems = watch('items') || [];
                        const updatedItems = [...currentItems];
                        updatedItems[index] = { ...updatedItems[index], discount: value || 0 };
                        setValue('items', updatedItems);
                      }}
                      placeholder="0"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <select
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center bg-white"
                        value={taxValue}
                        onChange={(e) => handleTaxChange(index, e.target.value)}
                      >
                        <option value="0">No Tax (0%)</option>
                        {taxTypes.map((tax) => (
                          <option key={tax.id || tax.name} value={tax.rate}>
                            {tax.name} ({tax.rate}%)
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTax(index);
                          setCustomTax({ name: '', rate: '' });
                          setShowTaxModal(true);
                        }}
                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Add custom tax"
                      >
                        <FaEdit size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right font-medium text-gray-700">
                    ₹{totals.amount.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-right text-sm">
                    <span className="text-blue-600 font-medium">
                      ₹{totals.taxAmount.toFixed(2)}
                    </span>
                    {totals.discountAmount > 0 && (
                      <div className="text-xs text-green-600">
                        -₹{totals.discountAmount.toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <span className="text-lg font-bold text-blue-600">
                      ₹{totals.total.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => duplicateItem(index)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded hover:bg-blue-50"
                        title="Duplicate item"
                      >
                        <FaCopy size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (fields.length > 1) {
                            remove(index);
                          }
                        }}
                        className={`p-1.5 transition-colors rounded ${
                          fields.length === 1 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                        }`}
                        disabled={fields.length === 1}
                        title={fields.length === 1 ? "Cannot remove last item" : "Remove item"}
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

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-gray-200">
        {fields.map((field, index) => {
          const totals = calculateItemTotals(index);
          const taxValue = parseFloat(watch(`items.${index}.taxRate`)) || 0;
          const uniqueKey = field.id || `mobile-item-${index}-${Date.now()}`;

          return (
            <div key={uniqueKey} className="p-4 hover:bg-gray-50">
              {/* Item Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                    placeholder="Item description..."
                    value={watch(`items.${index}.description`) || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      const currentItems = watch('items') || [];
                      const updatedItems = [...currentItems];
                      updatedItems[index] = { ...updatedItems[index], description: value };
                      setValue('items', updatedItems);
                    }}
                  />
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <button
                    type="button"
                    onClick={() => duplicateItem(index)}
                    className="p-1.5 text-gray-400 hover:text-blue-600"
                    title="Duplicate"
                  >
                    <FaCopy size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (fields.length > 1) {
                        remove(index);
                      }
                    }}
                    className={`p-1.5 ${
                      fields.length === 1 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-400 hover:text-red-600'
                    }`}
                    disabled={fields.length === 1}
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>

              {/* Item Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Quantity</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center bg-white text-sm"
                    min="0.01"
                    step="0.01"
                    value={parseFloat(watch(`items.${index}.quantity`)) || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : parseFloat(e.target.value);
                      const currentItems = watch('items') || [];
                      const updatedItems = [...currentItems];
                      updatedItems[index] = { ...updatedItems[index], quantity: value || 0 };
                      setValue('items', updatedItems);
                    }}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Rate (₹)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center bg-white text-sm"
                    min="0"
                    step="0.01"
                    value={parseFloat(watch(`items.${index}.rate`)) || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : parseFloat(e.target.value);
                      const currentItems = watch('items') || [];
                      const updatedItems = [...currentItems];
                      updatedItems[index] = { ...updatedItems[index], rate: value || 0 };
                      setValue('items', updatedItems);
                    }}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Discount %</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center bg-white text-sm"
                    min="0"
                    max="100"
                    step="0.5"
                    value={parseFloat(watch(`items.${index}.discount`)) || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : parseFloat(e.target.value);
                      const currentItems = watch('items') || [];
                      const updatedItems = [...currentItems];
                      updatedItems[index] = { ...updatedItems[index], discount: value || 0 };
                      setValue('items', updatedItems);
                    }}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Tax %</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center bg-white text-sm"
                    value={taxValue}
                    onChange={(e) => handleTaxChange(index, e.target.value)}
                  >
                    <option value="0">No Tax (0%)</option>
                    {taxTypes.map((tax) => (
                      <option key={tax.id || tax.name} value={tax.rate}>
                        {tax.name} ({tax.rate}%)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Item Totals */}
              <div className="mt-3 grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-lg">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="text-sm font-semibold text-gray-700">₹{totals.amount.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Tax</p>
                  <p className="text-sm font-semibold text-blue-600">₹{totals.taxAmount.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-sm font-bold text-blue-600">₹{totals.total.toFixed(2)}</p>
                </div>
              </div>

              {totals.discountAmount > 0 && (
                <div className="mt-1 text-center text-xs text-green-600">
                  Discount: ₹{totals.discountAmount.toFixed(2)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer with Add Button */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <button
          type="button"
          onClick={addItem}
          className="w-full lg:w-auto bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors inline-flex items-center justify-center gap-2 border-2 border-dashed border-gray-300"
        >
          <FaPlus size={14} />
          Add Another Item
        </button>
      </div>

      {/* Custom Tax Modal */}
      {showTaxModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowTaxModal(false)}></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FaTaxi className="text-blue-500" />
                  Add Custom Tax
                </h3>
                <button
                  onClick={() => setShowTaxModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddCustomTax}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax Name
                    </label>
                    <input
                      type="text"
                      value={customTax.name}
                      onChange={(e) => setCustomTax({ ...customTax, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., CGST, SGST, GST"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={customTax.rate}
                      onChange={(e) => setCustomTax({ ...customTax, rate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 18"
                      min="0"
                      max="100"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowTaxModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add Tax
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceItems;