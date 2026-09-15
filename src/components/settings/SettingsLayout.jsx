// frontend/src/components/settings/SettingsLayout.jsx
import React from 'react';
import { useTheme } from '../../themes/ThemeProvider';

const SettingsLayout = ({ activeTab, setActiveTab, tabs, children }) => {
  const { theme } = useTheme();

  return (
    <div className={`${theme.colors.card} rounded-2xl border ${theme.colors.border} overflow-hidden`}>
      {/* Header */}
      <div className={`p-4 md:p-6 border-b ${theme.colors.border}`}>
        <h1 className={`text-2xl md:text-3xl font-bold ${theme.colors.text}`}>
          ⚙️ Settings
        </h1>
        <p className={`text-sm md:text-base ${theme.colors.text} opacity-70 mt-1`}>
          Manage your account and company settings
        </p>
      </div>

      {/* Tabs - Horizontal Scroll on Mobile */}
      <div className={`border-b ${theme.colors.border} overflow-x-auto`}>
        <div className="flex gap-1 p-2 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 md:px-4 py-2 rounded-xl text-sm md:text-base transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? `${theme.colors.background} ${theme.colors.primary} border-2 ${theme.colors.border}`
                  : `${theme.colors.text} opacity-70 hover:${theme.colors.hover}`
              }`}
            >
              <span className="mr-1 md:mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">{children}</div>
    </div>
  );
};

export default SettingsLayout;