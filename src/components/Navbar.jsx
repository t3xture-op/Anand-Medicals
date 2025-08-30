import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, FileUp, Package, Menu } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { AuthContext } from "../authContext";
import SearchBar from "./SearchBar";
import userPlaceholder from "../public/userPlaceholder.png";
import anandmedicals from "../public/anandmedicals.png";
import{ RequestMedicine}from "../pages/RequestMedicine";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { isLoggedIn, user, setIsLoggedIn, setUser } = useContext(AuthContext);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [openMedicineModal, setOpenMedicineModal] = useState(false);
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
      setShowUserMenu((prev) => !prev);
    } else {
      navigate("/login");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/api/user/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      setIsLoggedIn(false);
      setShowUserMenu(false);
      setShowLogoutConfirm(false);
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/user/am`, {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (err) {
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    fetchUser();
  }, []);

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
      <nav className="bg-green-700 text-white shadow-lg pb-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src={anandmedicals}
                onError={(e) => (e.target.src = userPlaceholder)}
                className="w-[60px] h-[60px] rounded-full object-cover"
              />
              <span className="text-2xl font-bold tracking-tight">
                ANAND MEDICALS
              </span>
            </Link>

            <div className="md:hidden flex items-center space-x-2">
              {isLoggedIn && (
                <button
                  onClick={() => setShowMobileMenu((prev) => !prev)}
                  className="focus:outline-none"
                >
                  <img
                    src={user?.image ? user.image : userPlaceholder}
                    alt="User Avatar"
                    className="w-9 h-9 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </button>
              )}
              {!isLoggedIn && (
                <span
                  className="cursor-pointer hover:underline hover:text-green-200 font-medium"
                  onClick={() => navigate("/login")}
                >
                  Login
                </span>
              )}

              <button
                className="text-white focus:outline-none"
                onClick={() => setShowMobileMenu((prev) => !prev)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            <div className="hidden md:flex flex-1 mx-8">
              <div className="w-full max-w-4xl">
                <SearchBar
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search medicines, healthcare products..."
                />
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6">
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
              {!isLoggedIn && (
                <div className="text-sm space-x-1">
                  <span
                    className="cursor-pointer hover:underline hover:text-green-200 font-medium"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </span>
                  <span className="font-medium">|</span>
                  <span
                    className="cursor-pointer hover:underline hover:text-green-200 font-medium"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </span>
                </div>
              )}
              <div className="relative z-50" ref={userMenuRef}>
                {isLoggedIn && (
                  <>
                    <button
                      onClick={handleUserIconClick}
                      className="focus:outline-none"
                    >
                      <img
                        src={user?.image || userPlaceholder}
                        alt="User"
                        className="w-9 h-9 mt-1 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </button>

                    {showUserMenu && (
                      <div className="hidden md:block absolute mt-2 w-44 bg-white border rounded shadow-md text-sm text-black z-50 right-0">
                        <div className="px-4 py-2 border-b text-sm text-gray-700">
                          <h3 className="text-[16px] font-[400]">Hi,</h3>
                          <h5 className="pl-4 font-[700]">{user?.name}</h5>
                        </div>
                        <Link
                          to="/my-account"
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

                        {/* ✅ New Request Medicine option */}
                        <button
                          onClick={() => {
                            setOpenMedicineModal(true);
                            setShowUserMenu(false);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Request a product
                        </button>
                        <button
                          onClick={() => setShowLogoutConfirm(true)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search bar */}
        <div className="md:hidden px-4 pt-2">
          <SearchBar
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search medicines, healthcare products..."
          />
        </div>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="md:hidden px-4 pt-2 space-y-2 pb-4">
            {isLoggedIn && (
              <div className="text-white border-b border-white/30 pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={user?.image || userPlaceholder}
                      alt="User Avatar"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm">Hi,</p>
                      <p className="font-semibold">{user?.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="text-sm text-red-300 hover:text-red-500"
                  >
                    Logout
                  </button>
                </div>

                <Link
                  to="/my-account"
                  className="block py-2 hover:text-green-200"
                  onClick={() => setShowMobileMenu(false)}
                >
                  My Account
                </Link>
                <Link
                  to="/feedback"
                  className="block py-2 hover:text-green-200"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Feedback
                </Link>
                {/* ✅ New Request Medicine option */}
                <button
                  onClick={() => {
                    setOpenMedicineModal(true);
                    setShowUserMenu(false);
                  }}
                  className="block py-2 hover:text-green-200"
                >
                  Request a product
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-3">
              <div className="flex flex-col space-y-2">
                <Link
                  to="/cart"
                  className="block text-white hover:text-green-200"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Cart
                </Link>
                <Link
                  to="/upload-prescription"
                  className="block text-white hover:text-green-200"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Upload Prescription
                </Link>
                <Link
                  to="/products"
                  className="block text-white hover:text-green-200"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Products
                </Link>
                <Link
                  to="/categories"
                  className="block text-white hover:text-green-200"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Categories
                </Link>
                <Link
                  to="/orders"
                  className="block text-white hover:text-green-200"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Orders
                </Link>
              </div>
            </div>

            {!isLoggedIn && (
              <div className="pt-4 space-x-2 text-sm">
                <span
                  className="cursor-pointer text-white hover:text-green-200"
                  onClick={() => {
                    setShowMobileMenu(false);
                    navigate("/login");
                  }}
                >
                  Login
                </span>
                <span className="text-white">|</span>
                <span
                  className="cursor-pointer text-white hover:text-green-200"
                  onClick={() => {
                    setShowMobileMenu(false);
                    navigate("/register");
                  }}
                >
                  Register
                </span>
              </div>
            )}
          </div>
        )}
        <RequestMedicine
          open={openMedicineModal}
          setOpen={setOpenMedicineModal}
        />
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 text-center shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Do you really want to logout?
            </h2>
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
