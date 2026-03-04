// client/src/pages/admin/ProductAddPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createProduct } from '../../store/slices/adminSlice';
import { type Product } from '../../types'; // (Import Type มาใช้)

// (เราใช้ Omit เพื่อสร้าง Type ที่ไม่มี _id, createdAt, updatedAt)
type CreateProductData = Omit<Product, '_id' | 'createdAt' | 'updatedAt'>;

function ProductAddPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error } = useAppSelector((state) => state.admin);

  // 1. สร้าง State สำหรับฟอร์ม (เริ่มต้นด้วยค่าว่าง)
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(1);
  const [cpu, setCpu] = useState('');
  const [ram, setRam] = useState('');
  const [storage, setStorage] = useState('');
  const [gpu, setGpu] = useState('');
  const [display, setDisplay] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // (สมมติว่ามี imageUrl)
  const [isActive, setIsActive] = useState(true);

  // 2. ฟังก์ชัน Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const productData: CreateProductData = {
      name,
      price: Number(price),
      description,
      brand,
      category,
      stock: Number(stock),
      imageUrls: [imageUrl], // (เราอาจจะต้องใช้ imageUrls เป็น array)
      isActive,
      specs: { cpu, ram, storage, gpu, display },
    };
    
    // (เราใช้ .unwrap() เพื่อให้ .then() ทำงานได้)
    dispatch(createProduct(productData))
      .unwrap()
      .then(() => {
        alert('Product created successfully!');
        navigate('/admin/products'); // 3. กลับไปหน้า List
      })
      .catch((err) => {
        console.error('Failed to create product:', err);
      });
  };
  
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
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
          <div>
            <label className="block text-gray-700">Image URL</label>
            <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full px-3 py-2 border rounded" />
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
        
        {/* Status */}
        <div className="flex items-center">
            <input 
              type="checkbox" 
              checked={isActive} 
              onChange={(e) => setIsActive(e.target.checked)} 
              className="h-4 w-4 text-blue-600 border-gray-300 rounded" 
            />
            <label className="ml-2 block text-gray-900">Is Active (Visible to customers)</label>
        </div>


        {/* Error & Submit Button */}
        {error && <p className="text-red-500 text-center">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 font-bold mt-4 disabled:bg-gray-400"
        >
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}

export default ProductAddPage;