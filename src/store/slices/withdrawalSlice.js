// frontend/src/store/slices/withdrawalSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { withdrawalAPI } from '../../services/api';

// ============================================================
// ✅ ASYNC THUNKS
// ============================================================

// Fetch all withdrawals (admin)
export const fetchWithdrawals = createAsyncThunk(
  'withdrawals/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await withdrawalAPI.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch withdrawals');
    }
  }
);

// Fetch single withdrawal (admin)
export const fetchWithdrawalById = createAsyncThunk(
  'withdrawals/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await withdrawalAPI.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch withdrawal');
    }
  }
);

// Approve withdrawal (admin)
export const approveWithdrawal = createAsyncThunk(
  'withdrawals/approve',
  async ({ id, notes }, { rejectWithValue }) => {
    try {
      const response = await withdrawalAPI.update(id, {
        status: 'approved',
        notes,
      });
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to approve withdrawal');
    }
  }
);

// Complete withdrawal (admin)
export const completeWithdrawal = createAsyncThunk(
  'withdrawals/complete',
  async ({ id, transactionId, notes }, { rejectWithValue }) => {
    try {
      const response = await withdrawalAPI.update(id, {
        status: 'completed',
        transactionId,
        notes,
      });
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to complete withdrawal');
    }
  }
);

// Reject withdrawal (admin)
export const rejectWithdrawal = createAsyncThunk(
  'withdrawals/reject',
  async ({ id, notes }, { rejectWithValue }) => {
    try {
      const response = await withdrawalAPI.update(id, {
        status: 'failed',
        notes,
      });
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to reject withdrawal');
    }
  }
);

// Cancel withdrawal (admin)
export const cancelWithdrawal = createAsyncThunk(
  'withdrawals/cancel',
  async (id, { rejectWithValue }) => {
    try {
      const response = await withdrawalAPI.cancel(id);
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to cancel withdrawal');
    }
  }
);

// Bulk process withdrawals (admin)
export const bulkProcessWithdrawals = createAsyncThunk(
  'withdrawals/bulkProcess',
  async ({ withdrawalIds, status, notes }, { rejectWithValue }) => {
    try {
      const response = await withdrawalAPI.bulkProcess({
        withdrawalIds,
        status,
        notes,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to process withdrawals');
    }
  }
);

// Get withdrawal stats (admin)
export const fetchWithdrawalStats = createAsyncThunk(
  'withdrawals/fetchStats',
  async (params, { rejectWithValue }) => {
    try {
      const response = await withdrawalAPI.getStats(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch stats');
    }
  }
);

// Export withdrawals (admin)
export const exportWithdrawals = createAsyncThunk(
  'withdrawals/export',
  async (params, { rejectWithValue }) => {
    try {
      const response = await withdrawalAPI.export(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to export withdrawals');
    }
  }
);

// ============================================================
// ✅ INITIAL STATE
// ============================================================

const initialState = {
  withdrawals: [],
  selectedWithdrawal: null,
  withdrawalHistory: [],
  stats: {
    breakdown: [],
    pendingCount: 0,
    pendingTotal: 0,
    completedCount: 0,
    completedTotal: 0,
    failedCount: 0,
    failedTotal: 0,
    approvedCount: 0,
    approvedTotal: 0,
    totalRequests: 0,
    totalWithdrawn: 0,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false,
  },
  loading: false,
  processing: false,
  error: null,
  exportLoading: false,
  totalWithdrawals: 0,
  lastFetched: null,
};

// ============================================================
// ✅ SLICE
// ============================================================

const withdrawalSlice = createSlice({
  name: 'withdrawals',
  initialState,
  reducers: {
    clearWithdrawalError: (state) => {
      state.error = null;
    },
    resetWithdrawalState: (state) => {
      state.selectedWithdrawal = null;
      state.error = null;
      state.loading = false;
      state.processing = false;
    },
    updatePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearWithdrawals: (state) => {
      state.withdrawals = [];
      state.totalWithdrawals = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH ALL
      .addCase(fetchWithdrawals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWithdrawals.fulfilled, (state, action) => {
        state.loading = false;
        state.withdrawals = action.payload.withdrawals || [];
        state.stats = action.payload.stats || initialState.stats;
        state.pagination = action.payload.pagination || initialState.pagination;
        state.totalWithdrawals = action.payload.withdrawals?.length || 0;
        state.lastFetched = Date.now();
      })
      .addCase(fetchWithdrawals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // FETCH BY ID
      .addCase(fetchWithdrawalById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWithdrawalById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedWithdrawal = action.payload.withdrawal;
        state.withdrawalHistory = action.payload.history || [];
      })
      .addCase(fetchWithdrawalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // APPROVE
      .addCase(approveWithdrawal.pending, (state) => {
        state.processing = true;
        state.error = null;
      })
      .addCase(approveWithdrawal.fulfilled, (state, action) => {
        state.processing = false;
        const index = state.withdrawals.findIndex(w => w._id === action.payload.id);
        if (index !== -1) {
          state.withdrawals[index] = action.payload.data.data;
        }
        if (state.selectedWithdrawal?._id === action.payload.id) {
          state.selectedWithdrawal = action.payload.data.data;
        }
      })
      .addCase(approveWithdrawal.rejected, (state, action) => {
        state.processing = false;
        state.error = action.payload;
      })
      
      // COMPLETE
      .addCase(completeWithdrawal.pending, (state) => {
        state.processing = true;
        state.error = null;
      })
      .addCase(completeWithdrawal.fulfilled, (state, action) => {
        state.processing = false;
        const index = state.withdrawals.findIndex(w => w._id === action.payload.id);
        if (index !== -1) {
          state.withdrawals[index] = action.payload.data.data;
        }
        if (state.selectedWithdrawal?._id === action.payload.id) {
          state.selectedWithdrawal = action.payload.data.data;
        }
      })
      .addCase(completeWithdrawal.rejected, (state, action) => {
        state.processing = false;
        state.error = action.payload;
      })
      
      // REJECT
      .addCase(rejectWithdrawal.pending, (state) => {
        state.processing = true;
        state.error = null;
      })
      .addCase(rejectWithdrawal.fulfilled, (state, action) => {
        state.processing = false;
        const index = state.withdrawals.findIndex(w => w._id === action.payload.id);
        if (index !== -1) {
          state.withdrawals[index] = action.payload.data.data;
        }
        if (state.selectedWithdrawal?._id === action.payload.id) {
          state.selectedWithdrawal = action.payload.data.data;
        }
      })
      .addCase(rejectWithdrawal.rejected, (state, action) => {
        state.processing = false;
        state.error = action.payload;
      })
      
      // CANCEL
      .addCase(cancelWithdrawal.pending, (state) => {
        state.processing = true;
        state.error = null;
      })
      .addCase(cancelWithdrawal.fulfilled, (state, action) => {
        state.processing = false;
        const index = state.withdrawals.findIndex(w => w._id === action.payload.id);
        if (index !== -1) {
          state.withdrawals[index] = action.payload.data.data;
        }
        if (state.selectedWithdrawal?._id === action.payload.id) {
          state.selectedWithdrawal = action.payload.data.data;
        }
      })
      .addCase(cancelWithdrawal.rejected, (state, action) => {
        state.processing = false;
        state.error = action.payload;
      })
      
      // BULK PROCESS
      .addCase(bulkProcessWithdrawals.pending, (state) => {
        state.processing = true;
        state.error = null;
      })
      .addCase(bulkProcessWithdrawals.fulfilled, (state) => {
        state.processing = false;
      })
      .addCase(bulkProcessWithdrawals.rejected, (state, action) => {
        state.processing = false;
        state.error = action.payload;
      })
      
      // FETCH STATS
      .addCase(fetchWithdrawalStats.fulfilled, (state, action) => {
        state.stats = { ...state.stats, ...action.payload };
      })
      
      // EXPORT
      .addCase(exportWithdrawals.pending, (state) => {
        state.exportLoading = true;
        state.error = null;
      })
      .addCase(exportWithdrawals.fulfilled, (state) => {
        state.exportLoading = false;
      })
      .addCase(exportWithdrawals.rejected, (state, action) => {
        state.exportLoading = false;
        state.error = action.payload;
      });
  },
});

// ============================================================
// ✅ EXPORT
// ============================================================

export const {
  clearWithdrawalError,
  resetWithdrawalState,
  updatePagination,
  clearWithdrawals,
} = withdrawalSlice.actions;

export default withdrawalSlice.reducer;