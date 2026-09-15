// frontend/src/components/invoices/forms/VintagePaperInvoiceForm.jsx
import React from 'react';
import { FaEye, FaPlus, FaTrash, FaSave, FaSpinner } from 'react-icons/fa';

const VintagePaperInvoiceForm = (props) => {
  const { 
    formData, setFormData, handleClientChange, 
    handleItemChange, addItem, removeItem,
    calculateItemTotal, totals, taxOptions, 
    isSubmitting, handleSubmit, navigate 
  } = props;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-yellow-100 via-amber-100 to-yellow-100 p-8 rounded-2xl shadow-2xl border-4 border-amber-700/30" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23d4a574" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-serif font-bold text-amber-900">📜 VINTAGE</h2>
            <p className="text-amber-800 text-sm mt-1">Classic paper style</p>
          </div>
          <button className="bg-amber-800 text-amber-50 px-5 py-2.5 rounded-lg hover:bg-amber-900 transition-all flex items-center gap-2 shadow-lg">
            <FaEye /> Preview
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-gradient-to-b from-yellow-50 to-amber-50 rounded-2xl shadow-2xl p-8 space-y-8 border-4 border-amber-700/20" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23d4a574" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-sm font-serif font-bold text-amber-800 border-b-2 border-amber-300 pb-2">Client Details</h4>
            <input type="text" name="name" value={formData.client.name} onChange={handleClientChange} 
              className="w-full px-4 py-3 bg-amber-50 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-serif" 
              placeholder="Client Name *" required />
            <input type="email" name="email" value={formData.client.email} onChange={handleClientChange} 
              className="w-full px-4 py-3 bg-amber-50 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-serif" 
              placeholder="Email" />
            <input type="text" name="phone" value={formData.client.phone} onChange={handleClientChange} 
              className="w-full px-4 py-3 bg-amber-50 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-serif" 
              placeholder="Phone" />
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-serif font-bold text-amber-800 border-b-2 border-amber-300 pb-2">Invoice Details</h4>
            <input type="date" value={formData.issueDate} 
              onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))} 
              className="w-full px-4 py-3 bg-amber-50 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-serif" />
            <input type="date" value={formData.dueDate} 
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))} 
              className="w-full px-4 py-3 bg-amber-50 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-serif" />
            <input type="text" name="address" value={formData.client.address} onChange={handleClientChange} 
              className="w-full px-4 py-3 bg-amber-50 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-serif" 
              placeholder="Address" />
          </div>
        </div>

        <div className="border-t-2 border-amber-300 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-serif font-bold text-amber-800">Items</h3>
            <button type="button" onClick={addItem} 
              className="bg-amber-800 text-amber-50 px-4 py-2 rounded-lg hover:bg-amber-900 flex items-center gap-2 shadow-md">
              <FaPlus /> Add Item
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-amber-200/30">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-serif uppercase tracking-wider text-amber-800">Description</th>
                  <th className="px-3 py-2 text-center text-xs font-serif uppercase tracking-wider text-amber-800 w-20">Qty</th>
                  <th className="px-3 py-2 text-center text-xs font-serif uppercase tracking-wider text-amber-800 w-28">Rate</th>
                  <th className="px-3 py-2 text-right text-xs font-serif uppercase tracking-wider text-amber-800 w-28">Total</th>
                  <th className="px-3 py-2 text-center w-12"></th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => {
                  const itemTotals = calculateItemTotal(item);
                  return (
                    <tr key={index} className="border-b border-amber-200">
                      <td className="px-3 py-2">
                        <input type="text" value={item.description} 
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)} 
                          className="w-full px-3 py-2 bg-amber-50 border-2 border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 font-serif" 
                          placeholder="Item" />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" value={item.quantity} 
                          onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} 
                          className="w-full px-3 py-2 bg-amber-50 border-2 border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-center font-serif" 
                          min="0.01" step="0.01" />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" value={item.rate} 
                          onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)} 
                          className="w-full px-3 py-2 bg-amber-50 border-2 border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-center font-serif" 
                          min="0" step="0.01" />
                      </td>
                      <td className="px-3 py-2 text-right font-serif font-bold text-amber-800">₹{itemTotals.total.toFixed(2)}</td>
                      <td className="px-3 py-2 text-center">
                        <button type="button" onClick={() => removeItem(index)} 
                          className="text-amber-400 hover:text-red-500">
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

        <div className="bg-amber-100/50 rounded-lg p-6 border-2 border-amber-300">
          <div className="flex justify-end">
            <div className="w-80 space-y-2 font-serif">
              <div className="flex justify-between py-1 text-amber-800">
                <span>Subtotal</span>
                <span>₹{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-amber-800">
                <span>Tax</span>
                <span>₹{totals.totalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-amber-500">
                <span className="text-lg font-bold text-amber-900">Total</span>
                <span className="text-lg font-bold text-amber-900">₹{totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t-2 border-amber-300 pt-6">
          <button type="button" onClick={() => navigate('/invoices')} 
            className="px-6 py-3 bg-amber-200 text-amber-800 rounded-lg hover:bg-amber-300 font-serif">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} 
            className="px-6 py-3 bg-amber-800 text-amber-50 rounded-lg hover:bg-amber-900 flex items-center gap-2 shadow-lg font-serif">
            {isSubmitting ? <><FaSpinner className="animate-spin" /> Creating...</> : <><FaSave /> Create Invoice</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VintagePaperInvoiceForm;