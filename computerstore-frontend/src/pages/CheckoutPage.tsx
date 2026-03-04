// client/src/pages/CheckoutPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // 1. ลบ 'useNavigate' ออก
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createOrder } from '../store/slices/orderSlice';

function CheckoutPage() {
  const dispatch = useAppDispatch();
  // const navigate = useNavigate(); // 2. ลบบรรทัดนี้

  // ... (ส่วน state อื่นๆ เหมือนเดิม) ...
  const { items, totalPrice } = useAppSelector((state) => state.cart);
  const { loading, error, currentOrder } = useAppSelector((state) => state.order);

  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const orderItems = items.map(item => ({
      productId: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const shippingData = {
      fullName, address, city, postalCode
    };

    dispatch(createOrder({
      items: orderItems,
      shippingAddress: shippingData,
    }));
  };

  // --- ถ้าสั่งซื้อสำเร็จ (มี currentOrder) ---
  if (currentOrder) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-semibold mb-4 text-green-600">สั่งซื้อสำเร็จ!</h2>
        <p>Order ID ของคุณคือ: {currentOrder._id}</p>
        <p>รวมทั้งสิ้น: {currentOrder.totalPrice.toLocaleString()} บาท</p> 
        <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">
          กลับไปหน้าแรก
        </Link>
      </div>
    )
  }

  // --- ฟอร์ม Checkout ---
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">ข้อมูลจัดส่ง</h2>
      <form onSubmit={handleSubmit}>
        {/* ... (ฟอร์ม input เหมือนเดิม) ... */}
        
        <div className="mb-4">
          <label className="block text-gray-700">ชื่อ-นามสกุล</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">ที่อยู่</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700">เมือง</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-gray-700">รหัสไปรษณีย์</label>
            <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required className="w-full px-3 py-2 border rounded" />
          </div>
        </div>
        
        <div className="mt-6 border-t pt-4">
          {/* 3. แก้ไข formatPrice เป็นการแสดงผลที่ถูกต้อง */}
          <h3 className="text-xl font-semibold">ยอดรวม: {totalPrice.toLocaleString()} บาท</h3>
        </div>

        {error && <p className="text-red-500 text-sm my-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 font-bold mt-4 disabled:bg-gray-400"
        >
          {loading ? 'กำลังดำเนินการ...' : 'ยืนยันการสั่งซื้อ'}
        </button>
      </form>
    </div>
  );
}
export default CheckoutPage;