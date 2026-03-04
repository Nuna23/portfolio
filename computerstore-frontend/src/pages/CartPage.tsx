// client/src/pages/CartPage.tsx
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { removeItem, updateQuantity } from '../store/slices/cartSlice';

// (ฟังก์ชัน formatPrice ที่เราเคยใช้)
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(price);
};

function CartPage() {
  const dispatch = useAppDispatch();
  // 1. ดึงข้อมูลตะกร้าทั้งหมดจาก Redux
  const { items, totalItems, totalPrice } = useAppSelector((state) => state.cart);

  const handleRemove = (id: string) => {
    dispatch(removeItem(id));
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  // --- (ถ้าตะกร้าว่าง) ---
  if (items.length === 0) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-semibold mb-4">ตะกร้าของคุณว่างเปล่า</h2>
        <Link to="/" className="text-blue-500 hover:underline">
          กลับไปเลือกซื้อสินค้า
        </Link>
      </div>
    );
  }

  // --- (ถ้ามีสินค้าในตะกร้า) ---
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">ตะกร้าสินค้า</h1>
      <div className="flex flex-col lg:flex-row gap-8">

        {/* 1. รายการสินค้า (ฝั่งซ้าย) */}
        <div className="grow lg:w-2/3">
          {items.map((item) => (
            <div key={item.product._id} className="flex items-center gap-4 bg-white p-4 rounded shadow-md mb-4">
              <img src={item.product.imageUrls[0] || 'https://via.placeholder.com/100'} alt={item.product.name} className="w-20 h-20 object-cover rounded" />
              <div className="grow">
                <h3 className="text-lg font-semibold">{item.product.name}</h3>
                <p className="text-gray-600">{formatPrice(item.product.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.product._id, parseInt(e.target.value))}
                  className="w-16 text-center border rounded"
                />
              </div>
              <p className="font-semibold w-24 text-right">
                {formatPrice(item.product.price * item.quantity)}
              </p>
              <button
                onClick={() => handleRemove(item.product._id)}
                className="text-red-500 hover:text-red-700"
              >
                ลบ
              </button>
            </div>
          ))}
        </div>

        {/* 2. สรุปยอด (ฝั่งขวา) */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl font-semibold mb-4">สรุปยอด</h2>
            <div className="flex justify-between mb-2">
              <span>จำนวนสินค้า</span>
              <span>{totalItems} ชิ้น</span>
            </div>
            <div className="flex justify-between mb-4 font-bold text-xl">
              <span>ราคารวม</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <Link
              to="/checkout" // (เราจะสร้างหน้านี้ในขั้นตอนต่อไป)
              className="block w-full text-center bg-green-500 text-white py-3 rounded hover:bg-green-600 font-bold"
            >
              ไปที่หน้าชำระเงิน
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CartPage;