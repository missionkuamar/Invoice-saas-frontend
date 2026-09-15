// frontend/src/components/emails/EmailStats.jsx
import React from 'react';
import { useTheme } from '../../themes/ThemeProvider';
import { FaSpinner } from 'react-icons/fa';

const EmailStats = ({ summary, loadingStats }) => {
  const { theme } = useTheme();

  if (loadingStats && !summary) {
    return (
      <div className="flex justify-center items-center p-8">
        <FaSpinner className="animate-spin text-primary-500 text-3xl" />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className={`${theme.colors.card} p-4 rounded-xl border ${theme.colors.border}`}>
        <p className={`text-sm ${theme.colors.text} opacity-70 text-center`}>
          📊 No statistics available
        </p>
      </div>
    );
  }

  const stats = [
    { label: 'Total', value: summary.total || 0, color: 'bg-blue-500' },
    { label: 'Pending', value: summary.pending || 0, color: 'bg-yellow-500' },
    { label: 'Sent', value: summary.sent || 0, color: 'bg-green-500' },
    { label: 'Failed', value: summary.failed || 0, color: 'bg-red-500' }
  ];

  const usage = summary.usage || { plan: 'free', limit: 5, used: 0, remaining: 5 };
  const usagePercent = usage.limit > 0 ? Math.round((usage.used / usage.limit) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`${theme.colors.card} p-4 rounded-xl border ${theme.colors.border}`}
          >
            <p className={`text-sm ${theme.colors.text} opacity-70`}>{stat.label}</p>
            <p className={`text-2xl font-bold ${theme.colors.text}`}>{stat.value}</p>
            <div className={`w-full h-1 mt-2 rounded-full ${stat.color}`} />
          </div>
        ))}
      </div>

      {/* Usage Stats */}
      <div className={`${theme.colors.card} p-4 rounded-xl border ${theme.colors.border}`}>
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className={`text-sm font-medium ${theme.colors.text}`}>
              📊 Email Usage - {usage.plan.toUpperCase()} Plan
            </p>
          </div>
          <div className="text-right">
            <p className={`text-sm font-bold ${theme.colors.text}`}>
              {usage.remaining || 0} remaining
            </p>
            <p className={`text-xs ${theme.colors.text} opacity-60`}>
              {usage.used || 0} / {usage.limit || 0} used
            </p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className={`h-2.5 rounded-full ${
              usagePercent < 70 ? 'bg-green-500' :
              usagePercent < 90 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${Math.min(usagePercent, 100)}%` }}
          />
        </div>
        {usage.resetDate && (
          <p className={`text-xs ${theme.colors.text} opacity-60 mt-2`}>
            Resets on {new Date(usage.resetDate).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Email Type Distribution */}
      {summary.byType && summary.byType.length > 0 && (
        <div className={`${theme.colors.card} p-4 rounded-xl border ${theme.colors.border}`}>
          <p className={`text-sm font-medium ${theme.colors.text} mb-3`}>
            📈 Email Type Distribution
          </p>
          <div className="flex flex-wrap gap-2">
            {summary.byType.map((type) => (
              <span
                key={type._id || 'unknown'}
                className={`px-3 py-1 rounded-full text-xs ${theme.colors.border} ${theme.colors.text}`}
              >
                {type._id || 'Unknown'}: {type.count}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailStats;