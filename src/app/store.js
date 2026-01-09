import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({ 
    
  reducer: {
    products: productsReducer,
    ui: uiReducer,
  },
});