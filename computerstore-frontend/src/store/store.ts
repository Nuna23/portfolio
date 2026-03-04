// client/src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import userReducer from './slices/userSlice';
import orderReducer from './slices/orderSlice';
import adminReducer from './slices/adminSlice';

export const store = configureStore({ // (สังเกตว่า 'store' ถูก export แล้ว)
  reducer: {
    cart: cartReducer,
    user: userReducer,
    order: orderReducer,
    admin: adminReducer,
  },
});

// (export type เหมือนเดิม)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;