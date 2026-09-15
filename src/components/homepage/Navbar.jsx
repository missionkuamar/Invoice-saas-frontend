// src/components/Navbar.jsx
import React, { useState } from 'react';
import { useTheme } from '../../themes/ThemeProvider';
import ThemeSwitcher from './ThemeSwitcher';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';


const Navbar = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <nav className={`fixed w-full z-50 backdrop-blur-md border-b ${theme.colors.card} border-opacity-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className={`text-2xl font-bold ${theme.colors.text}`}>
              InvoiceHub <span className={`text-${theme.colors.primary.split(' ')[0]}`}>.</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`${theme.colors.text} hover:${theme.colors.primary} transition-colors`}
              >
                {link.label}
              </a>
            ))}
            <ThemeSwitcher />
            <button className={`${theme.colors.button} text-white px-4 py-2 rounded-lg transition-all hover:scale-105`}>
            <Link to='/login'>Get Started</Link>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={theme.colors.text}
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-opacity-20">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`${theme.colors.text} hover:${theme.colors.primary} transition-colors`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button className={`${theme.colors.button} text-white px-4 py-2 rounded-lg w-full`}>
                <Link to='/login'>Get Started</Link>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
