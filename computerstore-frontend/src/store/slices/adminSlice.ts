// client/src/store/slices/adminSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { type AdminState, type Product, type Order } from "../../types";
import api from "../../services/api";
import { isAxiosError } from "axios";

// พิมพ์เขียวสำหรับข้อมูลอัปเดต
interface UpdateProductData {
  id: string;
  productData: Partial<Product>;
}

// 🚨 (ใหม่) พิมพ์เขียวสำหรับข้อมูลสร้าง
// (เราไม่จำเป็นต้องส่ง _id หรือ createdAt)
type CreateProductData = Omit<Product, "_id" | "createdAt" | "updatedAt">;

const initialState: AdminState = {
  products: [],
  orders: [],
  loading: false,
  error: null,
  currentProduct: null,
  currentOrder: null,
};

// --- THUNKS (6 ตัว) ---

// 1. Fetch Products
export const fetchAdminProducts = createAsyncThunk<Product[]>(
  "admin/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/products/all");
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
      }
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

// 2. Fetch Orders
export const fetchAdminOrders = createAsyncThunk<Order[]>(
  "admin/fetchOrders",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/orders/all");
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
      }
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

// 3. Delete Product
export const deleteProduct = createAsyncThunk<string, string>(
  "admin/deleteProduct",
  async (productId, thunkAPI) => {
    // ... (โค้ด Thunk นี้เหมือนเดิม) ...
    try {
      await api.delete(`/products/${productId}`);
      return productId;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
      }
      return thunkAPI.rejectWithValue(
        "An unknown error occurred during deletion"
      );
    }
  }
);

// 4. Fetch Product By Id
export const fetchAdminProductById = createAsyncThunk<Product, string>(
  "admin/fetchProductById",
  async (productId, thunkAPI) => {
    // ... (โค้ด Thunk นี้เหมือนเดิม) ...
    try {
      const response = await api.get<Product>(`/products/${productId}`);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
      }
      return thunkAPI.rejectWithValue("Failed to fetch product");
    }
  }
);

// 5. Update Product
export const updateProduct = createAsyncThunk<Product, UpdateProductData>(
  "admin/updateProduct",
  async ({ id, productData }, thunkAPI) => {
    // ... (โค้ด Thunk นี้เหมือนเดิม) ...
    try {
      const response = await api.put<Product>(`/products/${id}`, productData);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
      }
      return thunkAPI.rejectWithValue("Failed to update product");
    }
  }
);

// 6. 🚨 (ใหม่) Thunk สร้างสินค้า 🚨
export const createProduct = createAsyncThunk<Product, CreateProductData>(
  "admin/createProduct",
  async (productData, thunkAPI) => {
    try {
      // (ยิง API 'POST /products' ที่มียามเฝ้า)
      const response = await api.post<Product>("/products", productData);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
      }
      return thunkAPI.rejectWithValue("Failed to create product");
    }
  }
);

export const fetchAdminOrderById = createAsyncThunk<Order, string>(
  "admin/fetchOrderById",
  async (orderId, thunkAPI) => {
    try {
      // (ยิง API 'GET /orders/:id' ที่เราเพิ่งสร้าง)
      const response = await api.get<Order>(`/orders/${orderId}`);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
      }
      return thunkAPI.rejectWithValue("Failed to fetch order");
    }
  }
);

// --- SLICE ---

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder // 1. (Fetch Products)
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 2. (Fetch Orders)
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 3. (Delete Product)
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      }) // 4. (Fetch By Id)

      .addCase(fetchAdminProductById.pending, (state) => {
        state.loading = true;
        state.currentProduct = null;
        state.error = null;
      })
      .addCase(fetchAdminProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchAdminProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 5. (Update Product)
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
        state.products = state.products.map((product) =>
          product._id === action.payload._id ? action.payload : product
        );
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 6. 🚨 (ใหม่) Reducer สำหรับ Create 🚨
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        // เพิ่มสินค้าใหม่เข้าไปใน Array
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentProduct } = adminSlice.actions;
export default adminSlice.reducer;
