// frontend/src/components/invoices/forms/NatureGreenInvoiceForm.jsx
import React from 'react';
import { FaEye, FaPlus, FaTrash, FaSave, FaSpinner, FaLeaf } from 'react-icons/fa';

const NatureGreenInvoiceForm = (props) => {
  const { 
    formData, setFormData, handleClientChange, 
    handleItemChange, addItem, removeItem,
    calculateItemTotal, totals, taxOptions, 
    isSubmitting, handleSubmit, navigate 
  } = props;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-2 border-green-200 p-8 rounded-3xl shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-green-800 flex items-center gap-3">
              <FaLeaf className="text-green-600" /> Nature
            </h2>
            <p className="text-green-700 text-sm mt-1">Eco-friendly design</p>
          </div>
          <button className="bg-green-700 text-white px-5 py-2.5 rounded-full hover:bg-green-800 transition-all flex items-center gap-2 shadow-md">
            <FaEye /> Preview
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 space-y-8 border-2 border-green-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-green-700 flex items-center gap-2">
              <span className="w-1 h-6 bg-green-600 rounded-full"></span> Client Details
            </h4>
            <input type="text" name="name" value={formData.client.name} onChange={handleClientChange} 
              className="w-full px-4 py-3 bg-green-50 border-2 border-green-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400" 
              placeholder="Client Name *" required />
            <input type="email" name="email" value={formData.client.email} onChange={handleClientChange} 
              className="w-full px-4 py-3 bg-green-50 border-2 border-green-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400" 
              placeholder="Email" />
            <input type="text" name="phone" value={formData.client.phone} onChange={handleClientChange} 
              className="w-full px-4 py-3 bg-green-50 border-2 border-green-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400" 
              placeholder="Phone" />
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-green-700 flex items-center gap-2">
              <span className="w-1 h-6 bg-green-600 rounded-full"></span> Invoice Info
            </h4>
            <input type="date" value={formData.issueDate} 
              onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))} 
              className="w-full px-4 py-3 bg-green-50 border-2 border-green-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400" />
            <input type="date" value={formData.dueDate} 
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))} 
              className="w-full px-4 py-3 bg-green-50 border-2 border-green-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400" />
            <input type="text" name="address" value={formData.client.address} onChange={handleClientChange} 
              className="w-full px-4 py-3 bg-green-50 border-2 border-green-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400" 
              placeholder="Address" />
          </div>
        </div>

        <div className="border-t-2 border-green-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-green-800">Items</h3>
            <button type="button" onClick={addItem} 
              className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 flex items-center gap-2 shadow-md">
              <FaPlus /> Add Item
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-bold uppercase text-green-700">Description</th>
                  <th className="px-3 py-2 text-center text-xs font-bold uppercase text-green-700 w-20">Qty</th>
                  <th className="px-3 py-2 text-center text-xs font-bold uppercase text-green-700 w-28">Rate</th>
                  <th className="px-3 py-2 text-right text-xs font-bold uppercase text-green-700 w-28">Total</th>
                  <th className="px-3 py-2 text-center w-12"></th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => {
                  const itemTotals = calculateItemTotal(item);
                  return (
                    <tr key={index} className="border-b border-green-100">
                      <td className="px-3 py-2">
                        <input type="text" value={item.description} 
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)} 
                          className="w-full px-3 py-2 bg-green-50 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400" 
                          placeholder="Item" />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" value={item.quantity} 
                          onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} 
                          className="w-full px-3 py-2 bg-green-50 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400 text-center" 
                          min="0.01" step="0.01" />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" value={item.rate} 
                          onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)} 
                          className="w-full px-3 py-2 bg-green-50 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400 text-center" 
                          min="0" step="0.01" />
                      </td>
                      <td className="px-3 py-2 text-right font-bold text-green-700">₹{itemTotals.total.toFixed(2)}</td>
                      <td className="px-3 py-2 text-center">
                        <button type="button" onClick={() => removeItem(index)} 
                          className="text-green-300 hover:text-red-500">
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

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between py-1 text-green-700">
                <span>Subtotal</span>
                <span>₹{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-green-700">
                <span>Tax</span>
                <span>₹{totals.totalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-green-300">
                <span className="text-lg font-bold text-green-900">Total</span>
                <span className="text-lg font-bold text-green-900">₹{totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t-2 border-green-200 pt-6">
          <button type="button" onClick={() => navigate('/invoices')} 
            className="px-6 py-3 bg-green-100 text-green-700 rounded-full hover:bg-green-200">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} 
            className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 flex items-center gap-2 shadow-lg">
            {isSubmitting ? <><FaSpinner className="animate-spin" /> Creating...</> : <><FaSave /> Create Invoice</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NatureGreenInvoiceForm;