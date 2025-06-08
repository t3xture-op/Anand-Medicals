import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { useCartStore } from '../store/cartStore';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    [product.name, product.description, product.category, product.manufacturer]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = async (product) => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      discount_price: product.discount_price,
      image: product.image,
      stock: product.stock,
      quantity: 1,
    });

    try {
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          product: product._id,
          quantity: 1,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Failed to add to cart');
        return;
      }

      alert('Item added to your cart');
    } catch (error) {
      alert('Error adding to cart', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">PRODUCTS</h1>
          <div className="w-full md:w-96">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name, category, or manufacturer..."
            />
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
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
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                      {product.name}
                    </h2>
                    <p className="text-sm text-gray-600 mb-2">
                      {product.manufacturer}
                    </p>
                  </Link>

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-green-700 font-bold text-lg">
                        ₹{product.discount_price}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-sm text-red-500 font-semibold">
                          {product.discount}% off
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {product.stock} in stock
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-2 w-full bg-green-600 text-white text-sm font-medium py-2 px-4 rounded hover:bg-green-700 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
