// src/components/sections/Pricing.jsx
import React, { useState } from 'react';
import { useTheme } from '../../../themes/ThemeProvider';
import { FaCheck } from 'react-icons/fa';

const Pricing = () => {
  const { theme } = useTheme();
  const [billing, setBilling] = useState('monthly');

  const plans = [
    {
      name: 'Starter',
      price: { monthly: 9, yearly: 90 },
      features: [
        '10 invoices/month',
        '3 clients',
        'Basic templates',
        'Email support',
        'Payment links',
      ],
      popular: false,
    },
    {
      name: 'Professional',
      price: { monthly: 29, yearly: 290 },
      features: [
        'Unlimited invoices',
        'Unlimited clients',
        'All templates',
        'Priority support',
        'Auto reminders',
        'Multi-currency',
        'Payment gateways',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: { monthly: 99, yearly: 990 },
      features: [
        'Everything in Pro',
        'Custom branding',
        'API access',
        'Team accounts',
        'Advanced reports',
        'Dedicated manager',
        'Custom integration',
      ],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className={`py-20 px-4 ${theme.colors.background}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold ${theme.colors.text} mb-4`}>
            Simple, Transparent
            <span className={`bg-gradient-to-r ${theme.colors.gradient} text-transparent bg-clip-text`}>
              {' '}Pricing
            </span>
          </h2>
          <p className={`${theme.colors.text} opacity-70 max-w-2xl mx-auto`}>
            Choose the plan that's right for your business
          </p>
          <div className="inline-flex mt-6 p-1 rounded-full bg-gray-200 dark:bg-gray-700">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-4 py-2 rounded-full transition ${
                billing === 'monthly'
                  ? `${theme.colors.button} text-white`
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`px-4 py-2 rounded-full transition ${
                billing === 'yearly'
                  ? `${theme.colors.button} text-white`
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              Yearly <span className="text-xs text-green-500">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const price = billing === 'monthly' ? plan.price.monthly : plan.price.yearly;
            return (
              <div
                key={index}
                className={`relative ${theme.colors.card} p-8 rounded-2xl border-2 ${
                  plan.popular
                    ? `${theme.colors.primary} border-opacity-50 shadow-2xl scale-105`
                    : `${theme.colors.primary} border-opacity-20`
                }`}
              >
                {plan.popular && (
                  <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 ${theme.colors.button} text-white px-4 py-1 rounded-full text-sm font-semibold`}>
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className={`text-lg font-semibold ${theme.colors.text}`}>{plan.name}</h3>
                  <div className="mt-4">
                    <span className={`text-4xl font-bold ${theme.colors.text}`}>${price}</span>
                    <span className={`text-sm ${theme.colors.text} opacity-70`}>
                      /{billing === 'monthly' ? 'mo' : 'year'}
                    </span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <FaCheck className={`${theme.colors.primary} text-sm`} />
                      <span className={`text-sm ${theme.colors.text}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full ${plan.popular ? theme.colors.button : `border-2 ${theme.colors.primary} ${theme.colors.text}`} 
                    ${plan.popular ? 'text-white' : ''} px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all`}
                >
                  {plan.popular ? 'Start Free Trial' : 'Get Started'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;