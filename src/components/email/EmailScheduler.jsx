// EmailScheduler.jsx
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const EmailScheduler = ({ invoiceId, onEmailSent }) => {
  const [emailType, setEmailType] = useState('simple');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  // Simple email form state
  const [simpleForm, setSimpleForm] = useState({
    toEmail: '',
    subject: '',
    message: '',
    scheduleTime: ''
  });

  // Advanced email form state
  const [advancedForm, setAdvancedForm] = useState({
    emailType: 'invoice',
    scheduleTime: '',
    paymentDetails: '',
    reason: '',
    changes: '',
    creditAmount: '',
    cycle: 'monthly'
  });

  const emailTypes = [
    { value: 'invoice', label: '💰 Send Invoice', icon: '💰' },
    { value: 'reminder', label: '⏰ Payment Reminder', icon: '⏰' },
    { value: 'overdue', label: '🚨 Overdue Alert', icon: '🚨' },
    { value: 'confirmation', label: '✅ Payment Confirmation', icon: '✅' },
    { value: 'cancellation', label: '❌ Invoice Cancellation', icon: '❌' },
    { value: 'revised', label: '📝 Revised Invoice', icon: '📝' },
    { value: 'proforma', label: '📄 Proforma Invoice', icon: '📄' },
    { value: 'credit_note', label: '💳 Credit Note', icon: '💳' },
    { value: 'recurring', label: '🔄 Recurring Invoice', icon: '🔄' }
  ];

  const advancedEndpoints = {
    invoice: '/send-invoice',
    reminder: '/send-reminder',
    overdue: '/send-overdue',
    confirmation: '/send-confirmation',
    cancellation: '/send-cancellation',
    revised: '/send-revised',
    proforma: '/send-proforma',
    credit_note: '/send-credit-note',
    recurring: '/send-recurring'
  };

  // Handle simple email submission
  const handleSimpleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        ...simpleForm,
        scheduleTime: simpleForm.scheduleTime || new Date().toISOString()
      };
console.log(payload);
      const response = await api.post('/emails/schedule', payload);
      
      setMessage({ type: 'success', text: '✅ Email scheduled successfully!' });
      setSimpleForm({ toEmail: '', subject: '', message: '', scheduleTime: '' });
      if (onEmailSent) onEmailSent();
      toast.success('Email scheduled successfully!');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to schedule email';
      setMessage({ type: 'error', text: errorMsg });
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle advanced email submission
  const handleAdvancedSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        invoiceId,
        scheduleTime: advancedForm.scheduleTime || new Date().toISOString()
      };

      // Add additional fields based on email type
      switch (advancedForm.emailType) {
        case 'confirmation':
          payload.paymentDetails = advancedForm.paymentDetails;
          break;
        case 'cancellation':
          payload.reason = advancedForm.reason;
          break;
        case 'revised':
          payload.changes = advancedForm.changes;
          break;
        case 'credit_note':
          payload.creditAmount = advancedForm.creditAmount;
          payload.reason = advancedForm.reason;
          break;
        case 'recurring':
          payload.cycle = advancedForm.cycle;
          break;
        default:
          break;
      }
