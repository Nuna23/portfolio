// client/src/components/AdminRoute.tsx

/*
 * -----------------------------------------------------------------------------
 * (คำอธิบายไฟล์)
 * ไฟล์นี้คือ "ยามเฝ้าประตู" (Protected Route Component) สำหรับ "แอดมิน"
 *
 * หน้าที่ของมันคือ "ตรวจสอบ" ผู้ใช้ "ก่อน" ที่จะอนุญาตให้เขาเห็น
 * "หน้าที่แอดมิน" (เช่น AdminDashboard, ManageProducts)
 *
 * มันถูกใช้ใน `App.tsx` (แผนที่) เพื่อ "ห่อหุ้ม" Route ของแอดมิน
 * -----------------------------------------------------------------------------
 */

// 1. Import "เครื่องมือ"
import { useAppSelector } from "../store/hooks"; // (เครื่องมือ "อ่าน" ข้อมูลจาก Redux)
import { Navigate, Outlet } from "react-router-dom"; // (เครื่องมือ "เปลี่ยนหน้า" / "แสดงผล")

function AdminRoute() {
  // 2. "ตรวจสอบสถานะ"
  // (ดึง "บัตรผ่าน" (token) และ "ข้อมูลผู้ใช้" (user)
  // ออกมาจาก Redux "state" ที่ชื่อ `user`)
  const { user, token } = useAppSelector((state) => state.user); // 3. 🚨 (เงื่อนไขที่ 1: "ยังไม่ได้ล็อกอิน") 🚨

  if (!token || !user) {
    // (ถ้า "ไม่มีบัตรผ่าน" (token) หรือ "ไม่มีข้อมูลผู้ใช้" (user))
    // (แปลว่า "ยังไม่ได้ล็อกอิน")
    //
    // "จงส่ง" (Navigate) ผู้ใช้ "กลับ" ไปที่หน้า "/login"
    // (`replace` = ไม่เก็บหน้านี้ไว้ใน history -> กด Back กลับมาหน้านี้ไม่ได้)
    return <Navigate to="/login" replace />;
  } // 4. 🚨 (เงื่อนไขที่ 2: "ล็อกอินแล้ว แต่ไม่ใช่แอดมิน") 🚨

  if (user.role !== "admin") {
    // (ถ้าผู้ใช้มี "บทบาท" (role) "ไม่เท่ากับ" 'admin')
    // (เช่น เป็น 'customer')
    //
    // "จงส่ง" (Navigate) ผู้ใช้ "กลับ" ไปที่หน้าแรก ("/")
    return <Navigate to="/" replace />;
  } // 5. 🚨 (เงื่อนไขสุดท้าย: "ผ่าน") 🚨

  // (ถ้าผ่านทั้ง 2 ด่านข้างบนมาได้ = "ล็อกอินแล้ว" และ "เป็นแอดมิน")
  //
  // "จงแสดงผล" (Render) "หน้าเพจลูก" (Child Route) ที่พยายามจะเข้า
  // `<Outlet />` คือ "ช่องทางออก" หรือ "ตัวแทน"
  // ที่ React Router จะเอา "หน้าเพจจริง" (เช่น `<ManageProductsPage />`)
  // มา "เสียบ" แทนที่ตรงนี้
  return <Outlet />;
}

export default AdminRoute;

/*
 * -----------------------------------------------------------------------------
 * (สรุปการทำงานใน App.tsx)
 *
 * <Routes>
 * <Route element={<AdminRoute />}>  // 👈 (ยามเฝ้าประตู)
 * * // (นี่คือ "หน้าเพจลูก" ที่ <Outlet /> จะแสดงผล)
 * <Route path="/admin" element={<AdminDashboardPage />} />
 * <Route path="/admin/products" element={<ManageProductsPage />} />
 *
 * </Route>
 * </Routes>
 *
 * - ถ้า "ลูกค้า" พยายามเข้า /admin/products
 * - `AdminRoute` (ไฟล์นี้) จะทำงาน
 * - มันจะเช็ก `user.role` -> พบว่าเป็น 'customer' (เงื่อนไขที่ 4)
 * - มันจะ `<Navigate to="/" />` (เด้งกลับหน้าแรก)
 * - `ManageProductsPage` จะ "ไม่" ถูกแสดงผล
 * -----------------------------------------------------------------------------
 */
