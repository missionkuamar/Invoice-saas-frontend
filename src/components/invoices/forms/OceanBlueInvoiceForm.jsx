// frontend/src/components/invoices/forms/OceanBlueInvoiceForm.jsx
import React from 'react';
import { FaEye, FaPlus, FaTrash, FaSave, FaSpinner, FaWater } from 'react-icons/fa';

const OceanBlueInvoiceForm = (props) => {
  const { 
    formData, setFormData, handleClientChange, 
    handleItemChange, addItem, removeItem,
    calculateItemTotal, totals, taxOptions, 
    isSubmitting, handleSubmit, navigate 
  } = props;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-cyan-600 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>
        <div className="relative flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <FaWater className="text-cyan-300" /> Ocean Blue
            </h2>
            <p className="text-cyan-200 text-sm mt-1">Deep sea inspired design</p>
          </div>
          <button className="bg-white/20 backdrop-blur text-white px-5 py-2.5 rounded-full hover:bg-white/30 transition-all flex items-center gap-2 border border-white/30">
            <FaEye /> Preview
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 space-y-8 border-2 border-blue-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-blue-800 flex items-center gap-2">
              <span className="w-1 h-8 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></span> Client Details
            </h4>
            <input type="text" name="name" value={formData.client.name} onChange={handleClientChange} 
              className="w-full px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400" 
              placeholder="Client Name *" required />
            <input type="email" name="email" value={formData.client.email} onChange={handleClientChange} 
              className="w-full px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400" 
              placeholder="Email" />
            <input type="text" name="phone" value={formData.client.phone} onChange={handleClientChange} 
              className="w-full px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400" 
              placeholder="Phone" />
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-cyan-800 flex items-center gap-2">
              <span className="w-1 h-8 bg-gradient-to-b from-cyan-600 to-blue-400 rounded-full"></span> Invoice Info
            </h4>
            <input type="date" value={formData.issueDate} 
              onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))} 
              className="w-full px-4 py-3 bg-cyan-50 border-2 border-cyan-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-200 focus:border-cyan-400" />
            <input type="date" value={formData.dueDate} 
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))} 
              className="w-full px-4 py-3 bg-cyan-50 border-2 border-cyan-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-200 focus:border-cyan-400" />
            <input type="text" name="address" value={formData.client.address} onChange={handleClientChange} 
              className="w-full px-4 py-3 bg-cyan-50 border-2 border-cyan-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-200 focus:border-cyan-400" 
              placeholder="Address" />
          </div>
        </div>

        <div className="border-t-2 border-blue-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-blue-800">Items</h3>
            <button type="button" onClick={addItem} 
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-full hover:shadow-lg hover:shadow-blue-500/50 flex items-center gap-2">
              <FaPlus /> Add Item
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-bold uppercase text-blue-700">Description</th>
                  <th className="px-3 py-2 text-center text-xs font-bold uppercase text-blue-700 w-20">Qty</th>
                  <th className="px-3 py-2 text-center text-xs font-bold uppercase text-blue-700 w-28">Rate</th>
                  <th className="px-3 py-2 text-right text-xs font-bold uppercase text-blue-700 w-28">Total</th>
                  <th className="px-3 py-2 text-center w-12"></th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => {
                  const itemTotals = calculateItemTotal(item);
                  return (
                    <tr key={index} className="border-b border-blue-100">
                      <td className="px-3 py-2">
                        <input type="text" value={item.description} 
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)} 
                          className="w-full px-3 py-2 bg-blue-50 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400" 
                          placeholder="Item" />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" value={item.quantity} 
                          onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} 
                          className="w-full px-3 py-2 bg-blue-50 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 text-center" 
                          min="0.01" step="0.01" />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" value={item.rate} 
                          onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)} 
                          className="w-full px-3 py-2 bg-blue-50 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 text-center" 
                          min="0" step="0.01" />
                      </td>
                      <td className="px-3 py-2 text-right font-bold text-blue-700">₹{itemTotals.total.toFixed(2)}</td>
                      <td className="px-3 py-2 text-center">
                        <button type="button" onClick={() => removeItem(index)} 
                          className="text-blue-300 hover:text-red-500">
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

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between py-1 text-blue-700">
                <span>Subtotal</span>
                <span>₹{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-blue-700">
                <span>Tax</span>
                <span>₹{totals.totalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-blue-300">
                <span className="text-lg font-bold text-blue-900">Total</span>
                <span className="text-lg font-bold text-blue-900">₹{totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t-2 border-blue-200 pt-6">
          <button type="button" onClick={() => navigate('/invoices')} 
            className="px-6 py-3 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} 
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/50 flex items-center gap-2">
            {isSubmitting ? <><FaSpinner className="animate-spin" /> Creating...</> : <><FaSave /> Create Invoice</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OceanBlueInvoiceForm;