import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { ShoppingCart } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      discount_price: product.discount_price,
      image: product.image,
      stock: product.stock,
      quantity,
    });

    try {
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          product: product._id,
          quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Failed to add to cart');
        return;
      }

      alert('Item added to your cart');
    } catch (error) {
      console.error('Error adding to cart:', error.message);
      alert('Error adding to cart');
    }
  };

  if (!product) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-96 object-cover rounded-lg transition-transform duration-300 transform hover:scale-105"
        />
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>

          {/* Price Section */}
          <div className="flex items-baseline gap-3">
            <span className="text-green-700 text-2xl font-bold">
              ₹{product.discount_price}
            </span>
            <span className="text-gray-500 line-through text-lg">
              ₹{product.price}
            </span>
            {product.discount > 0 && (
              <span className="text-red-500 text-sm font-semibold">
                {product.discount}% off
              </span>
            )}
          </div>

          <p className="text-sm text-gray-500">{product.stock} items in stock</p>

          <div className="flex items-center space-x-4 mt-4">
            <label className="text-sm font-medium text-gray-700">Quantity:</label>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.min(product.stock, Math.max(1, Number(e.target.value))))
              }
              className="w-20 px-3 py-1 border rounded-md"
            />
          </div>

          <button
            onClick={handleAddToCart}
            className="mt-6 bg-green-700 text-white py-2 px-6 rounded-md hover:bg-green-800 flex items-center space-x-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
