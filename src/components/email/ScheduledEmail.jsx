// frontend/src/pages/ScheduledEmail.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchEmails, 
  deleteEmail, 
  setFilters,
  resetFilters,
  fetchEmailStats,
  setLocalSearchResults
} from '../../store/slices/emailSlice';
import { useTheme } from '../../themes/ThemeProvider';
import { FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import EmailFilters from './EmailFilters';
import EmailStats from './EmailStats';
import EmailPagination from './EmailPagination';
import EmailList from './EmailList';

const ScheduledEmail = () => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  
  // Redux state
  const { 
    emails, 
    loading, 
    loadingStats,
    pagination, 
    filters,
    error,
    deletingId,
    summary
  } = useSelector((state) => state.emails);
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Memoize filtered emails for local search
  const filteredEmails = useMemo(() => {
    const search = filters.search?.trim().toLowerCase();
    if (!search) return emails;
    
    const results = emails.filter((email) => {
      return (
        email.subject?.toLowerCase().includes(search) ||
        email.toEmail?.toLowerCase().includes(search) ||
        email.emailType?.toLowerCase().includes(search) ||
        email.status?.toLowerCase().includes(search) ||
        email.invoiceId?.invoiceNumber?.toLowerCase().includes(search) ||
        email.invoiceId?.clientName?.toLowerCase().includes(search)
      );
    });
    
    dispatch(setLocalSearchResults(results));
    return results;
  }, [emails, filters.search, dispatch]);

  // Initial load - runs once
  useEffect(() => {
    dispatch(fetchEmails(filters));
    dispatch(fetchEmailStats());
  }, []); // Empty dependency - runs once

  // Handle filter changes
  useEffect(() => {
    // Skip initial load
    if (loading) return;
    
    // Debounce search
    const timer = setTimeout(() => {
      dispatch(fetchEmails(filters));
    }, 500);

    return () => clearTimeout(timer);
  }, [
    filters.search,
    filters.status,
    filters.emailType,
    filters.startDate,
    filters.endDate,
    filters.sortBy,
    filters.sortOrder,
    filters.page,
    filters.limit
  ]);

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this scheduled email?')) return;
    try {
      await dispatch(deleteEmail(id)).unwrap();
      toast.success('Email deleted successfully!');
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete email');
    }
  };

  // Handle apply filters
  const handleApplyFilters = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  // Handle reset filters
 const handleResetFilters = () => {
  const resetData = {
    page: 1,
    limit: pagination.limit,
    search: "",
    status: "",
    emailType: "",
    startDate: "",
    endDate: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  };

  dispatch(resetFilters());
  dispatch(fetchEmails(resetData));
};

  // Handle refresh
  const handleRefresh = () => {
    dispatch(fetchEmails(filters));
    dispatch(fetchEmailStats());
    toast.success('Refreshed email list');
  };

  // Show error
  if (error && !loading) {
    return (
      <div className={`${theme.colors.card} p-6 rounded-2xl border ${theme.colors.border}`}>
        <div className="text-center text-red-500">
          <p className="text-lg font-semibold">Error loading emails</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 ${theme.colors.card} p-4 md:p-6 rounded-2xl border ${theme.colors.border}`}>
        <div>
          <h1 className={`text-xl md:text-2xl lg:text-3xl font-bold ${theme.colors.text}`}>
            📨 Scheduled Emails
          </h1>
          <p className={`text-sm ${theme.colors.text} opacity-70 mt-1`}>
            Manage and track all your scheduled email communications
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`${theme.colors.button} text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl flex items-center gap-2 hover:scale-105 transition-all text-sm md:text-base w-full sm:w-auto justify-center disabled:opacity-50`}
          >
            {loading ? <FaSpinner className="animate-spin" /> : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={loadingStats ? 'opacity-50 pointer-events-none' : ''}>
        <EmailStats summary={summary} loadingStats={loadingStats} />
      </div>

      {/* Filters */}
      <EmailFilters 
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      {/* Email List */}
      <EmailList 
        emails={filteredEmails}
        loading={loading}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      {/* Pagination */}
      <EmailPagination />
    </div>
  );
};

export default ScheduledEmail;