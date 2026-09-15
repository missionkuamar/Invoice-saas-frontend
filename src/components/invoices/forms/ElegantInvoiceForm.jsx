// frontend/src/components/invoices/forms/ElegantInvoiceForm.jsx
import React from 'react';
import { FaEye, FaPlus, FaTrash, FaSave, FaSpinner } from 'react-icons/fa';

const ElegantInvoiceForm = (props) => {
  const { 
    formData, setFormData, handleClientChange, 
    handleItemChange, addItem, removeItem,
    calculateItemTotal, totals, taxOptions, 
    isSubmitting, handleSubmit, navigate 
  } = props;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50 border border-amber-200 p-8 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-serif font-bold text-amber-900">✦ Elegant</h2>
            <p className="text-amber-700 text-sm mt-1">Sophisticated invoice design</p>
          </div>
          <button className="bg-amber-600 text-white px-5 py-2.5 rounded-full hover:bg-amber-700 transition-all flex items-center gap-2 shadow-md">
            <FaEye /> Preview
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
        {/* Decorative line */}
        <div className="border-t-4 border-amber-200 w-20"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-xs font-serif uppercase tracking-widest text-amber-600 border-b border-amber-200 pb-2">Client Information</h4>
            <input type="text" name="name" value={formData.client.name} onChange={handleClientChange} 
              className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 font-serif" 
              placeholder="Client Name *" required />
            <input type="email" name="email" value={formData.client.email} onChange={handleClientChange} 
              className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 font-serif" 
              placeholder="Email" />
            <input type="text" name="phone" value={formData.client.phone} onChange={handleClientChange} 
              className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 font-serif" 
              placeholder="Phone" />
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-serif uppercase tracking-widest text-amber-600 border-b border-amber-200 pb-2">Invoice Details</h4>
            <input type="date" value={formData.issueDate} 
              onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))} 
              className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 font-serif" />
            <input type="date" value={formData.dueDate} 
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))} 
              className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 font-serif" />
            <input type="text" name="address" value={formData.client.address} onChange={handleClientChange} 
              className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 font-serif" 
              placeholder="Address" />
          </div>
        </div>

        <div className="border-t border-amber-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-serif font-bold text-amber-800">Items</h3>
            <button type="button" onClick={addItem} 
              className="bg-amber-600 text-white px-4 py-2 rounded-full hover:bg-amber-700 flex items-center gap-2">
              <FaPlus /> Add Item
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-amber-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-serif uppercase tracking-wider text-amber-700">Description</th>
                  <th className="px-3 py-2 text-center text-xs font-serif uppercase tracking-wider text-amber-700 w-20">Qty</th>
                  <th className="px-3 py-2 text-center text-xs font-serif uppercase tracking-wider text-amber-700 w-28">Rate</th>
                  <th className="px-3 py-2 text-right text-xs font-serif uppercase tracking-wider text-amber-700 w-28">Total</th>
                  <th className="px-3 py-2 text-center w-12"></th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => {
                  const itemTotals = calculateItemTotal(item);
                  return (
                    <tr key={index} className="border-b border-amber-100">
                      <td className="px-3 py-2">
                        <input type="text" value={item.description} 
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)} 
                          className="w-full px-3 py-2 bg-amber-50 border border-amber-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-400 font-serif" 
                          placeholder="Item" />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" value={item.quantity} 
                          onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} 
                          className="w-full px-3 py-2 bg-amber-50 border border-amber-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-400 text-center font-serif" 
                          min="0.01" step="0.01" />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" value={item.rate} 
                          onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)} 
                          className="w-full px-3 py-2 bg-amber-50 border border-amber-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-400 text-center font-serif" 
                          min="0" step="0.01" />
                      </td>
                      <td className="px-3 py-2 text-right font-serif font-bold text-amber-700">₹{itemTotals.total.toFixed(2)}</td>
                      <td className="px-3 py-2 text-center">
                        <button type="button" onClick={() => removeItem(index)} 
                          className="text-amber-300 hover:text-red-500">
                          <FaTrash size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
          <div className="flex justify-end">
            <div className="w-80 space-y-2 font-serif">
              <div className="flex justify-between py-1">
                <span className="text-amber-700">Subtotal</span>
                <span>₹{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-amber-700">Tax</span>
                <span>₹{totals.totalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-amber-300">
                <span className="text-lg font-bold text-amber-900">Total</span>
                <span className="text-lg font-bold text-amber-900">₹{totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-amber-200 pt-6">
          <button type="button" onClick={() => navigate('/invoices')} 
            className="px-6 py-3 bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 font-serif">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} 
            className="px-6 py-3 bg-amber-600 text-white rounded-full hover:bg-amber-700 flex items-center gap-2 shadow-lg font-serif">
            {isSubmitting ? <><FaSpinner className="animate-spin" /> Creating...</> : <><FaSave /> Create Invoice</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ElegantInvoiceForm;