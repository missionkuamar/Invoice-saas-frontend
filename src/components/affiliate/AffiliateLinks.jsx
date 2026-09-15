// frontend/src/components/affiliate/AffiliateLinks.jsx
import React, { useState } from 'react';
import { FaLink, FaPlus, FaCopy, FaCheck, FaTrash } from 'react-icons/fa';
import { useTheme } from '../../themes/ThemeProvider';

const AffiliateLinks = ({ links, affiliateCode, onCopyLink, onDeleteLink, onCreateLink }) => {
  const { theme } = useTheme();
  const [copiedLink, setCopiedLink] = useState(null);

  const handleCopy = (slug, code) => {
    onCopyLink(slug, code);
    setCopiedLink(slug);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const backendUrl = import.meta.env.VITE_API_URL || 'https://invoice-saas-backend-58pc.onrender.com';

  return (
    <div className={`${theme.colors.card} rounded-2xl p-4 md:p-6 border ${theme.colors.border}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <h2 className={`text-lg font-semibold ${theme.colors.text} flex items-center gap-2`}>
          <FaLink className={theme.colors.primary} /> Your Affiliate Links
        </h2>
        <button
          onClick={onCreateLink}
          className={`${theme.colors.button} text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:scale-105 transition-all text-sm w-full sm:w-auto justify-center`}
        >
          <FaPlus /> Create New Link
        </button>
      </div>

      {links.length === 0 ? (
        <div className={`text-center py-12 ${theme.colors.text}`}>
          <FaLink className={`text-4xl mx-auto mb-3 ${theme.colors.text} opacity-30`} />
          <p className={`${theme.colors.text} opacity-70`}>No links created yet</p>
          <button
            onClick={onCreateLink}
            className={`mt-3 ${theme.colors.primary} hover:underline text-sm`}
          >
            Create your first link
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {links.map((link) => {
            const linkUrl = `${backendUrl}/r/${link.slug}?ref=${affiliateCode}`;
            return (
              <div key={link._id} className={`py-4 first:pt-0 last:pb-0 ${theme.colors.hover} transition-colors rounded-xl px-2`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${theme.colors.text}`}>{link.name}</p>
                    <p className={`text-sm ${theme.colors.text} opacity-60 truncate`}>{link.destination}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        link.status === 'active' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {link.status}
                      </span>
                      <span className={`text-xs ${theme.colors.text} opacity-50`}>
                        {link.clicks || 0} clicks • {link.conversions || 0} conversions
                      </span>
                    </div>
                    <div className="mt-1 overflow-x-auto">
                      <code className={`text-xs ${theme.colors.background} px-2 py-1 rounded-lg ${theme.colors.text} opacity-80`}>
                        {linkUrl}
                      </code>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleCopy(link.slug, affiliateCode)}
                      className={`p-2 rounded-lg ${theme.colors.hover} transition-colors`}
                      title="Copy Link"
                    >
                      {copiedLink === link.slug ? 
                        <FaCheck className="text-green-500" /> : 
                        <FaCopy className={theme.colors.text} />
                      }
                    </button>
                    <button
                      onClick={() => onDeleteLink(link._id)}
                      className={`p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors`}
                      title="Delete Link"
                    >
                      <FaTrash className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AffiliateLinks;