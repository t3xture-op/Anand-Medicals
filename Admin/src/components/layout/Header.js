import React, { useContext, useState, useEffect, useRef } from "react";
import { Bell, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "sonner";

const Header = ({ title, toggleSidebar }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const { user, isAuthenticated, loading, logout } = useContext(AuthContext);

  const notifRef = useRef();
  const userRef = useRef();
  const navigate = useNavigate();

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  // Notifications: SSE
  useEffect(() => {
    const evtSource = new EventSource("http://localhost:5000/api/notifications/stream");

    evtSource.onmessage = (e) => {
      try {
        const notif = JSON.parse(e.data);
        if (notif && notif._id) {
          setNotifications((prev) => [notif, ...prev]);

          toast(notif.title, {
            description: notif.message,
            action: {
              label: "View",
              onClick: () => {
                switch (notif.type) {
                  case "order":
                    navigate(`/orders/${notif.targetId}`);
                    break;
                  case "prescription":
                    navigate(`/prescriptions/${notif.targetId}`);
                    break;
                  case "stock":
                    navigate(`/products/edit/${notif.targetId}`);
                    break;
                  case "user":
                    navigate(`/users/${notif.targetId}`);
                    break;
                  default:
                    navigate("/notifications");
                }
              },
            },
          });
        }
      } catch (err) {
        console.error("Invalid SSE data:", e.data);
      }
    };

    evtSource.onerror = (err) => {
      console.error("❌ SSE Error:", err);
    };

    return () => evtSource.close();
  }, [navigate]);

  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.isRead).length);
  }, [notifications]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotifToggle = () => {
    setShowNotifications((prev) => !prev);
    setShowUserMenu(false);
  };

  const handleUserToggle = () => {
    setShowUserMenu((prev) => !prev);
    setShowNotifications(false);
  };

  const markAsRead = (id) => {
    if (!id) return;
    fetch(`http://localhost:5000/api/notifications/read/${id}`, {
      method: "PATCH",
    });
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/user/logout", {
      method: "POST",
      credentials: "include",
    });
    logout();
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-white px-4 shadow-sm md:px-6 text-black border-b border-gray-200 dark:border-gray-700 dark:bg-[#0d1117] dark:text-white transition-colors">
      <div className="flex items-center">
        <button
          className="mr-4 rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white md:hidden"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h1>
      </div>

      {isAuthenticated && user && (
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              className="relative rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              onClick={handleNotifToggle}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-md bg-white dark:bg-gray-900 py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-white/10">
                <div className="border-b border-gray-100 dark:border-gray-700 px-4 py-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <Link
                        key={n._id}
                        to="/notifications"
                        className={`block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 ${
                          !n.isRead
                            ? "bg-blue-50 dark:bg-blue-900/40"
                            : "bg-transparent"
                        }`}
                        onClick={() => {
                          markAsRead(n._id);
                          setShowNotifications(false);
                        }}
                      >
                        <p className="font-medium text-gray-900 dark:text-white">
                          {n.title}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          {n.message}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </Link>
                    ))
                  ) : (
                    <p className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                      No notifications
                    </p>
                  )}
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-2">
                  <Link
                    to="/notifications"
                    className="block text-center text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={() => setShowNotifications(false)}
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="relative" ref={userRef}>
            <img
              src={
                user.image
                  ? user.image
                  : "https://ui-avatars.com/api/?name=User&background=E2E8F0&color=2D3748&size=64"
              }
              alt="User Avatar"
              onClick={handleUserToggle}
              className="w-8 h-8 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
            />
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-md bg-white dark:bg-gray-900 py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-white/10">
                <div className="border-b border-gray-100 dark:border-gray-700 px-4 py-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
                <Link
                  to="/my-account"
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setShowUserMenu(false)}
                >
                  My Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
