// frontend/src/components/invoices/forms/NeonGlowInvoiceForm.jsx
import React from 'react';
import { FaEye, FaPlus, FaTrash, FaSave, FaSpinner } from 'react-icons/fa';

const NeonGlowInvoiceForm = (props) => {
  const { 
    formData, setFormData, handleClientChange, 
    handleItemChange, addItem, removeItem,
    calculateItemTotal, totals, taxOptions, 
    isSubmitting, handleSubmit, navigate 
  } = props;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-black p-8 rounded-2xl shadow-2xl border-2 border-cyan-500 shadow-cyan-500/50">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
              ✦ NEON GLOW
            </h2>
            <p className="text-cyan-400 text-sm mt-1">Cyberpunk style</p>
          </div>
          <button className="bg-gradient-to-r from-cyan-500 to-pink-500 text-white px-5 py-2.5 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center gap-2">
            <FaEye /> Preview
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-black rounded-2xl shadow-2xl p-8 space-y-8 border-2 border-cyan-500/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-400 border-b border-cyan-500/30 pb-2">Client Info</h4>
            <input type="text" name="name" value={formData.client.name} onChange={handleClientChange} 
              className="w-full px-4 py-3 bg-gray-900 border-2 border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white" 
              placeholder="Client Name *" required />
            <input type="email" name="email" value={formData.client.email} onChange={handleClientChange} 
              className="w-full px-4 py-3 bg-gray-900 border-2 border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white" 
              placeholder="Email" />
            <input type="text" name="phone" value={formData.client.phone} onChange={handleClientChange} 
              className="w-full px-4 py-3 bg-gray-900 border-2 border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white" 
              placeholder="Phone" />
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-pink-400 border-b border-pink-500/30 pb-2">Invoice Details</h4>
            <input type="date" value={formData.issueDate} 
              onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))} 
              className="w-full px-4 py-3 bg-gray-900 border-2 border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-white" />
            <input type="date" value={formData.dueDate} 
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))} 
              className="w-full px-4 py-3 bg-gray-900 border-2 border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-white" />
            <input type="text" name="address" value={formData.client.address} onChange={handleClientChange} 
              className="w-full px-4 py-3 bg-gray-900 border-2 border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-white" 
              placeholder="Address" />
          </div>
        </div>

        <div className="border-t-2 border-cyan-500/30 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">Items</h3>
            <button type="button" onClick={addItem} 
              className="bg-gradient-to-r from-cyan-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 flex items-center gap-2">
              <FaPlus /> Add Item
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-cyan-400">Description</th>
                  <th className="px-3 py-2 text-center text-xs font-bold uppercase tracking-wider text-cyan-400 w-20">Qty</th>
                  <th className="px-3 py-2 text-center text-xs font-bold uppercase tracking-wider text-cyan-400 w-28">Rate</th>
                  <th className="px-3 py-2 text-right text-xs font-bold uppercase tracking-wider text-cyan-400 w-28">Total</th>
                  <th className="px-3 py-2 text-center w-12"></th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => {
                  const itemTotals = calculateItemTotal(item);
                  return (
                    <tr key={index} className="border-b border-cyan-500/20">
                      <td className="px-3 py-2">
                        <input type="text" value={item.description} 
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)} 
                          className="w-full px-3 py-2 bg-gray-900 border-2 border-cyan-500/30 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white" 
                          placeholder="Item" />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" value={item.quantity} 
                          onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} 
                          className="w-full px-3 py-2 bg-gray-900 border-2 border-cyan-500/30 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white text-center" 
                          min="0.01" step="0.01" />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" value={item.rate} 
                          onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)} 
                          className="w-full px-3 py-2 bg-gray-900 border-2 border-cyan-500/30 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white text-center" 
                          min="0" step="0.01" />
                      </td>
                      <td className="px-3 py-2 text-right font-bold text-cyan-400">₹{itemTotals.total.toFixed(2)}</td>
                      <td className="px-3 py-2 text-center">
                        <button type="button" onClick={() => removeItem(index)} 
                          className="text-gray-600 hover:text-pink-400">
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

        <div className="bg-gradient-to-r from-cyan-500/10 to-pink-500/10 rounded-lg p-6 border-2 border-cyan-500/30">
          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between py-1 text-cyan-400">
                <span>Subtotal</span>
                <span>₹{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-cyan-400">
                <span>Tax</span>
                <span>₹{totals.totalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-cyan-500/30">
                <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">Total</span>
                <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">₹{totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t-2 border-cyan-500/30 pt-6">
          <button type="button" onClick={() => navigate('/invoices')} 
            className="px-6 py-3 bg-gray-800 text-cyan-400 rounded-lg hover:bg-gray-700 border border-cyan-500/30">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} 
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 flex items-center gap-2">
            {isSubmitting ? <><FaSpinner className="animate-spin" /> Creating...</> : <><FaSave /> Create Invoice</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NeonGlowInvoiceForm;