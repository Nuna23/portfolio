// client/src/types/index.ts

export interface Specs {
  cpu: string;
  ram: string;
  storage: string;
  gpu: string;
  display: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  specs: Specs;
  stock: number;
  imageUrls: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// 🚨 แก้ไข User
export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer'; // 1. เพิ่ม role
}

// 🚨 แก้ไข AuthState
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// 🚨 (ใหม่) พิมพ์เขียวสำหรับ Admin
export interface Order {
  _id: string;
  user: User; // (Backend จะ populate มาให้)
  items: unknown[]; // (ขอย่อ)
  shippingAddress: unknown; // (ขอย่อ)
  totalPrice: number;
  status: string;
  createdAt: string;
}

export interface AdminState {
  products: Product[];
  orders: Order[];
  loading: boolean;
  error: string | null;
  currentProduct: Product | null; 
  currentOrder: Order | null; // 1. 🚨 (ใหม่) เพิ่มบรรทัดนี้
}