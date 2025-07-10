import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import checkoutService from '../../services/checkoutService';

export const confirmCheckout = createAsyncThunk(
  'checkout/confirm',
  async (_, { rejectWithValue }) => {
    try {
      const result = await checkoutService.confirmCheckout();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    loading: false,
    error: null,
    response: null,
  },
  reducers: {
    clearCheckoutState: (state) => {
      state.loading = false;
      state.error = null;
      state.response = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(confirmCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.response = null;
      })
      .addCase(confirmCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
      })
      .addCase(confirmCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCheckoutState } = checkoutSlice.actions;

export default checkoutSlice.reducer;