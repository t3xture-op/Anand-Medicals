// pages/SubCategoryProducts.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function SubCategoryProducts() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchSubCategoryProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products/subcategory/${id}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch subcategory products:', err);
      }
    };
    fetchSubCategoryProducts();
  }, [id]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Products</h2>
      {products.length === 0 ? (
        <p className="text-gray-500">No products found in this subcategory.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-105 overflow-hidden"
            >
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4">
                <Link to={`/product/${product._id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{product.manufacturer}</p>
                </Link>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-green-700 font-bold text-lg">₹{product.discount_price}</span>
                  <span className="text-gray-500 line-through text-lg">₹{product.price}</span>
                  {product.discount > 0 && (
                    <span className="text-sm text-red-500 font-semibold">
                      {product.discount}% off
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">{product.stock} in stock</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
