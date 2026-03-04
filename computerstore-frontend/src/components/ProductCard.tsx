// client/src/components/ProductCard.tsx
import React from 'react';
import { type Product } from '../types'; // 1. Import พิมพ์เขียว "Product"
import { useDispatch } from 'react-redux';
import { addItem } from '../store/slices/cartSlice';

// 2. 🚨 นี่คือส่วนที่น่าจะขาดไป 🚨
// เราต้อง "นิยาม" พิมพ์เขียวนี้ก่อนใช้งาน
// บอกว่า "props" ที่จะรับมา ต้องมีหน้าตาแบบนี้
interface ProductCardProps {
  product: Product;
}

// ฟังก์ชันแปลงราคา
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
  }).format(price);
};

// 3. เราใช้ ProductCardProps ที่เราเพิ่งสร้าง ตรงนี้
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addItem(product));
    alert(`${product.name} ถูกเพิ่มลงตะกร้าแล้ว!`);
  };

  return (
    // ใช้ Tailwind จัดสไตล์
    <div className="border rounded-lg shadow-md overflow-hidden bg-white flex flex-col">
      <img
        src={product.imageUrls[0] || 'https://via.placeholder.com/400x300'}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      
      <div className="p-4 flex flex-col grow">
        <div className="grow"> {/* ส่วนนี้เพื่อให้ปุ่มอยู่ล่างสุดเสมอ */}
          <p className="text-sm text-gray-500 mb-1">{product.brand} - {product.category}</p>
          <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
          <p className="text-gray-700 mb-2">
            {product.specs.cpu} | {product.specs.ram} | {product.specs.storage}
          </p>
        </div>
        
        <div className="mt-4"> {/* ส่วนล่าง */}
          <p className="text-xl font-bold text-blue-600 mb-4">
            {formatPrice(product.price)}
          </p>
          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            เพิ่มลงตะกร้า
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;