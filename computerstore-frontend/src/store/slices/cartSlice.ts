// client/src/store/slices/cartSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Product, type CartState } from '../../types';

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// --- (Helper) ฟังก์ชันคำนวณยอดรวม ---
// (เราจะเรียกใช้ซ้ำๆ เพื่อป้องกันการคำนวณผิด)
const updateTotals = (state: CartState) => {
  let newTotalItems = 0;
  let newTotalPrice = 0;
  state.items.forEach(item => {
    newTotalItems += item.quantity;
    newTotalPrice += item.product.price * item.quantity;
  });
  state.totalItems = newTotalItems;
  state.totalPrice = newTotalPrice;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // --- 1. Add Item ---
    addItem: (state, action: PayloadAction<Product>) => {
      const productToAdd = action.payload;
      const existingItem = state.items.find(
        (item) => item.product._id === productToAdd._id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ product: productToAdd, quantity: 1 });
      }

      updateTotals(state); // (อัปเดตยอดรวม)
    },

    // --- 2. Remove Item (ลบทั้งแถว) ---
    removeItem: (state, action: PayloadAction<string>) => { // (รับ 'productId' (string) เข้ามา)
      const idToRemove = action.payload;
      state.items = state.items.filter(
        (item) => item.product._id !== idToRemove
      );

      updateTotals(state); // (อัปเดตยอดรวม)
    },

    // --- 3. Update Quantity (อัปเดตจำนวน) ---
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const itemToUpdate = state.items.find(
        (item) => item.product._id === id
      );

      if (itemToUpdate) {
        if (quantity <= 0) {
          // ถ้าจำนวน = 0 หรือน้อยกว่า ให้ลบทิ้ง
          state.items = state.items.filter(item => item.product._id !== id);
        } else {
          itemToUpdate.quantity = quantity;
        }
      }

      updateTotals(state); // (อัปเดตยอดรวม)
    },

    // --- 4. Clear Cart (ล้างตะกร้า) ---
    // (เราจะใช้ Action นี้หลังจากสั่งซื้อสำเร็จ)
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;