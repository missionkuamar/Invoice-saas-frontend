// frontend/src/services/api.js
import axios from 'axios';
import toast from 'react-hot-toast';

// Get API URL from environment or use default
const API_URL = import.meta.env.VITE_API_URL_API || 'https://invoice-saas-backend-58pc.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (import.meta.env.DEV) {
      // console.log('📤 API Request:', {
      //   method: config.method?.toUpperCase(),
      //   url: config.url,
      //   data: config.data,
      //   params: config.params,
      // });
    }
    
    return config;
  },
  (error) => {
   // console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      // console.log('📥 API Response:', {
      //   status: response.status,
      //   url: response.config.url,
      //   data: response.data,
      // });
    }
    return response;
  },
  (error) => {
    // console.error('API Error:', {
    //   message: error.message,
    //   status: error.response?.status,
    //   data: error.response?.data,
    //   config: error.config,
    // });

    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        localStorage.removeItem('token');
        if (!window.location.pathname.includes('/login')) {
          toast.error('Session expired. Please login again.');
          window.location.href = '/login';
        }
      }
      
      if (status === 404) {
        if (!error.config.url.includes('/company')) {
        //  toast.error(data?.message || '');
        }
      }
      
      if (status === 403) {
        toast.error(data?.message || 'You do not have permission to perform this action');
      }
      
      if (status === 429) {
        toast.error('Too many requests. Please try again later.');
      }
      
      if (status >= 500) {
        toast.error('Server error. Please try again later.');
      }
      
      return Promise.reject({
        status,
        message: data?.message || 'An error occurred',
        data: data,
      });
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject({
        message: 'Network error - No response from server',
        request: error.request,
      });
    } else {
      toast.error(error.message || 'An unexpected error occurred');
      return Promise.reject({
        message: error.message || 'Unknown error',
      });
    }
  }
);

// Helper function to handle API calls
export const apiCall = async (method, url, data = null, params = null) => {
  try {
    const config = { method, url, params };
    if (data) config.data = data;
    const response = await api(config);
    return response.data;
  } catch (error) {
   // console.error(`API Call Error (${method} ${url}):`, error);
   toast.error(error.message || 'Internal server error');
    throw error;
  }
};

// ============================================================
// ✅ HTTP METHOD SHORTCUTS
// ============================================================

export const get = (url, params) => apiCall('get', url, null, params);
export const post = (url, data) => apiCall('post', url, data);
export const put = (url, data) => apiCall('put', url, data);
export const del = (url) => apiCall('delete', url);

// ============================================================
// ✅ AUTH API
// ============================================================

export const authAPI = {
  login: (credentials) => post('/auth/login', credentials),
  register: (userData) => post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getProfile: () => get('/auth/profile'),
  updateProfile: (data) => put('/auth/profile', data),
  changePassword: (data) => put('/auth/change-password', data),
  forgotPassword: (email) => post('/auth/forgot-password', { email }),
  resetPassword: (data) => post('/auth/reset-password', data),
};

// ============================================================
// ✅ COMPANY API
// ============================================================

export const companyAPI = {
  getProfile: () => get('/company'),
  updateProfile: (data) => put('/company', data),
  uploadLogo: (file) => {
    const formData = new FormData();
    formData.append('logo', file);
    return api.post('/company/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteLogo: () => del('/company/logo'),
  addTax: (data) => post('/company/tax', data),
  updateTax: (taxId, data) => put(`/company/tax/${taxId}`, data),
  deleteTax: (taxId) => del(`/company/tax/${taxId}`),
};

// ============================================================
// ✅ WITHDRAWAL API (NEW)
// ============================================================

export const withdrawalAPI = {
  // Admin endpoints
  getAll: (params) => get('/admin/withdrawals', params),
  getById: (id) => get(`/admin/withdrawals/${id}`),
  update: (id, data) => put(`/admin/withdrawals/${id}`, data),
  bulkProcess: (data) => post('/admin/withdrawals/bulk', data),
  getStats: (params) => get('/admin/withdrawals/stats', params),
  export: (params) => get('/admin/withdrawals/export', params),
  cancel: (id) => del(`/admin/withdrawals/${id}`),
  
  // Affiliate endpoints
  getMyWithdrawals: (params) => get('/affiliate/withdrawals', params),
  requestWithdrawal: (data) => post('/affiliate/withdrawals', data),
  getWithdrawalHistory: (params) => get('/affiliate/withdrawals/history', params),
};

// ============================================================
// ✅ INVOICE API
// ============================================================

export const invoiceAPI = {
  getAll: (params) => get('/invoices', params),
  getById: (id) => get(`/invoices/${id}`),
  create: (data) => post('/invoices', data),
  update: (id, data) => put(`/invoices/${id}`, data),
  delete: (id) => del(`/invoices/${id}`),
  send: (id) => post(`/invoices/${id}/send`),
  getStats: () => get('/invoices/stats'),
};

// ============================================================
// ✅ AFFILIATE API
// ============================================================

export const affiliateAPI = {
  getDashboard: (params) => get('/affiliate/dashboard', params),
  getEarnings: (params) => get('/affiliate/earnings', params),
  getReferrals: (params) => get('/affiliate/referrals', params),
  getWithdrawals: (params) => get('/affiliate/withdrawals', params),
  requestWithdrawal: (data) => post('/affiliate/withdrawals', data),
  getSettings: () => get('/affiliate/settings'),
  updateSettings: (data) => put('/affiliate/settings', data),
};

// ============================================================
// ✅ USER API (Admin)
// ============================================================

export const userAPI = {
  getAll: (params) => get('/admin/users', params),
  getById: (id) => get(`/admin/users/${id}`),
  update: (id, data) => put(`/admin/users/${id}`, data),
  delete: (id) => del(`/admin/users/${id}`),
  updateStatus: (id, status) => put(`/admin/users/${id}/status`, { status }),
  getStats: () => get('/admin/users/stats'),
};

// ============================================================
// ✅ NOTIFICATION API
// ============================================================

export const notificationAPI = {
  getAll: (params) => get('/notifications', params),
  getUnreadCount: () => get('/notifications/unread/count'),
  markAsRead: (id) => put(`/notifications/${id}/read`),
  markAllAsRead: () => put('/notifications/read-all'),
  delete: (id) => del(`/notifications/${id}`),
  deleteAll: () => del('/notifications'),
};

// ============================================================
// ✅ EXPORT ALL
// ============================================================

export default api;
