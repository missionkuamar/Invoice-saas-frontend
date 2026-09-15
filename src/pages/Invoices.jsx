// frontend/src/pages/Invoices.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import InvoiceList from '../components/invoices/InvoiceList';
import { useTheme } from '../themes/ThemeProvider';

const Invoices = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className="space-y-4 md:space-y-6">
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 ${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border}`}>
        <div>
          <h1 className={`text-xl md:text-2xl lg:text-3xl font-bold ${theme.colors.text}`}>
            📄 Invoices
          </h1>
          <p className={`text-sm ${theme.colors.text} opacity-70 mt-1`}>
            Manage and track all your invoices
          </p>
        </div>
        <button
          onClick={() => navigate('/create-invoice')}
          className={`${theme.colors.button} text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl flex items-center gap-2 hover:scale-105 transition-all text-sm md:text-base w-full sm:w-auto justify-center`}
        >
          <FaPlus /> New Invoice
        </button>
      </div>
      
      <InvoiceList />
    </div>
  );
};

export default Invoices;