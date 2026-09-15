// frontend/src/components/emails/EmailPagination.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPage, setLimit, fetchEmails } from '../../store/slices/emailSlice';
import { useTheme } from '../../themes/ThemeProvider';

const EmailPagination = () => {
  const dispatch = useDispatch();
  const { pagination, filters, loading } = useSelector((state) => state.emails);
  const { theme } = useTheme();

  const { currentPage, totalPages, totalItems, itemsPerPage, hasNextPage, hasPrevPage } = pagination;

  if (!totalItems || totalItems === 0 || totalPages <= 1) {
    return null;
  }

  const handlePageChange = (page) => {
    if (page === currentPage) return;
    if (page < 1 || page > totalPages) return;
    
    dispatch(setPage(page));
    dispatch(fetchEmails({ ...filters, page }));
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    dispatch(setLimit(newLimit));
    dispatch(fetchEmails({ ...filters, limit: newLimit, page: 1 }));
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (loading) return null;

  return (
    <div className={`${theme.colors.card} p-4 rounded-xl border ${theme.colors.border} mt-4`}>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Items info */}
        <p className={`text-sm ${theme.colors.text} opacity-70`}>
          Showing {startItem} to {endItem} of {totalItems} emails
        </p>

        {/* Pagination controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* First Page */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={`px-2 py-1.5 rounded-lg border ${theme.colors.border} ${theme.colors.text} ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            } transition-all`}
          >
            «
          </button>

          {/* Previous */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            className={`px-3 py-1.5 rounded-lg border ${theme.colors.border} ${theme.colors.text} ${
              !hasPrevPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            } transition-all`}
          >
            ◀
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && handlePageChange(page)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                page === currentPage
                  ? `${theme.colors.button} text-white`
                  : page === '...'
                  ? 'bg-transparent cursor-default text-gray-500'
                  : `border ${theme.colors.border} ${theme.colors.text} hover:bg-gray-100 dark:hover:bg-gray-700`
              }`}
              disabled={page === '...'}
            >
              {page}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className={`px-3 py-1.5 rounded-lg border ${theme.colors.border} ${theme.colors.text} ${
              !hasNextPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            } transition-all`}
          >
            ▶
          </button>

          {/* Last Page */}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-2 py-1.5 rounded-lg border ${theme.colors.border} ${theme.colors.text} ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            } transition-all`}
          >
            »
          </button>
        </div>
      </div>

      {/* Items per page selector */}
      <div className="flex justify-center items-center mt-3 gap-2">
        <label className={`text-sm ${theme.colors.text} opacity-70`}>Items per page:</label>
        <select
          value={itemsPerPage}
          onChange={handleLimitChange}
          className={`px-2 py-1 rounded-lg border ${theme.colors.border} ${theme.colors.background} ${theme.colors.text} focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-100 `}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
};

export default EmailPagination;