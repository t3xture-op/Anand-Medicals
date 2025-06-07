import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, FileUp, Package } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { AuthContext } from "../authContext";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { isLoggedIn, user, setIsLoggedIn, setUser } = useContext(AuthContext);
  const cartItems = useCartStore((state) => state.items);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const navigate = useNavigate();
  const userMenuRef = useRef();

  const handleSearch = (value) => {
    setSearchQuery(value);
    navigate(`/products?search=${encodeURIComponent(value)}`);
  };

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      setShowUserMenu(true);
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
    setShowUserMenu(false);
    setShowLogoutConfirm(false);
    navigate("/");
  };

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <>
      <nav className="bg-green-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold tracking-tight">
                ANAND MEDICALS
              </span>
            </Link>

            <div className="hidden md:block flex-1 max-w-lg mx-8">
              <SearchBar
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search medicines, healthcare products..."
              />
            </div>

            <div className="flex items-center space-x-6">
              <Link
                to="/categories"
                className="hover:text-green-200 transition-colors font-medium"
              >
                Categories
              </Link>
              <Link
                to="/products"
                className="hover:text-green-200 transition-colors font-medium"
              >
                Products
              </Link>
              <Link
                to="/upload-prescription"
                className="flex items-center space-x-1 hover:text-green-200 transition-colors font-medium"
              >
                <FileUp className="w-5 h-5" />
                <span>Upload Prescription</span>
              </Link>

              <Link
                to="/cart"
                className="relative group hover:text-green-200 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {itemCount}
                  </span>
                )}
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-white text-black border border-gray-300 text-xs rounded px-2 py-1 pointer-events-none">
                  Cart
                </span>
              </Link>

              <Link
                to="/orders"
                className="relative group hover:text-green-200 transition-colors"
              >
                <Package className="w-6 h-6" />
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-white text-black border border-gray-300 text-xs rounded px-2 py-1 pointer-events-none">
                  Orders
                </span>
              </Link>

              <div className="relative" ref={userMenuRef}>
                <User
                  onClick={handleUserIconClick}
                  className="w-6 h-6 cursor-pointer hover:text-green-200 transition-colors"
                />

                {showUserMenu && isLoggedIn && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md text-sm text-black z-10">
                    <div className="px-4 py-2 border-b text-sm text-gray-700">
                      <h3 className="text-[16px] font-[400]">Hi,</h3>
                      <h5 className="pl-4 font-[700]">{user?.name}</h5>
                    </div>

                    <Link
                      to="/account"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Account
                    </Link>
                    <Link
                      to="/feedback"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Feedback
                    </Link>
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
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

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 text-center shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Do you really want to logout?</h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
