// src/components/sections/CTA.jsx
import React from 'react';
import { useTheme } from '../../../themes/ThemeProvider';
import { FaRocket } from 'react-icons/fa';

const CTA = () => {
  const { theme } = useTheme();

  return (
    <section className={`py-20 px-4`}>
      <div className={`max-w-4xl mx-auto text-center ${theme.colors.card} p-12 rounded-3xl border ${theme.colors.primary} border-opacity-30 relative overflow-hidden`}>
        <div className="relative z-10">
          <h2 className={`text-4xl font-bold ${theme.colors.text} mb-4`}>
            Ready to Get Started?
          </h2>
          <p className={`${theme.colors.text} opacity-70 mb-8 max-w-2xl mx-auto`}>
            Join thousands of businesses already using InvoiceHub to simplify their invoicing.
            Start your free trial today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className={`${theme.colors.button} text-white px-8 py-3 rounded-lg flex items-center gap-2 hover:scale-105 transition-all`}>
              Start Free Trial <FaRocket />
            </button>
            <button className={`border-2 ${theme.colors.primary} ${theme.colors.text} px-8 py-3 rounded-lg hover:bg-opacity-10 transition-all`}>
              Contact Sales
            </button>
          </div>
          <p className={`text-sm ${theme.colors.text} opacity-60 mt-4`}>
            No credit card required. 14-day free trial.
          </p>
        </div>
        {/* Background decoration */}
        <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full ${theme.colors.primary} opacity-5`}></div>
        <div className={`absolute -bottom-20 -left-20 w-64 h-64 rounded-full ${theme.colors.primary} opacity-5`}></div>
      </div>
    </section>
  );
};

export default CTA;