import React from 'react';
import InvoiceForm from '../components/invoices/InvoiceForm';

const CreateInvoice = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Invoice</h1>
      <InvoiceForm />
    </div>
  );
};

export default CreateInvoice;