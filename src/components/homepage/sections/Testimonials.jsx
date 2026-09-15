// src/components/sections/Testimonials.jsx
import React from 'react';
import { useTheme } from '../../../themes/ThemeProvider';
import { FaStar } from 'react-icons/fa';

const Testimonials = () => {
  const { theme } = useTheme();

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechStart Inc.',
      content: 'InvoiceHub has transformed how we handle our billing. We reduced invoice processing time by 70%!',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
      name: 'Mike Chen',
      role: 'Freelance Designer',
      content: 'The professional invoice templates and easy payment integration have helped me get paid 2x faster.',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    {
      name: 'Emma Williams',
      role: 'Finance Manager',
      content: 'Managing 100+ clients has never been easier. The automation features are a lifesaver.',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
    {
      name: 'David Kumar',
      role: 'Agency Owner',
      content: 'Best invoicing tool I\'ve used. The analytics and reporting features give me clear business insights.',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
  ];

  return (
    <section id="testimonials" className={`py-20 px-4 ${theme.colors.background}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold ${theme.colors.text} mb-4`}>
            Loved by
            <span className={`bg-gradient-to-r ${theme.colors.gradient} text-transparent bg-clip-text`}>
              {' '}Thousands
            </span>
          </h2>
          <p className={`${theme.colors.text} opacity-70 max-w-2xl mx-auto`}>
            See what our users say about InvoiceHub
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`${theme.colors.card} p-6 rounded-2xl border ${theme.colors.primary} border-opacity-20 hover:shadow-xl transition-all`}
            >
              <div className="flex items-start gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-semibold ${theme.colors.text}`}>{testimonial.name}</h4>
                      <p className={`text-sm ${theme.colors.text} opacity-60`}>{testimonial.role}</p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-sm" />
                      ))}
                    </div>
                  </div>
                  <p className={`mt-3 ${theme.colors.text} opacity-80 text-sm italic`}>
                    "{testimonial.content}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;