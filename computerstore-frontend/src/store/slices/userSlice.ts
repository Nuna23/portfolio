// client/src/store/slices/userSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { type AuthState, type User } from "../../types";
import api from "../../services/api"; // "โทรศัพท์" (Axios)

// --- ประเภทของ DTO ที่จะส่งไป Backend ---
interface RegisterData {
  name: string;
  email: string;
  password: string;
}
interface LoginData {
  email: string;
  password: string;
}
// --- ประเภทของข้อมูลที่ Backend ส่งกลับมา ---
interface AuthResponse {
  accessToken: string;
  user: User;
}

// --- 1. สร้าง "Async Thunks" (ตัวจัดการงานที่คุยกับ API) ---

// ตัวจัดการ "สมัครสมาชิก"
export const registerUser = createAsyncThunk<AuthResponse, RegisterData>(
  "auth/register", // (ชื่อ Action)
  async (userData, thunkAPI) => {
    try {
      const response = await api.post<AuthResponse>("/auth/register", userData);
      return response.data; // (ถ้าสำเร็จ คืนค่า accessToken และ user)
    } catch (error) {
      // 👈 1. เอา 'any' ออก
      // 2. ตรวจสอบว่าเป็น Axios Error และมี response จริงหรือไม่
      if (error instanceof AxiosError && error.response) {
        // 3. ถ้าใช่ ค่อยดึง message จาก .response.data
        return thunkAPI.rejectWithValue(
          error.response.data.message || "Something went wrong"
        );
      }
      // 4. ถ้าไม่ใช่ (เช่น เน็ตตัด หรือ Error อื่นๆ) ให้ส่งข้อความทั่วไป
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  }
);

// ตัวจัดการ "ล็อกอิน"
export const loginUser = createAsyncThunk<AuthResponse, LoginData>(
  "auth/login", // (ชื่อ Action)
  async (loginData, thunkAPI) => {
    try {
      const response = await api.post<AuthResponse>("/auth/login", loginData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return thunkAPI.rejectWithValue(
          error.response.data.message || "Invalid credentials"
        );
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  }
);

// --- 2. สถานะเริ่มต้น ---
// ลองดึงข้อมูลเก่าจาก localStorage (ถ้าเคยล็อกอินค้างไว้)
const userFromStorage: User | null = JSON.parse(
  localStorage.getItem("user") || "null"
);
const tokenFromStorage: string | null = localStorage.getItem("token");

const initialState: AuthState = {
  user: userFromStorage,
  token: tokenFromStorage,
  isLoading: false,
  error: null,
};

// --- 3. สร้าง "Slice" ---
const userSlice = createSlice({
  name: "user",
  initialState,
  // "Reducers" ธรรมดา (สำหรับงานที่ไม่คุยกับ API)
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  // "Extra Reducers" (สำหรับจัดการสถานะของ Async Thunks)
  extraReducers: (builder) => {
    builder
      // --- จัดการ Register ---
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.token = action.payload.accessToken;
          // "จำ" ไว้ใน localStorage
          localStorage.setItem("user", JSON.stringify(action.payload.user));
          localStorage.setItem("token", action.payload.accessToken);
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // --- จัดการ Login ---
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.token = action.payload.accessToken;
          // "จำ" ไว้ใน localStorage
          localStorage.setItem("user", JSON.stringify(action.payload.user));
          localStorage.setItem("token", action.payload.accessToken);
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
