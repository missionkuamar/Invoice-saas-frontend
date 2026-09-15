// frontend/src/components/admin/AdminSubscriptionDistribution.jsx
import React from 'react';
import { useTheme } from '../../themes/ThemeProvider';

const AdminSubscriptionDistribution = ({ distribution }) => {
  const { theme } = useTheme();

  const planColors = {
    free: 'bg-gray-400 dark:bg-gray-600',
    pro: 'bg-blue-500',
    enterprise: 'bg-purple-500',
  };

  const planLabels = {
    free: 'Free',
    pro: 'Pro',
    enterprise: 'Enterprise',
  };

  const total = distribution?.reduce((sum, item) => sum + item.count, 0) || 0;

  return (
    <div className={`${theme.colors.card} rounded-2xl p-4 md:p-6 border ${theme.colors.border}`}>
      <h3 className={`text-base md:text-lg font-semibold ${theme.colors.text} mb-4`}>
        📊 Subscription Distribution
      </h3>

      {distribution?.length === 0 ? (
        <div className={`text-center py-8 ${theme.colors.text} opacity-60`}>
          <p className="text-sm">No subscription data available</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {distribution?.map((item) => {
            const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;
            const plan = item._id || 'free';
            const color = planColors[plan] || planColors.free;
            const label = planLabels[plan] || plan;

            return (
              <div key={plan} className={`${theme.colors.background} rounded-xl p-4 text-center border ${theme.colors.border}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-medium ${theme.colors.text} opacity-70`}>{label}</span>
                  <span className={`text-sm font-bold ${theme.colors.text}`}>{percentage}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${color} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className={`text-lg md:text-xl font-bold ${theme.colors.text} mt-2`}>
                  {item.count}
                </p>
                <p className={`text-xs ${theme.colors.text} opacity-60`}>users</p>
              </div>
            );
          })}
        </div>
      )}

      <div className={`mt-4 pt-4 border-t ${theme.colors.border} flex justify-between text-xs ${theme.colors.text} opacity-60`}>
        <span>Total Subscriptions: {total}</span>
        <span>Last updated: {new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default AdminSubscriptionDistribution;