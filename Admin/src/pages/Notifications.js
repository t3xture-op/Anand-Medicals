import React, { useState, useEffect } from "react";
import {
  Bell,
  Package,
  User,
  ShoppingBag,
  AlertTriangle,
  Check,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
const API_BASE = process.env.REACT_APP_API_BASE_URL;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/notifications`);
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const filteredNotifications = notifications.filter((n) =>
    filter === "all" ? true : n.type === filter
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const formatDate = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now - date;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    const icons = {
      order: <ShoppingBag className="h-6 w-6 text-blue-500" />,
      user: <User className="h-6 w-6 text-green-500" />,
      prescription: <Package className="h-6 w-6 text-purple-500" />,
      stock: <AlertTriangle className="h-6 w-6 text-amber-500" />,
    };
    return icons[type] || <Bell className="h-6 w-6 text-gray-500" />;
  };

  const markAllAsRead = async () => {
    await fetch(`${API_BASE}/api/admin/notifications/read-all`, {
      method: "PATCH",
      credentials:"include",
    });
    fetchNotifications();
  };

  const markAsRead = async (_id) => {
    await fetch(`${API_BASE}/api/admin/notifications/read/${_id}`, {
      method: "PATCH",
      credentials:"include",
    });
    fetchNotifications();
  };

  const clearAll = async () => {
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      await fetch(`${API_BASE}/api/admin/notifications/clear-all`, {
        method: "DELETE",
        credentials:"include",
      });
      fetchNotifications();
    }
  };
  const handleActionClick = (type, id) => {
    console.log("Navigation Triggered:", { type, id });
    if (!id) return toast.error("Missing target ID!");

    switch (type) {
      case "order":
        navigate(`/orders/${id}`);
        break;
      case "user":
        navigate(`/users/${id}`);
        break;
      case "prescription":
        navigate(`/prescriptions/${id}`);
        break;
      case "stock":
        navigate(`/products/edit/${id}`);
        break;
      default:
        break;
    }
  };

return (
  <div className="space-y-6 fade-in">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Notifications</h1>

      <div className="flex items-center space-x-2">
        <button
          onClick={markAllAsRead}
          className="flex items-center rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <Check size={16} className="mr-1" />
          Mark all as read
        </button>

        <button
          onClick={clearAll}
          className="flex items-center rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <X size={16} className="mr-1" />
          Clear all
        </button>
      </div>
    </div>

    <div className="border-b border-gray-200 dark:border-gray-600">
      <div className="flex">
        {["all", "order", "user", "prescription", "stock"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`relative px-4 py-2 text-sm font-medium border-b-2 focus:outline-none transition-colors duration-200 ${
              filter === type
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
            {type === "all" && unreadCount > 0 && (
              <span className="ml-2 rounded-full bg-blue-100 dark:bg-blue-800 px-2 py-0.5 text-xs text-blue-800 dark:text-white">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>

    <div className="space-y-4">
      {filteredNotifications.length > 0 ? (
        filteredNotifications.map((n) => (
          <div
            key={n._id}
            className={`rounded-lg border p-4 shadow-sm hover:shadow-md transition-colors ${
              n.isRead
                ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                : "bg-blue-50 dark:bg-blue-950 border-blue-100 dark:border-blue-500"
            }`}
          >
            <div className="flex">
              <div className="mr-4">{getNotificationIcon(n.type)}</div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h3
                      className={`text-base font-medium ${
                        n.isRead
                          ? "text-gray-900 dark:text-white"
                          : "text-blue-800 dark:text-blue-400"
                      }`}
                    >
                      {n.title}
                    </h3>
                    <p
                      className={`mt-1 text-sm ${
                        n.isRead
                          ? "text-gray-600 dark:text-gray-300"
                          : "text-blue-700 dark:text-blue-300"
                      }`}
                    >
                      {n.message}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                    {formatDate(n.createdAt)}
                    {!n.isRead && (
                      <div>
                        <button
                          onClick={() => markAsRead(n._id)}
                          className="mt-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                        >
                          Mark as read
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => handleActionClick(n.type, n.targetId)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium hover:opacity-90 ${
                      n.type === "order"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : n.type === "user"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : n.type === "prescription"
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                        : n.type === "stock"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {n.type === "stock"
                      ? "Update Stock"
                      : n.type === "prescription"
                      ? "Review Prescription"
                      : `View ${
                        n.type.charAt(0).toUpperCase() + n.type.slice(1)
                      }`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center shadow-sm">
          <Bell size={48} className="mx-auto text-gray-400 dark:text-gray-500" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">No notifications found.</p>
        </div>
      )}
    </div>
  </div>
);
}
export default Notifications;
