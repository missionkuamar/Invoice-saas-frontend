// src/themes/ThemeProvider.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEMES, DEFAULT_THEME } from './themeConfig';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('invoicehub-theme');
    return saved && THEMES[saved] ? saved : DEFAULT_THEME;
  });

  const theme = THEMES[currentTheme];

  useEffect(() => {
    localStorage.setItem('invoicehub-theme', currentTheme);
    
    // Apply theme colors to CSS variables
    const root = document.documentElement;
    const colors = theme.colors;
    
    // Set CSS variables for dynamic theming
    Object.entries(colors).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(`--theme-${key}`, value);
      }
    });

    // Apply theme class to body
    document.body.className = `${theme.fonts} theme-${currentTheme}`;
    
    // Set background color
    document.body.style.backgroundColor = colors.background;
    document.body.style.color = colors.text;

  }, [currentTheme, theme]);

  const changeTheme = (themeId) => {
    if (THEMES[themeId]) {
      setCurrentTheme(themeId);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, theme, changeTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};