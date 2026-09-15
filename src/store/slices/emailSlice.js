// frontend/src/store/slices/emailSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import toast from 'react-hot-toast';

// Initial state
const initialState = {
  emails: [],
  stats: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filters: {
    search: '',
    status: '',
    emailType: '',
    startDate: '',
    endDate: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  },
  loading: false,
  loadingStats: false,
  deletingId: null,
  error: null,
  selectedEmail: null,
  summary: null,
  localSearchResults: [],
};

// Fetch emails with filters and pagination
export const fetchEmails = createAsyncThunk(
  'emails/fetchEmails',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search || '',
        status: params.status || '',
        emailType: params.emailType || '',
        startDate: params.startDate || '',
        endDate: params.endDate || '',
        sortBy: params.sortBy || 'createdAt',
        sortOrder: params.sortOrder || 'desc'
      });
console.log("queryParams :" , queryParams);
      const response = await api.get(`/emails/my-emails?${queryParams}`);
      console.log("response :" , response)
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch emails';
      toast.error(errorMessage);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Fetch email by ID
export const fetchEmailById = createAsyncThunk(
  'emails/fetchEmailById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/emails/${id}`);
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch email details';
      toast.error(errorMessage);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Delete email
export const deleteEmail = createAsyncThunk(
  'emails/deleteEmail',
  async (id, { rejectWithValue, dispatch, getState }) => {
    try {
      await api.delete(`/emails/${id}`);
      toast.success('Email deleted successfully!');
      
      // Get current state for pagination and filters
      const state = getState();
      const { filters } = state.emails;
      
      // Refresh the list with current filters
      await dispatch(fetchEmails(filters));
      
      return id;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete email';
      toast.error(errorMessage);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Fetch email stats summary
export const fetchEmailStats = createAsyncThunk(
  'emails/fetchEmailStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/emails/stats/summary');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Email slice
const emailSlice = createSlice({
  name: 'emails',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filters.page = 1; // Reset to first page when filters change
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
    setLimit: (state, action) => {
      state.filters.limit = action.payload;
      state.filters.page = 1;
    },
    clearSelectedEmail: (state) => {
      state.selectedEmail = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLocalSearchResults: (state, action) => {
      state.localSearchResults = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch emails
      .addCase(fetchEmails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmails.fulfilled, (state, action) => {
        state.loading = false;
        state.emails = action.payload.data || [];
        state.stats = action.payload.stats || null;
        state.pagination = {
          currentPage: action.payload.pagination?.page || 1,
          totalPages: action.payload.pagination?.totalPages || 1,
          totalItems: action.payload.pagination?.total || 0,
          itemsPerPage: action.payload.pagination?.limit || 10,
          hasNextPage: action.payload.pagination?.hasNext || false,
          hasPrevPage: action.payload.pagination?.hasPrev || false,
        };
        // Update filters from response if provided
        if (action.payload.filters) {
          state.filters = { ...state.filters, ...action.payload.filters };
        }
      })
      .addCase(fetchEmails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch emails';
        state.emails = [];
      })
      
      // Fetch email by ID
      .addCase(fetchEmailById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmailById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEmail = action.payload;
      })
      .addCase(fetchEmailById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch email details';
      })
      
      // Delete email
      .addCase(deleteEmail.pending, (state, action) => {
        state.deletingId = action.meta.arg;
        state.error = null;
      })
      .addCase(deleteEmail.fulfilled, (state) => {
        state.deletingId = null;
      })
      .addCase(deleteEmail.rejected, (state) => {
        state.deletingId = null;
      })
      
      // Fetch email stats
      .addCase(fetchEmailStats.pending, (state) => {
        state.loadingStats = true;
      })
      .addCase(fetchEmailStats.fulfilled, (state, action) => {
        state.loadingStats = false;
        state.summary = action.payload;
      })
      .addCase(fetchEmailStats.rejected, (state) => {
        state.loadingStats = false;
      });
  }
});

export const { 
  setFilters, 
  resetFilters, 
  setPage, 
  setLimit, 
  clearSelectedEmail, 
  clearError,
  setLocalSearchResults
} = emailSlice.actions;

export default emailSlice.reducer;