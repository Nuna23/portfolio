// client/src/store/slices/orderSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios'; // ✅ 1. Import AxiosError
import api from '../../services/api';
import { clearCart } from './cartSlice';

// --- (พิมพ์เขียวสำหรับข้อมูลใน Order) ---
// (แยกออกมาเพื่อให้ใช้ซ้ำได้)
interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
}

// --- (พิมพ์เขียว DTO ที่จะส่งไป Backend) ---
interface CreateOrderData {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
}

// ✅ 2. (สำคัญ!) สร้างพิมพ์เขียว 'Order' ที่ Backend จะส่งกลับมา
// (ควรจะหน้าตาเหมือน DTO + ข้อมูลที่ Server สร้าง เช่น _id, user, status)
interface Order {
  _id: string; // (Server สร้าง)
  user: string; // (Server สร้าง)
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  status: string; // (Server สร้าง - เช่น 'pending')
  totalPrice: number; // (Server คำนวณ)
  createdAt: string; // (Server สร้าง)
  updatedAt: string; // (Server สร้าง)
}

// --- (พิมพ์เขียว State ของ Order) ---
interface OrderState {
  orders: Order[]; // ✅ 3. แก้ไข any
  loading: boolean;
  error: string | null;
  currentOrder: Order | null; // ✅ 4. แก้ไข any
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
  currentOrder: null,
};

// --- (Async Thunks) ---
export const createOrder = createAsyncThunk<Order, CreateOrderData>( // ✅ 5. ระบุไทป์ที่ Thunk คืนค่า (Order)
  'order/createOrder',
  async (orderData: CreateOrderData, thunkAPI) => {
    try {
      const response = await api.post<Order>('/orders', orderData); // ✅ 6. บอก api.post ว่าจะได้ 'Order' กลับมา

      thunkAPI.dispatch(clearCart());

      return response.data;
    } catch (error) { // ✅ 7. แก้ไข catch บล็อก
      if (error instanceof AxiosError && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to create order');
      }
      return thunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);

// --- (Slice) ---
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentOrder = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => { // ✅ 8. (อัตโนมัติ) action.payload เป็น 'Order'
        state.loading = false;
        state.currentOrder = action.payload; // (ปลอดภัยแล้ว)
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default orderSlice.reducer;