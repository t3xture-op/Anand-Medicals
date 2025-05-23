import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, FileUp, MessageSquare, Package } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import SearchBar from './SearchBar';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (value) => {
    setSearchQuery(value);
    navigate(`/products?search=${encodeURIComponent(value)}`);
  };

  return (
    <nav className="bg-green-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-tight">ANAND MEDICALS</span>
          </Link>
          
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <SearchBar
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search medicines, healthcare products..."
            />
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/categories" className="hover:text-green-200 transition-colors font-medium">
              Categories
            </Link>
            <Link to="/products" className="hover:text-green-200 transition-colors font-medium">
              Products
            </Link>
            <Link 
              to="/upload-prescription" 
              className="flex items-center space-x-1 hover:text-green-200 transition-colors font-medium"
            >
              <FileUp className="w-5 h-5" />
              <span>Upload Prescription</span>
            </Link>
            <Link to="/cart" className="relative hover:text-green-200 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link to="/orders" className="hover:text-green-200 transition-colors">
              <Package className="w-6 h-6" />
            </Link>
            <Link to="/feedback" className="hover:text-green-200 transition-colors">
              <MessageSquare className="w-6 h-6" />
            </Link>
            <Link to="/login" className="hover:text-green-200 transition-colors">
              <User className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile search bar */}
      <div className="md:hidden px-4 pb-4">
        <SearchBar
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search medicines, healthcare products..."
        />
      </div>
    </nav>
  );
}