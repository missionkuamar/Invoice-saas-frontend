// frontend/src/components/settings/TaxSettings.jsx
import React, { useState } from 'react';
import { FaPlus, FaTrash, FaEdit, FaSave, FaSpinner, FaTimes } from 'react-icons/fa';
import { useTheme } from '../../themes/ThemeProvider';
import toast from 'react-hot-toast';

const TaxSettings = ({ company, onUpdate }) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTax, setEditingTax] = useState(null);
  const [taxForm, setTaxForm] = useState({ name: '', rate: '', description: '', isDefault: false });

  const handleTaxChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTaxForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAddTax = async () => {
    if (!taxForm.name || !taxForm.rate) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const updatedCompany = {
        ...company,
        taxSettings: {
          ...company?.taxSettings,
          taxTypes: [...(company?.taxSettings?.taxTypes || []), { ...taxForm, _id: Date.now().toString() }]
        }
      };
      await onUpdate(updatedCompany);
      setShowModal(false);
      setTaxForm({ name: '', rate: '', description: '', isDefault: false });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTax = async () => {
    setLoading(true);
    try {
      const updatedTaxTypes = company?.taxSettings?.taxTypes?.map(tax =>
        tax._id === editingTax ? { ...tax, ...taxForm } : tax
      );
      const updatedCompany = {
        ...company,
        taxSettings: {
          ...company?.taxSettings,
          taxTypes: updatedTaxTypes
        }
      };
      await onUpdate(updatedCompany);
      setShowModal(false);
      setEditingTax(null);
      setTaxForm({ name: '', rate: '', description: '', isDefault: false });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTax = async (taxId) => {
    if (!window.confirm('Are you sure you want to delete this tax type?')) return;
    try {
      const updatedTaxTypes = company?.taxSettings?.taxTypes?.filter(tax => tax._id !== taxId);
      const updatedCompany = {
        ...company,
        taxSettings: {
          ...company?.taxSettings,
          taxTypes: updatedTaxTypes
        }
      };
      await onUpdate(updatedCompany);
      toast.success('Tax type deleted successfully');
    } catch (error) {
      toast.error('Failed to delete tax');
    }
  };

  return (
    <div className={`${theme.colors.card} rounded-2xl p-4 md:p-6 border ${theme.colors.border}`}>
      <h2 className={`text-lg font-semibold ${theme.colors.text} mb-4 flex items-center gap-2`}>
        💰 Tax Settings
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
            Default Tax Rate (%)
          </label>
          <input
            type="number"
            value={company?.taxSettings?.defaultTaxRate || 18}
            onChange={(e) => {
              const updatedCompany = {
                ...company,
                taxSettings: {
                  ...company?.taxSettings,
                  defaultTaxRate: parseFloat(e.target.value)
                }
              };
              onUpdate(updatedCompany);
            }}
            className={`w-full px-3 md:px-4 py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
            min="0"
            max="100"
            step="0.01"
          />
        </div>
        <div>
          <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
            Calculate Tax On
          </label>
          <select
            value={company?.taxSettings?.calculateTaxOn || 'subtotal'}
            onChange={(e) => {
              const updatedCompany = {
                ...company,
                taxSettings: {
                  ...company?.taxSettings,
                  calculateTaxOn: e.target.value
                }
              };
              onUpdate(updatedCompany);
            }}
            className={`w-full px-3 md:px-4 py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base`}
          >
            <option value="subtotal">Subtotal</option>
            <option value="total">Total</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className={`font-medium ${theme.colors.text}`}>Tax Types</h3>
        <button
          type="button"
          onClick={() => {
            setEditingTax(null);
            setTaxForm({ name: '', rate: '', description: '', isDefault: false });
            setShowModal(true);
          }}
          className={`${theme.colors.button} text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:scale-105 transition-all text-sm`}
        >
          <FaPlus size={12} /> Add Tax
        </button>
      </div>

      <div className="space-y-2">
        {company?.taxSettings?.taxTypes?.length === 0 ? (
          <div className={`text-center py-8 ${theme.colors.text} opacity-60`}>
            <p>No tax types configured</p>
            <p className="text-sm mt-1">Add your first tax type to get started</p>
          </div>
        ) : (
          company?.taxSettings?.taxTypes?.map((tax) => (
            <div key={tax._id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 ${theme.colors.background} rounded-xl gap-2`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`font-medium ${theme.colors.text}`}>{tax.name}</span>
                {tax.isDefault && (
                  <span className={`px-2 py-0.5 ${theme.colors.background} ${theme.colors.primary} text-xs rounded-full`}>
                    Default
                  </span>
                )}
                <span className={`text-sm ${theme.colors.text} opacity-60`}>{tax.rate}%</span>
                {tax.description && (
                  <span className={`text-xs ${theme.colors.text} opacity-50`}>- {tax.description}</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingTax(tax._id);
                    setTaxForm({
                      name: tax.name,
                      rate: tax.rate,
                      description: tax.description,
                      isDefault: tax.isDefault,
                    });
                    setShowModal(true);
                  }}
                  className={`p-1.5 rounded-lg ${theme.colors.hover} transition-colors`}
                >
                  <FaEdit className={theme.colors.text} size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteTax(tax._id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <FaTrash className="text-red-500" size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tax Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-3 md:px-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)}></div>
            <div className={`relative ${theme.colors.card} rounded-2xl shadow-2xl max-w-md w-full p-4 md:p-6 border ${theme.colors.border}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-semibold ${theme.colors.text}`}>
                  {editingTax ? 'Edit Tax Type' : 'Add Tax Type'}
                </h3>
                <button onClick={() => setShowModal(false)} className={`${theme.colors.text} opacity-60 hover:opacity-100`}>
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Tax Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={taxForm.name}
                    onChange={handleTaxChange}
                    className={`w-full px-3 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                    placeholder="e.g., GST, VAT"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Tax Rate (%) *
                  </label>
                  <input
                    type="number"
                    name="rate"
                    value={taxForm.rate}
                    onChange={handleTaxChange}
                    className={`w-full px-3 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                    placeholder="e.g., 18"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={taxForm.description}
                    onChange={handleTaxChange}
                    className={`w-full px-3 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                    placeholder="e.g., Goods and Services Tax"
                  />
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={taxForm.isDefault}
                    onChange={handleTaxChange}
                    className="rounded text-primary-500"
                  />
                  <span className={`text-sm ${theme.colors.text}`}>Set as default tax</span>
                </label>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className={`px-4 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-colors text-sm w-full sm:w-auto`}
                >
                  Cancel
                </button>
                <button
                  onClick={editingTax ? handleUpdateTax : handleAddTax}
                  disabled={loading}
                  className={`${theme.colors.button} text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-all text-sm w-full sm:w-auto disabled:opacity-50`}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>{editingTax ? 'Update' : 'Add'} Tax</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxSettings;