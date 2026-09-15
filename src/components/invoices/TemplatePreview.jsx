import React from 'react';
import { format } from 'date-fns';

const TemplatePreview = ({ invoice, template }) => {
  if (!invoice || !template) return null;

  const styles = {
    simple: {
      container: 'max-w-4xl mx-auto bg-white',
      header: 'border-b-2 border-blue-500',
      title: 'text-3xl font-bold text-blue-600',
      accent: 'bg-blue-50',
    },
    modern: {
      container: 'max-w-4xl mx-auto bg-white rounded-lg shadow-xl',
      header: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-lg',
      title: 'text-3xl font-bold',
      accent: 'bg-purple-50',
    },
    corporate: {
      container: 'max-w-4xl mx-auto bg-white border-2 border-slate-200',
      header: 'bg-slate-800 text-white p-6',
      title: 'text-3xl font-serif font-bold uppercase tracking-wider',
      accent: 'bg-slate-50',
    },
    creative: {
      container: 'max-w-4xl mx-auto bg-white',
      header: 'border-b-4 border-pink-500 p-6',
      title: 'text-4xl font-serif font-bold text-pink-600',
      accent: 'bg-pink-50',
    },
    minimal: {
      container: 'max-w-4xl mx-auto bg-white',
      header: 'border-b border-gray-200 p-6',
      title: 'text-2xl font-light uppercase tracking-widest text-gray-600',
      accent: 'bg-gray-50',
    },
    elegant: {
      container: 'max-w-4xl mx-auto bg-white shadow-2xl',
      header: 'border-b-2 border-amber-600 p-6',
      title: 'text-3xl font-serif font-bold text-amber-800',
      accent: 'bg-amber-50',
    },
  };

  const style = styles[template.type] || styles.simple;

  return (
    <div className={`${style.container} p-8`}>
      {/* Header */}
      <div className={style.header}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className={style.title}>INVOICE</h1>
            <p className="text-sm opacity-75 mt-1">#{invoice.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-75">Date: {format(new Date(invoice.issueDate), 'MMM dd, yyyy')}</p>
            <p className="text-sm opacity-75">Due: {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</p>
          </div>
        </div>
      </div>

      {/* Client & Company */}
      <div className="grid grid-cols-2 gap-8 my-8">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Bill To:</h3>
          <p className="font-medium text-gray-800 mt-1">{invoice.client.name}</p>
          {invoice.client.email && <p className="text-sm text-gray-600">{invoice.client.email}</p>}
          {invoice.client.phone && <p className="text-sm text-gray-600">{invoice.client.phone}</p>}
          {invoice.client.address && <p className="text-sm text-gray-600">{invoice.client.address}</p>}
        </div>
        <div className="text-right">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">From:</h3>
          <p className="font-medium text-gray-800 mt-1">Your Company</p>
          <p className="text-sm text-gray-600">contact@yourcompany.com</p>
          <p className="text-sm text-gray-600">123 Business Street</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="my-8 overflow-x-auto">
        <table className="min-w-full">
          <thead className={style.accent}>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Description</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Qty</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Rate</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-3 text-sm text-gray-800">{item.description}</td>
                <td className="px-4 py-3 text-sm text-gray-600 text-center">{item.quantity}</td>
                <td className="px-4 py-3 text-sm text-gray-600 text-right">₹{item.rate?.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-800 text-right">₹{item.amount?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className={style.accent}>
            <tr>
              <td colSpan="3" className="px-4 py-3 text-right font-medium">Subtotal:</td>
              <td className="px-4 py-3 text-right font-medium">₹{invoice.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan="3" className="px-4 py-3 text-right font-medium">Tax (18%):</td>
              <td className="px-4 py-3 text-right font-medium">₹{invoice.tax.toFixed(2)}</td>
            </tr>
            <tr className="border-t-2 border-gray-300">
              <td colSpan="3" className="px-4 py-3 text-right font-bold text-lg">Total:</td>
              <td className="px-4 py-3 text-right font-bold text-lg">₹{invoice.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Notes & Terms */}
      {(invoice.notes || invoice.terms) && (
        <div className="mt-8 pt-4 border-t">
          {invoice.notes && (
            <div className="mb-2">
              <h4 className="text-sm font-semibold text-gray-600">Notes:</h4>
              <p className="text-sm text-gray-700">{invoice.notes}</p>
            </div>
          )}
          {invoice.terms && (
            <div>
              <h4 className="text-sm font-semibold text-gray-600">Terms:</h4>
              <p className="text-sm text-gray-700">{invoice.terms}</p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t text-center text-xs text-gray-400">
        <p>Thank you for your business!</p>
        <p className="mt-1">This is a computer-generated invoice.</p>
      </div>
    </div>
  );
};

export default TemplatePreview;