import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  description: "",
  placement: "topLeft",
  visible: false,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    showNotification: (state, action) => {
      state.message = action.payload.message;
      state.description = action.payload.description ?? "";
      state.placement = action.payload.placement ?? "topLeft";
      state.visible = true;
    },
    clearNotification: (state) => {
      state.visible = false;
    },
  },
});

export const { showNotification, clearNotification } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
