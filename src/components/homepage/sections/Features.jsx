// src/components/sections/Features.jsx
import React from 'react';
import { useTheme } from '../../../themes/ThemeProvider';
import { 
  FaFileInvoice, FaRocket, FaShieldAlt, 
  FaMobileAlt, FaChartLine, FaUsers,
  FaCreditCard, FaClock, 
  FaEnvelope, FaRobot, FaDatabase
} from 'react-icons/fa';
import { FaCloudUploadAlt } from "react-icons/fa";
import { motion } from 'framer-motion';
// src/components/sections/Features.jsx

const Features = () => {
  const { theme } = useTheme();

  const features = [
    { icon: FaFileInvoice, title: 'Create Invoices', desc: 'Professional invoices in seconds with beautiful templates', color: 'from-blue-500 to-cyan-500' },
    { icon: FaRocket, title: 'Get Paid Faster', desc: 'Multiple payment gateways with instant processing', color: 'from-green-500 to-emerald-500' },
    { icon: FaShieldAlt, title: 'Secure & Safe', desc: 'Bank-grade 256-bit encryption for your data', color: 'from-purple-500 to-indigo-500' },
    { icon: FaMobileAlt, title: 'Mobile Ready', desc: 'Fully responsive on all devices and screen sizes', color: 'from-pink-500 to-rose-500' },
    { icon: FaChartLine, title: 'Analytics', desc: 'Track your business growth with detailed insights', color: 'from-orange-500 to-red-500' },
    { icon: FaUsers, title: 'Client Management', desc: 'Manage clients effortlessly with CRM features', color: 'from-cyan-500 to-blue-500' },
    { icon: FaCreditCard, title: 'Payment Gateways', desc: 'Stripe, PayPal, Square & many more', color: 'from-indigo-500 to-purple-500' },
    { icon: FaClock, title: 'Auto Reminders', desc: 'Never miss a payment with smart reminders', color: 'from-yellow-500 to-orange-500' },
    { icon: FaCloudUploadAlt, title: 'Cloud Sync', desc: 'Access your invoices anywhere, anytime', color: 'from-emerald-500 to-teal-500' },
    { icon: FaEnvelope, title: 'Email Integration', desc: 'Send professional invoices via email', color: 'from-rose-500 to-pink-500' },
    { icon: FaRobot, title: 'AI Assistant', desc: 'Smart invoicing suggestions and automation', color: 'from-violet-500 to-purple-500' },
    { icon: FaDatabase, title: 'Reports', desc: 'Detailed business reports and exports', color: 'from-blue-500 to-indigo-500' },
  ];

  return (
    <section id="features" className={`py-20 px-4 ${theme.colors.background}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-bold ${theme.colors.text} mb-4`}>
            Powerful Features for
            <span className={`bg-gradient-to-r ${theme.colors.gradient} text-transparent bg-clip-text`}>
              {' '}Modern Business
            </span>
          </h2>
          <p className={`${theme.colors.text} opacity-70 max-w-2xl mx-auto text-lg`}>
            Everything you need to manage your invoicing and get paid faster
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`${theme.colors.card} p-6 rounded-2xl border ${theme.colors.border} shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer`}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} p-3 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="text-white text-2xl" />
                </div>
                <h3 className={`text-lg font-semibold ${theme.colors.text} mb-2`}>
                  {feature.title}
                </h3>
                <p className={`text-sm ${theme.colors.text} opacity-70`}>
                  {feature.desc}
                </p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className={`text-sm font-semibold bg-gradient-to-r ${theme.colors.gradient} text-transparent bg-clip-text`}>
                    Learn More →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;