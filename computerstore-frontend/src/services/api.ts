// client/src/services/api.ts
import axios from 'axios';
// 1. 🚨 ลบ 'import { store } from ...' ทิ้งไปเลย! 🚨

const api = axios.create({
  baseURL: 'https://computer-store-api-cqy4.onrender.com',
});

// 2. 🚨 แก้ไข Interceptor 🚨
api.interceptors.request.use(
  (config) => {
    // 3. เปลี่ยนจากการอ่าน "store" มาอ่าน "localStorage"
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;