console.log('api',advancedForm.emailType  , payload )
      const response = await api.post(
        `/emails${advancedEndpoints[advancedForm.emailType]}`,
        payload
      );

      const typeLabel = advancedForm.emailType.replace('_', ' ');
      setMessage({ type: 'success', text: `✅ ${typeLabel} email scheduled!` });
      setAdvancedForm({
        ...advancedForm,
        scheduleTime: '',
        paymentDetails: '',
        reason: '',
        changes: '',
        creditAmount: ''
      });
      if (onEmailSent) onEmailSent();
      toast.success(`${typeLabel} email scheduled successfully!`);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to schedule';
      setMessage({ type: 'error', text: errorMsg });
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Email Type Selection */}
      <div className="flex gap-2 border-b border-gray-700 pb-3">
        <button
          onClick={() => setEmailType('simple')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            emailType === 'simple'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          ✉️ Simple Email
        </button>
        <button
          onClick={() => setEmailType('advanced')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            emailType === 'advanced'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          🚀 Advanced Email
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-900/50 text-green-400 border border-green-800' 
            : 'bg-red-900/50 text-red-400 border border-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Simple Email Form */}
      {emailType === 'simple' && (
        <form onSubmit={handleSimpleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              To Email *
            </label>
            <input
              type="email"
              value={simpleForm.toEmail}
              onChange={(e) => setSimpleForm({...simpleForm, toEmail: e.target.value})}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="client@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Subject *
            </label>
            <input
              type="text"
              value={simpleForm.subject}
              onChange={(e) => setSimpleForm({...simpleForm, subject: e.target.value})}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email subject"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Message *
            </label>
            <textarea
              value={simpleForm.message}
              onChange={(e) => setSimpleForm({...simpleForm, message: e.target.value})}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Write your message here..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Schedule Time
            </label>
            <input
              type="datetime-local"
              value={simpleForm.scheduleTime}
              onChange={(e) => setSimpleForm({...simpleForm, scheduleTime: e.target.value})}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={new Date().toISOString().slice(0, 16)}
            />
            <p className="text-xs text-gray-400 mt-1">Leave empty to send immediately</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
          >
            {loading ? 'Scheduling...' : '📧 Schedule Email'}
          </button>
        </form>
      )}

      {/* Advanced Email Form */}
      {emailType === 'advanced' && (
        <form onSubmit={handleAdvancedSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email Type *
            </label>
            <select
              value={advancedForm.emailType}
              onChange={(e) => setAdvancedForm({...advancedForm, emailType: e.target.value})}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {emailTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic fields based on email type */}
          {advancedForm.emailType === 'confirmation' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Payment Details *
              </label>
              <textarea
                value={advancedForm.paymentDetails}
                onChange={(e) => setAdvancedForm({...advancedForm, paymentDetails: e.target.value})}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Enter payment details (amount, transaction ID, etc.)"
                required
              />
            </div>
          )}

          {(advancedForm.emailType === 'cancellation' || advancedForm.emailType === 'credit_note') && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Reason *
              </label>
              <textarea
                value={advancedForm.reason}
                onChange={(e) => setAdvancedForm({...advancedForm, reason: e.target.value})}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Enter reason for cancellation/credit note"
                required
              />
            </div>
          )}

          {advancedForm.emailType === 'revised' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Changes Made *
              </label>
              <textarea
                value={advancedForm.changes}
                onChange={(e) => setAdvancedForm({...advancedForm, changes: e.target.value})}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe the changes made to the invoice"
                required
              />
            </div>
          )}

          {advancedForm.emailType === 'credit_note' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Credit Amount *
              </label>
              <input
                type="number"
                value={advancedForm.creditAmount}
                onChange={(e) => setAdvancedForm({...advancedForm, creditAmount: e.target.value})}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
          )}

          {advancedForm.emailType === 'recurring' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Billing Cycle *
              </label>
              <select
                value={advancedForm.cycle}
                onChange={(e) => setAdvancedForm({...advancedForm, cycle: e.target.value})}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="half-yearly">Half Yearly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Schedule Time
            </label>
            <input
              type="datetime-local"
              value={advancedForm.scheduleTime}
              onChange={(e) => setAdvancedForm({...advancedForm, scheduleTime: e.target.value})}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={new Date().toISOString().slice(0, 16)}
            />
            <p className="text-xs text-gray-400 mt-1">Leave empty to send immediately</p>
          </div>

          <button
            type="submit"
            disabled={loading || !invoiceId}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium"
          >
            {loading 
              ? 'Scheduling...' 
              : `📧 Schedule ${advancedForm.emailType.replace('_', ' ')} Email`}
          </button>

          {!invoiceId && (
            <p className="text-yellow-400 text-sm text-center mt-2">
              ⚠️ Please select an invoice first
            </p>
          )}
        </form>
      )}
    </div>
  );
};

export default EmailScheduler;