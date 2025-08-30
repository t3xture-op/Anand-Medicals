import { React, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  Home,
  Package,
  ShoppingBag,
  ShoppingCart,
  Users,
  FileText,
  Tag,
  BarChart2,
  Bell,
  X,
  LogOut,
  GalleryHorizontal,
  CopyMinus,
  MessageSquare,
  Sun,
  Moon,
  PackagePlus,
} from "lucide-react";
import { useTheme } from "../../utils/ThemeProvider.js";
const API_BASE = process.env.REACT_APP_API_BASE_URL;

const Sidebar = ({ closeSidebar }) => {
  const { logout } = useContext(AuthContext);
  const { setTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch(`${API_BASE}/api/user/admin/logout`, {
      method: "POST",
      credentials: "include",
    });
    logout();
  };

  const toggleTheme = () => {
    const current = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    const next = current === "dark" ? "light" : "dark";
    setTheme(next);
  };

  const navItems = [
    { path: "/", icon: <Home size={20} />, label: "Dashboard" },
    { path: "/category", icon: <ShoppingBag size={20} />, label: "Category" },
    {
      path: "/sub-category",
      icon: <CopyMinus size={20} />,
      label: "Sub Category",
    },
    { path: "/products", icon: <Package size={20} />, label: "Products" },
    {
      path: "/product-req",
      icon: <PackagePlus size={20} />,
      label: "Product Request",
    },
    { path: "/orders", icon: <ShoppingCart size={20} />, label: "Orders" },
    {
      path: "/prescriptions",
      icon: <FileText size={20} />,
      label: "Prescriptions",
    },
    { path: "/offers", icon: <Tag size={20} />, label: "Offers & Discounts" },
    {
      path: "/banner",
      icon: <GalleryHorizontal size={20} />,
      label: "Banners",
    },
    { path: "/reports", icon: <BarChart2 size={20} />, label: "Reports" },
    { path: "/users", icon: <Users size={20} />, label: "Users" },
    {
      path: "/notifications",
      icon: <Bell size={20} />,
      label: "Notifications",
    },
    { path: "/feedback", icon: <MessageSquare size={20} />, label: "Feedback" },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 h-screen flex flex-col bg-white border-r border-gray-200 dark:border-gray-700 text-black dark:bg-[#0d1117] dark:text-white shadow-xl drop-shadow-xl transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Close button (mobile only) */}
      <button
        className="absolute right-4 top-4 p-1 text-gray-500 dark:text-gray-400 md:hidden"
        onClick={closeSidebar}
      >
        <X size={20} />
      </button>

      {/* Logo */}
      <div className="flex items-center justify-center p-6 border-b border-gray-200 dark:border-gray-700">
        <img src="/anandmedicals.png" className="w-[90px] h-[90px] "></img>
      </div>

      {/* Navigation */}
      <nav
        className="  mt-6 flex-1 overflow-y-auto px-4 space-y-1
    scrollbar-thin scrollbar-thumb-black scrollbar-thumb-rounded-full scrollbar-track-transparent
    dark:scrollbar-thumb-gray-800 dark:scrollbar-track-gray-900"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-white"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              }`
            }
            onClick={() => closeSidebar()}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Theme toggle + Logout at bottom */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-2">
        <button
          onClick={toggleTheme}
          className="flex w-full items-center rounded-md px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          <Sun size={20} className="mr-3 dark:hidden" />
          <Moon size={20} className="mr-3 hidden dark:inline" />
          Toggle Theme
        </button>

        <button
          onClick={handleLogout}
          className="flex w-full items-center rounded-md px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
