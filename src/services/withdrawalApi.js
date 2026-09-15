// frontend/src/services/withdrawalApi.js
import axios from 'axios';
import { get, post, put, del } from './api';

// Get API URL from environment
const API_URL = import.meta.env.VITE_API_URL_API || 'https://invoice-saas-backend-58pc.onrender.com/api';

// Create a separate axios instance for withdrawal endpoints
const withdrawalAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000,
  withCredentials: true,
});

// Add token interceptor
withdrawalAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
withdrawalAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific withdrawal errors
    if (error.response?.status === 403) {
      //console.error('Withdrawal permission error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// ============================================================
// ✅ ADMIN WITHDRAWAL ENDPOINTS
// ============================================================

export const adminWithdrawalAPI = {
  /**
   * Get all withdrawal requests with filtering and pagination
   * @param {Object} params - Query parameters
   * @param {string} params.status - Filter by status (pending, approved, completed, failed)
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.search - Search by user name or email
   * @param {string} params.startDate - Start date filter
   * @param {string} params.endDate - End date filter
   * @param {string} params.sortBy - Sort field
   * @param {string} params.sortOrder - Sort order (asc/desc)
   * @param {number} params.minAmount - Minimum amount filter
   * @param {number} params.maxAmount - Maximum amount filter
   * @param {string} params.paymentMethod - Filter by payment method
   */
  getAll: (params) => get('/admin/withdrawals', params),
  
  /**
   * Get single withdrawal details by ID
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
   * @param {Object} data.paymentDetails - Additional payment details
   */
  update: (id, data) => put(`/admin/withdrawals/${id}`, data),
  
  /**
   * Bulk process multiple withdrawals
   * @param {Object} data - Bulk process data
   * @param {string[]} data.withdrawalIds - Array of withdrawal IDs
   * @param {string} data.status - Status to apply
   * @param {string} data.notes - Admin notes
   */
  bulkProcess: (data) => post('/admin/withdrawals/bulk', data),
  
  /**
   * Get withdrawal statistics
   * @param {Object} params - Query parameters
   * @param {string} params.period - Period (day, week, month, year)
   */
  getStats: (params) => get('/admin/withdrawals/stats', params),
  
  /**
   * Export withdrawals as CSV
   * @param {Object} params - Query parameters
   * @param {string} params.status - Filter by status
   * @param {string} params.startDate - Start date
   * @param {string} params.endDate - End date
   */
  export: (params) => get('/admin/withdrawals/export', params),
  
  /**
   * Cancel a pending withdrawal
   * @param {string} id - Withdrawal ID
   */
  cancel: (id) => del(`/admin/withdrawals/${id}`),
};

// ============================================================
// ✅ AFFILIATE WITHDRAWAL ENDPOINTS
// ============================================================

export const affiliateWithdrawalAPI = {
  /**
   * Get affiliate's own withdrawals
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.status - Filter by status
   */
  getMyWithdrawals: (params) => get('/affiliate/withdrawals', params),
  
  /**
   * Request a new withdrawal
   * @param {Object} data - Withdrawal request data
   * @param {number} data.amount - Amount to withdraw
   * @param {string} data.paymentMethod - Payment method (bank, upi, paypal, razorpay)
   * @param {Object} data.paymentDetails - Payment details
   */
  requestWithdrawal: (data) => post('/affiliate/withdrawals', data),
  
  /**
   * Get withdrawal history
   * @param {Object} params - Query parameters
   */
  getWithdrawalHistory: (params) => get('/affiliate/withdrawals/history', params),
  
  /**
   * Check eligibility for withdrawal
   * @param {Object} params - Query parameters
   */
  checkEligibility: () => get('/affiliate/withdrawals/eligibility'),
  
  /**
   * Get withdrawal limits
   */
  getLimits: () => get('/affiliate/withdrawals/limits'),
};

// ============================================================
// ✅ EXPORT ALL
// ============================================================

export const withdrawalAPI = {
  ...adminWithdrawalAPI,
  ...affiliateWithdrawalAPI,
};

// For backward compatibility
export default withdrawalAPI;