import React, { useContext, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Menu } from "lucide-react";

const Layout = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;

    if (path === "/") return "Dashboard";
    if (path.startsWith("/products")) {
      if (path === "/products") return "Products";
      if (path.includes("/add")) return "Add Product";
      if (path.includes("/edit")) return "Edit Product";
    }
    if (path.startsWith("/category")) {
      if (path === "/category") return "Category";
      if (path.includes("/add")) return "Add Category";
      if (path.includes("/edit")) return "Edit Category";
    }
    if (path.startsWith("/sub-category")) {
      if (path === "/sub-category") return "Sub Category";
      if (path.includes("/add")) return "Add Sub Category";
      if (path.includes("/edit")) return "Edit Sub Category";
    }
    if (path.startsWith("/banner")) {
      if (path === "/banner") return "Banner";
      if (path.includes("/add")) return "Add Banner";
    }
    if (path.startsWith("/orders")) {
      if (path === "/orders") return "Orders";
      return "Order Details";
    }
    if (path.startsWith("/users")) {
      if (path === "/users") return "Users";
      return "User Details";
    }
    if (path.startsWith("/prescriptions")) {
      if (path === "/prescriptions") return "Prescriptions";
      return "Prescription Details";
    }
    if (path.startsWith("/offers")) {
      if (path === "/offers") return "Offers & Discounts";
      if (path.includes("/add")) return "Add Offer";
    }
    if (path === "/reports") return "Reports";
    if (path === "/notifications") return "Notifications";

    return "Anand Admin";
  };

  return (
    <div className="flex h-screen bg-white text-black dark:bg-[#0d1117] dark:text-white transition-colors">
      {/* Sidebar for desktop */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white dark:bg-[#161b22] shadow-lg transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          user={user}
          title={getPageTitle()}
          toggleSidebar={toggleSidebar}
        />

        <main className="flex-1 overflow-y-auto bg-white dark:bg-[#0d1117] p-4 md:p-6 transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
