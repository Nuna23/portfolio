// client/src/App.tsx
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

// Public Pages
import ProductListPage from './pages/ProductListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';

// Protected Pages
import ProtectedRoute from './components/ProtectedRoute';
import CheckoutPage from './pages/CheckoutPage';

// Admin Pages
import AdminRoute from './components/AdminRoute'; 
import AdminDashboardPage from './pages/admin/AdminDashboardPage'; 
import ManageProductsPage from './pages/admin/ManageProductsPage'; 
import ManageOrdersPage from './pages/admin/ManageOrdersPage'; 
import ProductEditPage from './pages/admin/ProductEditPage'; 

// 1. 🚨🚨🚨 (นี่คือบรรทัดที่ลืม) 🚨🚨🚨
// (Import หน้าฟอร์ม Add ที่เราสร้างไว้)
import ProductAddPage from './pages/admin/ProductAddPage'; 

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <main className="container mx-auto p-4">
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<ProductListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<CartPage />} />
          
          {/* --- Protected Routes (Customer) --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            {/* (เพิ่ม /my-orders ที่นี่ได้) */}
          </Route>
          
          {/* --- Admin Routes --- */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/products" element={<ManageProductsPage />} />
            <Route path="/admin/orders" element={<ManageOrdersPage />} />
            
            {/* (Route ของ Edit ที่เราทำไปแล้ว) */}
            <Route path="/admin/products/edit/:id" element={<ProductEditPage />} />
            
            {/* 2. 🚨🚨🚨 (นี่คือบรรทัดที่ลืม) 🚨🚨🚨 */}
            {/* (เพิ่ม Path นี้เข้าไปในแผนที่) */}
            <Route 
              path="/admin/products/add" 
              element={<ProductAddPage />} 
            />
          </Route>

        </Routes>
      </main>
    </div>
  );
}

export default App;