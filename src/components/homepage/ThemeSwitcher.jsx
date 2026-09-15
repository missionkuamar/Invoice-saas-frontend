// src/components/ThemeSwitcher.jsx
import React, { useState } from 'react';
import { useTheme } from '../../themes/ThemeProvider';
import { FaPalette } from 'react-icons/fa';
import { FaCheck } from "react-icons/fa";

const ThemeSwitcher = () => {
  const { currentTheme, themes, changeTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105"
      >
        <FaPalette size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">
              🎨 Choose Your Theme
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Select a theme to customize your experience
            </p>
          </div>
          <div className="p-4 max-h-96 overflow-y-auto grid grid-cols-3 gap-3">
            {Object.entries(themes).map(([id, theme]) => (
              <button
                key={id}
                onClick={() => {
                  changeTheme(id);
                  setIsOpen(false);
                }}
                className={`relative p-3 rounded-xl text-center transition-all hover:scale-105 group ${
                  currentTheme === id 
                    ? 'ring-2 ring-offset-2 ring-purple-500 shadow-lg' 
                    : 'hover:shadow-lg'
                }`}
                style={{
                  background: theme.colors.background,
                  border: `2px solid ${theme.colors.primary}40`,
                }}
              >
                <span className="text-3xl block mb-1">{theme.icon}</span>
                <span className={`text-xs font-medium block ${
                  theme.id === 'dark' || theme.id === 'cyber' || theme.id === 'neon'
                    ? 'text-white'
                    : 'text-gray-800'
                }`}>
                  {theme.name.split(' ')[0]}
                </span>
                {currentTheme === id && (
                  <div className="absolute -top-2 -right-2 bg-purple-500 text-white rounded-full p-1">
                    <FaCheck size={10} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;