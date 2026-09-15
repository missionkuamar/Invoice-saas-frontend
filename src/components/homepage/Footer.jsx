// src/components/Footer.jsx
import React from 'react';
import { useTheme } from '../../themes/ThemeProvider';
import { 
  FaTwitter, FaGithub, FaLinkedin, FaYoutube,
  FaFacebook, FaInstagram, FaHeart
} from 'react-icons/fa';

const Footer = () => {
  const { theme } = useTheme();

  const footerLinks = {
    Product: ['Features', 'Pricing', 'Integrations', 'Changelog'],
    Company: ['About', 'Blog', 'Careers', 'Press'],
    Resources: ['Documentation', 'Help Center', 'API Reference', 'Community'],
    Legal: ['Privacy', 'Terms', 'Security', 'Cookies'],
  };

  return (
    <footer className={`${theme.colors.background} border-t ${theme.colors.primary} border-opacity-20`}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className={`font-semibold ${theme.colors.text} mb-4`}>{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className={`text-sm ${theme.colors.text} opacity-70 hover:opacity-100 transition-opacity`}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t ${theme.colors.primary} border-opacity-20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`text-xl font-bold ${theme.colors.text}`}>
                InvoiceHub <span className={`text-${theme.colors.primary.split(' ')[0]}`}>.</span>
              </span>
              <span className={`text-sm ${theme.colors.text} opacity-60`}>
                Made with <FaHeart className="inline text-red-500" /> in 2024
              </span>
            </div>
            <div className="flex gap-4">
              <FaTwitter className={`${theme.colors.text} opacity-60 hover:opacity-100 cursor-pointer text-xl`} />
              <FaGithub className={`${theme.colors.text} opacity-60 hover:opacity-100 cursor-pointer text-xl`} />
              <FaLinkedin className={`${theme.colors.text} opacity-60 hover:opacity-100 cursor-pointer text-xl`} />
              <FaYoutube className={`${theme.colors.text} opacity-60 hover:opacity-100 cursor-pointer text-xl`} />
              <FaFacebook className={`${theme.colors.text} opacity-60 hover:opacity-100 cursor-pointer text-xl`} />
              <FaInstagram className={`${theme.colors.text} opacity-60 hover:opacity-100 cursor-pointer text-xl`} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;