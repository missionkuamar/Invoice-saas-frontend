// src/components/sections/FAQ.jsx
import React, { useState } from 'react';
import { useTheme } from '../../../themes/ThemeProvider';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQ = () => {
  const { theme } = useTheme();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'What is InvoiceHub?',
      answer: 'InvoiceHub is a modern invoicing platform that helps businesses create, send, and manage professional invoices. It automates the entire invoicing process, from creation to payment tracking.',
    },
    {
      question: 'How secure is InvoiceHub?',
      answer: 'InvoiceHub uses bank-grade 256-bit encryption to protect your data. All payment processing is handled through secure, PCI-compliant payment gateways like Stripe and PayPal.',
    },
    {
      question: 'Can I customize the invoice templates?',
      answer: 'Yes! InvoiceHub offers fully customizable invoice templates. You can add your logo, choose colors, add custom fields, and even create your own templates from scratch.',
    },
    {
      question: 'What payment gateways do you support?',
      answer: 'We support major payment gateways including Stripe, PayPal, Square, and many more. We\'re constantly adding new payment options to make it easy for you to get paid.',
    },
    {
      question: 'Is there a free trial available?',
      answer: 'Yes! We offer a 14-day free trial on all our plans. No credit card required. You can start using InvoiceHub today and see how it can transform your invoicing process.',
    },
    {
      question: 'Can I use InvoiceHub on mobile?',
      answer: 'Absolutely! InvoiceHub is fully responsive and works on all devices. We also have a mobile app for iOS and Android for on-the-go invoicing.',
    },
  ];

  return (
    <section id="faq" className={`py-20 px-4 ${theme.colors.background}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold ${theme.colors.text} mb-4`}>
            Frequently Asked
            <span className={`bg-gradient-to-r ${theme.colors.gradient} text-transparent bg-clip-text`}>
              {' '}Questions
            </span>
          </h2>
          <p className={`${theme.colors.text} opacity-70 max-w-2xl mx-auto`}>
            Find answers to the most common questions about InvoiceHub
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`${theme.colors.card} rounded-2xl border ${theme.colors.primary} border-opacity-20 overflow-hidden`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-opacity-5 transition-colors"
                >
                  <span className={`font-medium ${theme.colors.text}`}>
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <FaChevronUp className={theme.colors.primary} />
                  ) : (
                    <FaChevronDown className={theme.colors.primary} />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-4">
                    <p className={`${theme.colors.text} opacity-70`}>
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;