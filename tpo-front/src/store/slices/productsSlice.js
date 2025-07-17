import {
    createAsyncThunk,
    createSlice
} from "@reduxjs/toolkit";
import listaProductosTest from './../../services/pruebaProductos/listaProductosTest';

const fetchProductsListTest = createAsyncThunk('products/fetch', async () => {
    const response = await listaProductosTest.getProductListTest()
    return response;
});

const fetchproductListByUser = createAsyncThunk('products/fetchById', async (userId) => {
    const response = await listaProductosTest.getProductListById(userId)
    return response
})

const initialState = {
    products: [],
    loading: false,
    error: null
}

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        clearProductsState: (state) => {
            state.loading = false;
            state.error = null;
            state.products = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductsListTest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductsListTest.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProductsListTest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchproductListByUser.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            });
    }
});

export const {
    clearProductsState
} = productSlice.actions;
export {
    fetchProductsListTest, fetchproductListByUser
};
export default productSlice.reducer;