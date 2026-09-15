// frontend/src/components/admin/users/AdminUserEditModal.jsx
import React from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import { useTheme } from '../../../themes/ThemeProvider';

const AdminUserEditModal = ({ 
  isOpen, 
  onClose, 
  selectedUser, 
  setSelectedUser, 
  onSubmit,
  loading 
}) => {
  const { theme } = useTheme();

  if (!isOpen || !selectedUser) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-3 md:px-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
        <div className={`relative ${theme.colors.card} rounded-2xl shadow-2xl max-w-md w-full p-4 md:p-6 border ${theme.colors.border}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${theme.colors.text}`}>Edit User</h3>
            <button onClick={onClose} className={`${theme.colors.text} opacity-60 hover:opacity-100`}>
              <FaTimes />
            </button>
          </div>

          <form onSubmit={onSubmit}>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                  Name
                </label>
                <input
                  type="text"
                  value={selectedUser.name || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                  Email
                </label>
                <input
                  type="email"
                  value={selectedUser.email || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                  Role
                </label>
                <select
                  value={selectedUser.role || 'user'}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                  Plan
                </label>
                <select
                  value={selectedUser.subscription?.plan || 'free'}
                  onChange={(e) => setSelectedUser({
                    ...selectedUser,
                    subscription: { ...selectedUser.subscription, plan: e.target.value }
                  })}
                  className={`w-full px-4 py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                >
                  <option value="free">Free</option>
                  <option value="basic">Basic</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                  Subscription Status
                </label>
                <select
                  value={selectedUser.subscription?.status || 'inactive'}
                  onChange={(e) => setSelectedUser({
                    ...selectedUser,
                    subscription: { ...selectedUser.subscription, status: e.target.value }
                  })}
                  className={`w-full px-4 py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                >
                  <option value="inactive">Inactive</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                  Status
                </label>
                <select
                  value={selectedUser.isActive ? 'true' : 'false'}
                  onChange={(e) => setSelectedUser({ ...selectedUser, isActive: e.target.value === 'true' })}
                  className={`w-full px-4 py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-colors text-sm w-full sm:w-auto`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`${theme.colors.button} text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-all text-sm w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminUserEditModal;