// frontend/src/components/invoices/forms/CreativeInvoiceForm.jsx
import React from 'react';
import { FaUser } from "react-icons/fa";
import { FaFileInvoice } from "react-icons/fa";
import { FaBox } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaCopy } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaSave } from "react-icons/fa";

import { FaEye } from "react-icons/fa";
const CreativeInvoiceForm = (props) => {
  const { 
    formData, setFormData, handleClientChange, 
    handleItemChange, addItem, removeItem, duplicateItem,
    calculateItemTotal, totals, taxOptions, 
    isSubmitting, handleSubmit, navigate 
  } = props;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-8 rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center text-white">
          <div>
            <h2 className="text-3xl font-bold">🎨 Creative Invoice</h2>
            <p className="text-white/80 text-sm mt-1">Stand out with creative design</p>
          </div>
          <button className="bg-white/20 backdrop-blur px-4 py-2 rounded-full hover:bg-white/30 transition-colors flex items-center gap-2">
            <FaEye /> Preview
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
        {/* Creative client section with split colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-pink-50 to-red-50 p-6 rounded-2xl">
            <h4 className="text-sm font-bold text-pink-600 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FaUser className="text-pink-500" /> Client Details
            </h4>
            <div className="space-y-3">
              <input type="text" name="name" value={formData.client.name} onChange={handleClientChange} 
                className="w-full px-4 py-3 bg-white border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400" 
                placeholder="Client Name *" required />
              <input type="email" name="email" value={formData.client.email} onChange={handleClientChange} 
                className="w-full px-4 py-3 bg-white border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400" 
                placeholder="Email" />
              <input type="text" name="phone" value={formData.client.phone} onChange={handleClientChange} 
                className="w-full px-4 py-3 bg-white border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400" 
                placeholder="Phone" />
              <textarea name="address" value={formData.client.address} onChange={handleClientChange} 
                className="w-full px-4 py-3 bg-white border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400" 
                rows="2" placeholder="Address" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl">
            <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FaFileInvoice className="text-orange-500" /> Invoice Info
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 font-medium">Issue Date</label>
                <input type="date" value={formData.issueDate} 
                  onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))} 
                  className="w-full px-4 py-3 bg-white border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-400" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium">Due Date</label>
                <input type="date" value={formData.dueDate} 
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))} 
                  className="w-full px-4 py-3 bg-white border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-400" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium">GST Number</label>
                <input type="text" name="gst" value={formData.client.gst} onChange={handleClientChange} 
                  className="w-full px-4 py-3 bg-white border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-400" 
                  placeholder="GSTIN" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium">PO Number</label>
                <input type="text" value={formData.poNumber} 
                  onChange={(e) => setFormData(prev => ({ ...prev, poNumber: e.target.value }))} 
                  className="w-full px-4 py-3 bg-white border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-400" 
                  placeholder="PO Number" />
              </div>
            </div>
          </div>
        </div>

        {/* Creative items section */}
        <div className="border-t-2 border-dashed border-pink-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-pink-600 flex items-center gap-2">
              <FaBox className="text-pink-500" /> Items
            </h3>
            <button type="button" onClick={addItem} 
              className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2 rounded-full hover:from-pink-600 hover:to-red-600 flex items-center gap-2 shadow-lg">
              <FaPlus /> Add Item
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-pink-50 to-orange-50">
                <tr>
                  <th className="px-3 py-2 text-left text-sm font-bold text-pink-700">Description</th>
                  <th className="px-3 py-2 text-center text-sm font-bold text-pink-700 w-20">Qty</th>
                  <th className="px-3 py-2 text-center text-sm font-bold text-pink-700 w-28">Rate</th>
                  <th className="px-3 py-2 text-center text-sm font-bold text-pink-700 w-20">Disc%</th>
                  <th className="px-3 py-2 text-center text-sm font-bold text-pink-700 w-28">Tax%</th>
                  <th className="px-3 py-2 text-right text-sm font-bold text-pink-700 w-28">Total</th>
                  <th className="px-3 py-2 text-center w-12"></th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => {
                  const itemTotals = calculateItemTotal(item);
                  return (
                    <tr key={index} className="border-b border-gray-100 hover:bg-pink-50/50 transition-colors">
                      <td className="px-3 py-2">
                        <input type="text" value={item.description} 
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)} 
                          className="w-full px-3 py-2 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400" 
                          placeholder="Item" />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" value={item.quantity} 
                          onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} 
                          className="w-full px-3 py-2 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400 text-center" 
                          min="0.01" step="0.01" />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" value={item.rate} 
                          onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)} 
                          className="w-full px-3 py-2 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400 text-center" 
                          min="0" step="0.01" />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" value={item.discount} 
                          onChange={(e) => handleItemChange(index, 'discount', parseFloat(e.target.value) || 0)} 
                          className="w-full px-3 py-2 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400 text-center" 
                          min="0" max="100" step="0.5" />
                      </td>
                      <td className="px-3 py-2">
                        <select value={item.taxRate} 
                          onChange={(e) => handleItemChange(index, 'taxRate', parseFloat(e.target.value))} 
                          className="w-full px-3 py-2 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400 text-center">
                          {taxOptions.map((tax, index) => (
                            <option key={index} value={tax.rate}>{tax.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2 text-right font-bold text-pink-600">₹{itemTotals.total.toFixed(2)}</td>
                      <td className="px-3 py-2 text-center">
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => duplicateItem(index)} 
                            className="text-gray-400 hover:text-pink-600">
                            <FaCopy size={14} />
                          </button>
                          <button type="button" onClick={() => removeItem(index)} 
                            className="text-gray-400 hover:text-red-500">
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
        </div>

        {/* Creative summary */}
        <div className="bg-gradient-to-r from-pink-50 via-red-50 to-yellow-50 rounded-2xl p-6">
          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{totals.subtotal.toFixed(2)}</span>
              </div>
              {totals.totalDiscount > 0 && (
                <div className="flex justify-between py-1 text-green-600">
                  <span>Discount</span>
                  <span>-₹{totals.totalDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Tax</span>
                <span className="text-pink-600">+₹{totals.totalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-pink-200">
                <span className="text-xl font-bold text-gray-800">Total</span>
                <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-red-500 text-transparent bg-clip-text">
                  ₹{totals.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Creative actions */}
        <div className="flex justify-end gap-4 border-t pt-6">
          <button type="button" onClick={() => navigate('/invoices')} 
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} 
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl hover:from-pink-600 hover:to-red-600 flex items-center gap-2 shadow-lg">
            {isSubmitting ? <><FaSpinner className="animate-spin" /> Creating...</> : <><FaSave /> Create Invoice</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreativeInvoiceForm;