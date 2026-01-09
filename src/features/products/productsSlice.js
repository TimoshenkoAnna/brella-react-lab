import { createSlice } from '@reduxjs/toolkit';
import initialProducts from '../../data/products.json';

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: initialProducts.map(p => ({...p, status: p.status || 'in_stock' })),
  },
  reducers: {
    addProduct: (state, action) => {
      const { name, price } = action.payload;
      if (!name || !price || isNaN(price)) {
        console.error("Validation Error: Name and Price are required.");
        return; 
      }
      const newProduct = { ...action.payload, id: Date.now(), status: 'in_stock' };
      state.items.unshift(newProduct);
    },
    deleteProduct: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
    },
    updateProduct: (state, action) => {
      const updatedProduct = action.payload;
      const index = state.items.findIndex(item => item.id === updatedProduct.id);
      if (index !== -1) {
        state.items[index] = updatedProduct;
      }
    },
  },
});

export const { addProduct, deleteProduct, updateProduct } = productsSlice.actions;

export const selectAllProducts = (state) => state.products.items;

export default productsSlice.reducer;