// client/src/pages/admin/ProductEditPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  fetchAdminProductById, 
  updateProduct, 
  clearCurrentProduct 
} from '../../store/slices/adminSlice';

function ProductEditPage() {
  const { id } = useParams<{ id: string }>(); // 1. ดึง ID จาก URL
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { currentProduct, loading, error } = useAppSelector((state) => state.admin);

  // 2. สร้าง State สำหรับฟอร์ม
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(0);
  const [cpu, setCpu] = useState('');
  const [ram, setRam] = useState('');
  const [storage, setStorage] = useState('');
  const [gpu, setGpu] = useState('');
  const [display, setDisplay] = useState('');
  
  // 3. (สำคัญ) ดึงข้อมูลสินค้าเมื่อ ID เปลี่ยน และล้าง State เมื่อออกจากหน้า
  useEffect(() => {
    if (id) {
      dispatch(fetchAdminProductById(id));
    }
    // "Cleanup" function: ทำงานเมื่อ Component ถูกถอด (ออกจากหน้า)
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [id, dispatch]);

  // 4. (สำคัญ) เมื่อ Redux โหลด currentProduct เสร็จ -> เทข้อมูลใส่ฟอร์ม
  useEffect(() => {
    if (currentProduct) {
      setName(currentProduct.name);
      setPrice(currentProduct.price);
      setDescription(currentProduct.description);
      setBrand(currentProduct.brand);
      setCategory(currentProduct.category);
      setStock(currentProduct.stock);
      setCpu(currentProduct.specs.cpu);
      setRam(currentProduct.specs.ram);
      setStorage(currentProduct.specs.storage);
      setGpu(currentProduct.specs.gpu);
      setDisplay(currentProduct.specs.display);
    }
  }, [currentProduct]);

  // 5. ฟังก์ชัน Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const productData = {
      name,
      price: Number(price),
      description,
      brand,
      category,
      stock: Number(stock),
      specs: { cpu, ram, storage, gpu, display },
    };
    
    // (เราใช้ .unwrap() เพื่อให้ .then() ทำงานได้)
    dispatch(updateProduct({ id, productData }))
      .unwrap()
      .then(() => {
        alert('Product updated successfully!');
        navigate('/admin/products'); // 6. กลับไปหน้า List
      })
      .catch((err) => {
        console.error('Failed to update product:', err);
      });
  };
  
  if (loading && !currentProduct) return <div>Loading product data...</div>;

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Edit Product (ID: {id})</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded" required />
          </div>
          <div>
            <label className="block text-gray-700">Price (THB)</label>
            <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full px-3 py-2 border rounded" required />
          </div>
          <div>
            <label className="block text-gray-700">Brand</label>
            <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full px-3 py-2 border rounded" required />
          </div>
          <div>
            <label className="block text-gray-700">Category</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border rounded" required />
          </div>
          <div>
            <label className="block text-gray-700">Stock</label>
            <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} className="w-full px-3 py-2 border rounded" required />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded" rows={4}></textarea>
        </div>

        {/* Specs */}
        <h2 className="text-xl font-semibold pt-4 border-t">Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">CPU</label>
            <input type="text" value={cpu} onChange={(e) => setCpu(e.target.value)} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-gray-700">RAM</label>
            <input type="text" value={ram} onChange={(e) => setRam(e.target.value)} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-gray-700">Storage</label>
            <input type="text" value={storage} onChange={(e) => setStorage(e.target.value)} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-gray-700">GPU</label>
            <input type="text" value={gpu} onChange={(e) => setGpu(e.target.value)} className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700">Display</label>
            <input type="text" value={display} onChange={(e) => setDisplay(e.target.value)} className="w-full px-3 py-2 border rounded" />
          </div>
        </div>

        {/* Error & Submit Button */}
        {error && <p className="text-red-500 text-center">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 font-bold mt-4 disabled:bg-gray-400"
        >
          {loading ? 'Updating...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
}

export default ProductEditPage;