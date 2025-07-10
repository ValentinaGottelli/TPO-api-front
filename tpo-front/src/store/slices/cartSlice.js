import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartService from "../../services/cartService";

export const getCartThunk = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCart = createAsyncThunk(
  "cart/fetchAlternative",
  async (_, { rejectWithValue }) => {
    try {
      const result = await cartService.getCartC();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addItemToCartThunk = createAsyncThunk(
  "cart/addItem",
  async (cartItemData, { rejectWithValue }) => {
    try {
      const response = await cartService.addItemToCart(cartItemData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProductCartThunk = createAsyncThunk(
  "cart/updateProduct",
  async (cartItemData, { rejectWithValue }) => {
    try {
      const response = await cartService.updateProduct(
        cartItemData.productId,
        cartItemData
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProductCartThunk = createAsyncThunk(
  "cart/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await cartService.deleteProduct(productId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  cart: [],
  cartDrawer: false,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    handleCartClickAction: (state) => {
      state.cartDrawer = !state.cartDrawer;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartThunk.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
      })
      .addCase(getCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchCart (checkout)
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addItemToCartThunk.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(updateProductCartThunk.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(deleteProductCartThunk.fulfilled, (state, action) => {
        state.cart = action.payload;
      });
  },
});

export const { handleCartClickAction } = cartSlice.actions;

export const selectCart = (state) => state.cart.cart;
export const selectCartDrawer = (state) => state.cart.cartDrawer;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;

export const selectCartTotalPrice = (state) =>
  state.cart.cart.reduce(
    (acc, product) => acc + product.cartQuantity * product.price,
    0
  );

export default cartSlice.reducer;
