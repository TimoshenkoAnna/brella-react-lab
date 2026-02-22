import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:5000/api/products';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
    const response = await fetch(API_URL);
    return await response.json();
});

export const addNewProduct = createAsyncThunk('products/addNewProduct', async (newProduct) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
    });
    return await response.json();
});


export const updateProduct = createAsyncThunk('products/updateProduct', async (productToUpdate) => {
    const response = await fetch(`${API_URL}/${productToUpdate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productToUpdate)
    });
    return await response.json();
});


export const deleteProductById = createAsyncThunk('products/deleteProductById', async (productId) => {
    await fetch(`${API_URL}/${productId}`, { method: 'DELETE' });
    return productId;
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers(builder) {
    builder
        .addCase(fetchProducts.pending, (state) => { state.status = 'loading'; })
        .addCase(fetchProducts.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
        .addCase(fetchProducts.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message; })
        .addCase(addNewProduct.fulfilled, (state, action) => { state.items = action.payload; })
        .addCase(deleteProductById.fulfilled, (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        })
        
        .addCase(updateProduct.fulfilled, (state, action) => {
            const updatedProduct = action.payload;
            const index = state.items.findIndex(item => item.id === updatedProduct.id);
            if (index !== -1) {
                state.items[index] = updatedProduct;
            }
        });
       
  }
});

export const selectAllProducts = (state) => state.products.items;
export const getProductsStatus = (state) => state.products.status;

export default productsSlice.reducer;