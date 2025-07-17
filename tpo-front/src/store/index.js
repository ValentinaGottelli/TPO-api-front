import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import notificationsReducer from "./slices/notificationSlice";
import checkoutSlice from "./slices/checkoutSlice"
import productsSlice from "./slices/productsSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    notifications: notificationsReducer,
    checkout: checkoutSlice,
    products : productsSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});


