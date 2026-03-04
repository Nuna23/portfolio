// client/src/pages/ProductListPage.tsx
import { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { type Product } from '../types'; // 1. Import พิมพ์เขียว

function ProductListPage() {
  // 2. บอก State ให้ชัดเจน
  const [products, setProducts] = useState<Product[]>([]); // กล่องเก็บ "Array ของ Product"
  const [loading, setLoading] = useState<boolean>(true); // กล่องเก็บ "boolean"
  const [error, setError] = useState<string | null>(null); // กล่องเก็บ "string หรือ null"

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // 3. บอก Axios ว่าข้อมูลที่ได้กลับมาจะเป็น Array ของ Product
        const response = await api.get<Product[]>('/products');

        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('ไม่สามารถโหลดข้อมูลสินค้าได้');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center text-xl p-10">กำลังโหลด...</div>;
  }

  if (error) {
    return <div className="text-center text-xl p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">สินค้าคอมพิวเตอร์</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductListPage;