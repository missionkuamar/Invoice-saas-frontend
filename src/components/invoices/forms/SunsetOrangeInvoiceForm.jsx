// frontend/src/components/invoices/forms/SunsetOrangeInvoiceForm.jsx
import React from 'react';
import { FaEye, FaPlus, FaTrash, FaSave, FaSpinner } from 'react-icons/fa';


const SunsetOrangeInvoiceForm = (props) => {
  const { 
    formData, setFormData, handleClientChange, 
    handleItemChange, addItem, removeItem,
    calculateItemTotal, totals, taxOptions, 
    isSubmitting, handleSubmit, navigate 
  } = props;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-8 rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white">🌅 Sunset</h2>
            <p className="text-orange-100 text-sm mt-1">Warm and vibrant design</p>
          </div>
          <button className="bg-white/20 backdrop-blur text-white px-5 py-2.5 rounded-full hover:bg-white/30 transition-all flex items-center gap-2">
            <FaEye /> Preview
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-orange-600 border-b-2 border-orange-200 pb-2">Client Details</h4>
            <input type="text" name="name" value={formData.client.name} onChange={handleClientChange} 
              className="w-full px-4 py-3 bg-orange-50 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-400" 
              placeholder="Client Name *" required />
            <input type="email" name="email" value={formData.client.email} onChange={handleClientChange} 
              className="w-full px-4 py-3 bg-orange-50 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-400" 
              placeholder="Email" />
            <input type="text" name="phone" value={formData.client.phone} onChange={handleClientChange} 
              className="w-full px-4 py-3 bg-orange-50 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-400" 
              placeholder="Phone" />
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-pink-600 border-b-2 border-pink-200 pb-2">Invoice Details</h4>
            <input type="date" value={formData.issueDate} 
              onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))} 
              className="w-full px-4 py-3 bg-pink-50 border-2 border-pink-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400" />
            <input type="date" value={formData.dueDate} 
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))} 
              className="w-full px-4 py-3 bg-pink-50 border-2 border-pink-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400" />
            <input type="text" name="address" value={formData.client.address} onChange={handleClientChange} 
              className="w-full px-4 py-3 bg-pink-50 border-2 border-pink-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400" 
              placeholder="Address" />
          </div>
        </div>

        <div className="border-t-2 border-orange-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-orange-700">Items</h3>
            <button type="button" onClick={addItem} 
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-full hover:shadow-lg hover:shadow-orange-500/50 flex items-center gap-2">
              <FaPlus /> Add Item
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-orange-50 to-pink-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-bold uppercase text-orange-700">Description</th>
                  <th className="px-3 py-2 text-center text-xs font-bold uppercase text-orange-700 w-20">Qty</th>
                  <th className="px-3 py-2 text-center text-xs font-bold uppercase text-orange-700 w-28">Rate</th>
                  <th className="px-3 py-2 text-right text-xs font-bold uppercase text-orange-700 w-28">Total</th>
                  <th className="px-3 py-2 text-center w-12"></th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => {
                  const itemTotals = calculateItemTotal(item);
                  return (
                    <tr key={index} className="border-b border-orange-100">
                      <td className="px-3 py-2">
                        <input type="text" value={item.description} 
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)} 
                          className="w-full px-3 py-2 bg-orange-50 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-400" 
                          placeholder="Item" />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" value={item.quantity} 
                          onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} 
                          className="w-full px-3 py-2 bg-orange-50 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-400 text-center" 
                          min="0.01" step="0.01" />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" value={item.rate} 
                          onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)} 
                          className="w-full px-3 py-2 bg-orange-50 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-400 text-center" 
                          min="0" step="0.01" />
                      </td>
                      <td className="px-3 py-2 text-right font-bold text-orange-600">₹{itemTotals.total.toFixed(2)}</td>
                      <td className="px-3 py-2 text-center">
                        <button type="button" onClick={() => removeItem(index)} 
                          className="text-orange-300 hover:text-red-500">
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

        <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg p-6 border-2 border-orange-200">
          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between py-1 text-orange-700">
                <span>Subtotal</span>
                <span>₹{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-orange-700">
                <span>Tax</span>
                <span>₹{totals.totalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-orange-300">
                <span className="text-lg font-bold text-orange-900">Total</span>
                <span className="text-lg font-bold text-orange-900">₹{totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t-2 border-orange-200 pt-6">
          <button type="button" onClick={() => navigate('/invoices')} 
            className="px-6 py-3 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} 
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full hover:shadow-lg hover:shadow-orange-500/50 flex items-center gap-2">
            {isSubmitting ? <><FaSpinner className="animate-spin" /> Creating...</> : <><FaSave /> Create Invoice</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SunsetOrangeInvoiceForm;