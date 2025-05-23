import React, { useState, useMemo } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Product } from '../types';
import SearchBar from '../components/SearchBar';

const products: Product[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    price: 29.99,
    description: 'Fever and pain relief tablets',
    category: 'general',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=60',
    stock: 100,
    manufacturer: 'HealthCare Pharma'
  },
  {
    id: '2',
    name: 'Pet Vitamins',
    price: 299.99,
    description: 'Essential vitamins for pets',
    category: 'veterinary',
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=800&auto=format&fit=crop&q=60',
    stock: 50,
    manufacturer: 'PetCare Plus'
  },
  {
    id: '3',
    name: 'Baby Diaper Pack',
    price: 499.99,
    description: 'Ultra-soft diapers, pack of 40',
    category: 'diaper',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=60',
    stock: 200,
    manufacturer: 'BabyCare'
  },
  {
    id: '4',
    name: 'Moisturizing Cream',
    price: 199.99,
    description: 'Hydrating face cream',
    category: 'cosmetic',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=60',
    stock: 75,
    manufacturer: 'GlowSkin'
  },
];

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const addToCart = useCartStore((state) => state.addToCart);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.manufacturer.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
          <div className="w-full md:w-96">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name, category, or manufacturer..."
            />
          </div>
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-w-1 aspect-h-1">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h2>
                  <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-700 font-bold">₹{product.price}</span>
                    <span className="text-sm text-gray-500">{product.stock} in stock</span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
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