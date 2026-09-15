// DialogEmailBox.jsx
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import EmailScheduler from './EmailScheduler';

const DialogEmailBox = ({ isOpen, onClose, invoice }) => {
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState([]);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const response = await api.get('/emails/my-emails');
      setEmails(response.data.data || []);
      toast.success('Emails fetched successfully');
    } catch (error) {
      console.error('Error fetching emails:', error);
      toast.error('Failed to fetch scheduled emails');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-lg md:max-w-xl lg:max-w-2xl rounded-xl bg-gray-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Schedule Email
            </h2>
            <p className="text-sm text-gray-400">
              #{invoice.invoiceNumber} - {invoice.clientName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto p-5">
          <EmailScheduler
            invoiceId={invoice._id}
            onEmailSent={fetchEmails}
          />
        </div>

        {/* Footer (optional) */}
        <div className="border-t border-gray-700 px-5 py-3 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {loading ? 'Loading emails...' : `${emails.length} emails scheduled`}
          </span>
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialogEmailBox;