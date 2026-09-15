import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch invoices with filters
export const fetchInvoices = createAsyncThunk(
  'invoices/fetchAll',
  async (filters = {}, { rejectWithValue, getState }) => {
    try {
      const { invoices } = getState();
      const params = { ...invoices.filters, ...filters };
      
      // Remove empty values
      Object.keys(params).forEach(key => {
        if (!params[key] || params[key] === '') {
          delete params[key];
        }
      });
      
      const response = await api.get('/invoices', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch invoices');
    }
  }
);

export const createInvoice = createAsyncThunk(
  'invoices/create',
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await api.post('/invoices', invoiceData);
      console.log(response);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create invoice');
    }
  }
);

export const updateInvoice = createAsyncThunk(
  'invoices/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/invoices/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update invoice');
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  'invoices/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/invoices/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete invoice');
    }
  }
);

export const fetchInvoiceById = createAsyncThunk(
  'invoices/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/invoices/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch invoice');
    }
  }
);

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState: {
    invoices: [],
    selectedInvoice: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      pages: 0,
    },
    loading: false,
    error: null,
    filters: {
      search: '',
      status: '',
      clientName: '',
      clientEmail: '',
      invoiceNumber: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    },
    // Cache for search results
    searchCache: {},
    // Track if we're in offline search mode
    isOfflineSearch: false,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset to page 1 when filters change
      state.pagination.page = 1;
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        status: '',
        clientName: '',
        clientEmail: '',
        invoiceNumber: '',
        startDate: '',
        endDate: '',
        minAmount: '',
        maxAmount: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };
      state.pagination.page = 1;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1;
    },
    clearSelectedInvoice: (state) => {
      state.selectedInvoice = null;
    },
    setOfflineSearch: (state, action) => {
      state.isOfflineSearch = action.payload;
    },
    // Local search in Redux (offline search)
    localSearch: (state, action) => {
      const { query } = action.payload;
      if (!query || query.trim() === '') {
        // If search is empty, fetch from API
        state.isOfflineSearch = false;
        return;
      }

      const searchTerm = query.toLowerCase().trim();
      
      // Search in existing invoices
      const results = state.invoices.filter(invoice => {
        const searchableFields = [
          invoice.invoiceNumber,
          invoice.client?.name,
          invoice.client?.email,
          invoice.client?.phone,
        ];
        
        return searchableFields.some(field => 
          field && field.toLowerCase().includes(searchTerm)
        );
      });

      // Update invoices with search results
      if (results.length > 0) {
        state.isOfflineSearch = true;
        state.invoices = results;
        state.pagination.total = results.length;
        state.pagination.pages = Math.ceil(results.length / state.pagination.limit);
      } else {
        // If no results in Redux, fetch from API
        state.isOfflineSearch = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isOfflineSearch = false;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload.invoices;
        state.pagination = action.payload.pagination;
        state.isOfflineSearch = false;
        // Cache the results
        if (state.filters.search) {
          state.searchCache[state.filters.search] = action.payload;
        }
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isOfflineSearch = false;
      })
      // Fetch Invoice By ID
      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedInvoice = action.payload;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Invoice
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.invoices.unshift(action.payload);
        state.pagination.total += 1;
        state.pagination.pages = Math.ceil(state.pagination.total / state.pagination.limit);
      })
      // Update Invoice
      .addCase(updateInvoice.fulfilled, (state, action) => {
        const index = state.invoices.findIndex(
          inv => inv._id === action.payload._id
        );
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
        if (state.selectedInvoice?._id === action.payload._id) {
          state.selectedInvoice = action.payload;
        }
      })
      // Delete Invoice
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.invoices = state.invoices.filter(
          inv => inv._id !== action.payload
        );
        state.pagination.total -= 1;
        state.pagination.pages = Math.ceil(state.pagination.total / state.pagination.limit);
        if (state.selectedInvoice?._id === action.payload) {
          state.selectedInvoice = null;
        }
      });
  },
});

export const { 
  setFilters, 
  clearFilters, 
  setPage, 
  setLimit,
  clearSelectedInvoice,
  setOfflineSearch,
  localSearch,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;