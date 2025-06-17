import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
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
  MessageSquare
  
} from 'lucide-react';

const Sidebar = ({ closeSidebar }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/category', icon: <ShoppingBag size={20} />, label: 'Category' },
    { path: '/sub-category', icon: <CopyMinus size={20} />, label: 'Sub Category' },
    { path: '/products', icon: <Package size={20} />, label: 'Products' },
    { path: '/orders', icon: <ShoppingCart  size={20}/>, label: 'Orders' },
    { path: '/users', icon: <Users size={20} />, label: 'Users' },
    { path: '/prescriptions', icon: <FileText size={20} />, label: 'Prescriptions' },
    { path: '/offers', icon: <Tag size={20} />, label: 'Offers & Discounts' },
    { path: '/banner', icon: <GalleryHorizontal size={20} />, label: 'Banners' },
    { path: '/reports', icon: <BarChart2 size={20} />, label: 'Reports' },
    { path: '/notifications', icon: <Bell size={20} />, label: 'Notifications' },
    { path: '/feedback', icon: <MessageSquare size={20} />, label: 'Feedback' },
  ];

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Close button (mobile only) */}
      <button 
        className="absolute right-4 top-4 p-1 text-gray-500 md:hidden" 
        onClick={closeSidebar}
      >
        <X size={20} />
      </button>
      
      {/* Logo */}
      <div className="flex items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-blue-600">Anand Medicals</h1>
      </div>
      
      {/* Navigation */}
      <nav className="mt-6 flex-1 space-y-1 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
            onClick={() => closeSidebar()}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      
      {/* Logout */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center rounded-md px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;