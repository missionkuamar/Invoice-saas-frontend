// src/components/Layout.jsx
import React from 'react';
import { useTheme } from '../../themes/ThemeProvider';
import Navbar from './Navbar';
import Footer from './Footer';

// src/components/Layout.jsx

const Layout = ({ children }) => {
  const { theme } = useTheme();
  
  return (
    <div 
      className={`min-h-screen ${theme.colors.background} ${theme.fonts} theme-transition`}
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
      }}
    >
      <div className="relative">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;