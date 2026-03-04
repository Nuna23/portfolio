// client/src/components/ProtectedRoute.tsx
import { useAppSelector } from '../store/hooks';
import { Navigate, Outlet } from 'react-router-dom';

// Outlet คือ "ทางออก" ที่จะไปแสดง Component ลูก (เช่น CheckoutPage)
// ถ้าไม่ใช้ Outlet Component ลูกจะไม่แสดงผล

function ProtectedRoute() {
  // 1. อ่าน "บัตรผ่าน" จาก Redux
  const { token } = useAppSelector((state) => state.user);

  if (!token) {
    // 2. ถ้าไม่มี "บัตรผ่าน" -> เด้งไปหน้า Login
    return <Navigate to="/login" replace />; 
  }

  // 3. ถ้ามี "บัตรผ่าน" -> อนุญาตให้ไปต่อ (แสดง <Outlet />)
  return <Outlet />;
}

export default ProtectedRoute;