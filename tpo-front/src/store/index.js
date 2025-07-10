// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import cartSlice from './slices/cartSlice';
import checkoutSlice from './slices/checkoutSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
    checkout: checkoutSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});