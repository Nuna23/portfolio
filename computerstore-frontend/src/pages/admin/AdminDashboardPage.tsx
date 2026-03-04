// client/src/pages/admin/AdminDashboardPage.tsx
import { Link } from 'react-router-dom';

function AdminDashboardPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">จัดการสินค้า</h2>
          <p className="text-gray-600 mb-4">เพิ่ม, ลบ, แก้ไข สินค้าในระบบ</p>
          <Link
            to="/admin/products"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            ไปที่หน้าจัดการสินค้า
          </Link>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">จัดการคำสั่งซื้อ</h2>
          <p className="text-gray-600 mb-4">ดูคำสั่งซื้อทั้งหมดและอัปเดตสถานะ</p>
          <Link
            to="/admin/orders"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            ไปที่หน้าจัดการออเดอร์
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;