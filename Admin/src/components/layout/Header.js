import React, { useContext, useState } from 'react';
import { Bell, Menu, User } from 'lucide-react';
import { notifications } from '../../utils/mockData';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Header = ({ title, toggleSidebar, user }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { logout } = useContext(AuthContext);
  
  const unreadNotifications = notifications.filter(notification => !notification.isRead).length;

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-white px-4 shadow-sm md:px-6">
      {/* Left side: Menu button (mobile) and title */}
      <div className="flex items-center">
        <button
          className="mr-4 rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-600 md:hidden"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      </div>
      
      {/* Right side: Notifications and user profile */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button
            className="relative rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-600"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
          >
            <Bell size={20} />
            {unreadNotifications > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                {unreadNotifications}
              </span>
            )}
          </button>
          
          {/* Notifications dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="border-b border-gray-100 px-4 py-2">
                <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map((notification) => (
                    <Link
                      key={notification.id}
                      to="/notifications"
                      className={`block px-4 py-2 text-sm hover:bg-gray-50 ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setShowNotifications(false)}
                    >
                      <p className="font-medium text-gray-900">{notification.title}</p>
                      <p className="text-gray-600">{notification.message}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </Link>
                  ))
                ) : (
                  <p className="px-4 py-2 text-sm text-gray-500">No notifications</p>
                )}
              </div>
              <div className="border-t border-gray-100 px-4 py-2">
                <Link
                  to="/notifications"
                  className="block text-center text-xs font-medium text-blue-600 hover:text-blue-500"
                  onClick={() => setShowNotifications(false)}
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {/* User profile */}
        <div className="relative">
          <button
            className="flex items-center rounded-full text-sm focus:outline-none"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
          >
                <User

                  className="w-6 h-6 cursor-pointer hover:bg-gray-100 hover:text-gray-600"
                />
          </button>
          
          {/* User dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="border-b border-gray-100 px-4 py-2">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  setShowUserMenu(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;