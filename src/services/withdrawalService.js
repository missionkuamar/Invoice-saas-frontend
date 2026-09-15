// frontend/src/services/withdrawalService.js
import api, { get, post, put, del } from './api';

/**
 * Withdrawal API Service
 * Handles all withdrawal-related API calls
 */
export const withdrawalService = {
  // ============================================================
  // ✅ ADMIN ENDPOINTS
  // ============================================================

  /**
   * Get all withdrawals with filtering and pagination
   * @param {Object} params - Query parameters
   * @param {string} params.status - Filter by status
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.search - Search term
   * @param {string} params.startDate - Start date filter
   * @param {string} params.endDate - End date filter
   * @param {string} params.sortBy - Sort field
   * @param {string} params.sortOrder - Sort order (asc/desc)
   */
  getAll: (params) => get('/admin/withdrawals', params),

  /**
   * Get single withdrawal by ID
   * @param {string} id - Withdrawal ID
   */
  getById: (id) => get(`/admin/withdrawals/${id}`),

  /**
   * Update withdrawal status
   * @param {string} id - Withdrawal ID
   * @param {Object} data - Update data
   * @param {string} data.status - New status
   * @param {string} data.transactionId - Transaction ID (for completed)
   * @param {string} data.notes - Admin notes
   */
  update: (id, data) => put(`/admin/withdrawals/${id}`, data),

  /**
   * Bulk process withdrawals
   * @param {Object} data - Bulk process data
   * @param {string[]} data.withdrawalIds - Array of withdrawal IDs
   * @param {string} data.status - Status to set
   * @param {string} data.notes - Admin notes
   */
  bulkProcess: (data) => post('/admin/withdrawals/bulk', data),

  /**
   * Get withdrawal statistics
   * @param {Object} params - Query parameters
   * @param {string} params.period - Period (day/week/month/year)
   */
  getStats: (params) => get('/admin/withdrawals/stats', params),

  /**
   * Export withdrawals as CSV
   * @param {Object} params - Query parameters
   */
  export: (params) => get('/admin/withdrawals/export', params),

  /**
   * Cancel a pending withdrawal
   * @param {string} id - Withdrawal ID
   */
  cancel: (id) => del(`/admin/withdrawals/${id}`),

  // ============================================================
  // ✅ AFFILIATE ENDPOINTS
  // ============================================================

  /**
   * Get affiliate's own withdrawals
   * @param {Object} params - Query parameters
   */
  getMyWithdrawals: (params) => get('/affiliate/withdrawals', params),

  /**
   * Request a withdrawal
   * @param {Object} data - Withdrawal request data
   * @param {number} data.amount - Amount to withdraw
   * @param {string} data.paymentMethod - Payment method
   * @param {Object} data.paymentDetails - Payment details
   */
  requestWithdrawal: (data) => post('/affiliate/withdrawals', data),

  /**
   * Get withdrawal history
   * @param {Object} params - Query parameters
   */
  getWithdrawalHistory: (params) => get('/affiliate/withdrawals/history', params),
};

// Default export for convenience
export default withdrawalService;