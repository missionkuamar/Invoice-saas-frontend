// frontend/src/components/affiliate/AffiliateJoin.jsx
import React from 'react';
import { FaRocket, FaGift, FaShare, FaWallet } from 'react-icons/fa';
import { useTheme } from '../../themes/ThemeProvider';

const AffiliateJoin = ({ onJoin, stats }) => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme.colors.background} p-4 md:p-6`}>
      <div className="max-w-4xl mx-auto">
        <div className={`bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 md:p-8 text-white text-center`}>
          <FaRocket className="text-5xl md:text-6xl mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Join Affiliate Program</h2>
          <p className="text-base md:text-lg opacity-90 mb-6">
            Earn {stats?.commissionRate || 10}% commission on every referral
          </p>
          <button
            onClick={onJoin}
            className="bg-white text-purple-600 px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold hover:bg-purple-50 transition-colors shadow-lg hover:scale-105 transform duration-200"
          >
            Join Now - It's Free!
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
          <div className={`${theme.colors.card} p-4 md:p-6 rounded-xl shadow-sm border ${theme.colors.border}`}>
            <FaGift className={`text-3xl ${theme.colors.primary} mx-auto mb-3`} />
            <h3 className={`font-semibold text-center ${theme.colors.text}`}>Earn Commission</h3>
            <p className={`text-sm text-center ${theme.colors.text} opacity-70`}>10% on every sale you refer</p>
          </div>
          <div className={`${theme.colors.card} p-4 md:p-6 rounded-xl shadow-sm border ${theme.colors.border}`}>
            <FaShare className="text-3xl text-blue-500 mx-auto mb-3" />
            <h3 className={`font-semibold text-center ${theme.colors.text}`}>Share Easily</h3>
            <p className={`text-sm text-center ${theme.colors.text} opacity-70`}>Create links and share anywhere</p>
          </div>
          <div className={`${theme.colors.card} p-4 md:p-6 rounded-xl shadow-sm border ${theme.colors.border}`}>
            <FaWallet className="text-3xl text-green-500 mx-auto mb-3" />
            <h3 className={`font-semibold text-center ${theme.colors.text}`}>Get Paid</h3>
            <p className={`text-sm text-center ${theme.colors.text} opacity-70`}>Withdraw your earnings anytime</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateJoin;