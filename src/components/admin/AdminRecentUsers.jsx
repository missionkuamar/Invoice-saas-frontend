// frontend/src/components/admin/AdminRecentUsers.jsx
import React from 'react';
import { FaUserPlus, FaUserCheck, FaUserClock } from 'react-icons/fa';
import { useTheme } from '../../themes/ThemeProvider';
import { Link } from 'react-router-dom';

const AdminRecentUsers = ({ users }) => {
  const { theme } = useTheme();

  const getPlanBadge = (plan) => {
    const config = {
      free: { color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300', icon: FaUserClock },
      pro: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: FaUserCheck },
      enterprise: { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: FaUserCheck },
    };
    const style = config[plan] || config.free;
    const Icon = style.icon;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${style.color} flex items-center gap-1`}>
        <Icon size={10} /> {plan.toUpperCase()}
      </span>
    );
  };

  return (
    <div className={`${theme.colors.card} rounded-2xl p-4 md:p-6 border ${theme.colors.border}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-base md:text-lg font-semibold ${theme.colors.text} flex items-center gap-2`}>
          <FaUserPlus className="text-blue-500" />
          Recent Users
        </h3>
        <Link 
          to="/admin/users" 
          className={`text-sm ${theme.colors.primary} hover:underline`}
        >
          View All →
        </Link>
      </div>

      <div className="space-y-3">
        {users?.length === 0 ? (
          <div className={`text-center py-8 ${theme.colors.text} opacity-60`}>
            <p className="text-sm">No recent users</p>
          </div>
        ) : (
          users?.slice(0, 5).map((user) => (
            <div key={user._id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl ${theme.colors.background} border ${theme.colors.border}`}>
              <div className="min-w-0">
                <p className={`font-medium ${theme.colors.text} truncate`}>{user.name}</p>
                <p className={`text-xs md:text-sm ${theme.colors.text} opacity-60 truncate`}>{user.email}</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {getPlanBadge(user.subscription?.plan)}
                <span className={`text-xs ${theme.colors.text} opacity-40`}>
                  {new Date(user.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminRecentUsers;