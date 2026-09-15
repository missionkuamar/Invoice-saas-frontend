// frontend/src/components/affiliate/CreateLinkModal.jsx
import React from 'react';
import { FaLink, FaTimes, FaPlus, FaSpinner } from 'react-icons/fa';
import { useTheme } from '../../themes/ThemeProvider';

const CreateLinkModal = ({ isOpen, onClose, newLink, setNewLink, onSubmit, isCreating }) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-3 md:px-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
        <div className={`relative ${theme.colors.card} rounded-2xl shadow-2xl max-w-md w-full p-4 md:p-6 border ${theme.colors.border}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${theme.colors.text} flex items-center gap-2`}>
              <FaLink className={theme.colors.primary} />
              Create Affiliate Link
            </h3>
            <button
              onClick={onClose}
              className={`${theme.colors.text} opacity-60 hover:opacity-100`}
            >
              <FaTimes />
            </button>
          </div>
          <form onSubmit={onSubmit}>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                  Link Name *
                </label>
                <input
                  type="text"
                  value={newLink.name}
                  onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                  className={`w-full px-3 md:px-4 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                  placeholder="e.g., Homepage Link"
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                  Destination URL *
                </label>
                <input
                  type="url"
                  value={newLink.destination}
                  onChange={(e) => setNewLink({ ...newLink, destination: e.target.value })}
                  className={`w-full px-3 md:px-4 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                  placeholder="https://example.com/page"
                  required
                />
                <p className={`text-xs ${theme.colors.text} opacity-60 mt-1`}>
                  Where users will be redirected after clicking
                </p>
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                  Custom Slug (Optional)
                </label>
                <input
                  type="text"
                  value={newLink.slug}
                  onChange={(e) => setNewLink({ ...newLink, slug: e.target.value })}
                  className={`w-full px-3 md:px-4 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                  placeholder="my-link"
                />
                <p className={`text-xs ${theme.colors.text} opacity-60 mt-1`}>
                  Leave blank for auto-generated slug
                </p>
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
                disabled={isCreating}
                className={`${theme.colors.button} text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-all text-sm w-full sm:w-auto disabled:opacity-50`}
              >
                {isCreating ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FaPlus /> Create Link
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateLinkModal;