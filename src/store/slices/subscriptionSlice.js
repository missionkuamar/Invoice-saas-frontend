// frontend/src/store/slices/subscriptionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchPlans = createAsyncThunk(
  'subscription/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/subscriptions/plans');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch plans');
    }
  }
);

export const createOrder = createAsyncThunk(
  'subscription/createOrder',
  async (plan, { rejectWithValue }) => {
    try {
      const response = await api.post('/subscriptions/create-order', { plan });
      // Make sure we return the data properly
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data?.message || 'Failed to create order');
      }
    } catch (error) {
     // console.error('Create order error:', error);
      const message = error.response?.data?.message || error.message || 'Failed to create order';
      return rejectWithValue(message);
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'subscription/verify',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/subscriptions/verify', paymentData);
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data?.message || 'Payment verification failed');
      }
    } catch (error) {
      //console.error('Verify payment error:', error);
      const message = error.response?.data?.message || error.message || 'Payment verification failed';
      return rejectWithValue(message);
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    plans: [],
    currentPlan: null,
    loading: false,
    error: null,
    verifying: false,
    orderData: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearOrderData: (state) => {
      state.orderData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Plans
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderData = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.orderData = null;
      })
      // Verify Payment
      .addCase(verifyPayment.pending, (state) => {
        state.verifying = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.verifying = false;
        state.currentPlan = action.payload?.plan;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.verifying = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearOrderData } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;