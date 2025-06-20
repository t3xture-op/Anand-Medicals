import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Package,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  ExternalLink,
  DollarSign,
  XCircle,
  CheckCircle,
} from "lucide-react";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    activeOrders: 0,
    cancelledOrders: 0,
    deliveredOrders: 0,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/user/get/${id}`);
        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data.user);
        setUserOrders(data.orders);
        setStats(data.stats);
      } catch (error) {
        console.error(error);
        navigate("/users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatDateTime = (dateString) =>
    new Date(dateString).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 animate-spin text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-700">
            Loading user data...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-6 fade-in text-gray-900 dark:text-gray-100">
      <div className="flex items-center">
        <button
          onClick={() => navigate("/users")}
          className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          User Profile
        </h1>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:bg-gray-900 dark:border-gray-700">
        <div className="md:flex">
          <div className="border-b border-gray-200 p-6 md:w-1/3 md:border-b-0 md:border-r dark:border-gray-700">
            <div className="flex flex-col items-center text-center">
              <img
                src={user.image || "/user.jpg"}
                alt={user.name}
                className="h-24 w-24 rounded-full"
              />
              <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Customer #{user._id}
              </p>

              <div className="mt-6 w-full space-y-4">
                <div className="flex items-center">
                  <Mail size={16} className="mr-2 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {user.email}
                  </span>
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="mr-2 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {user.phone || "N/A"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Joined {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:w-2/3">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900">
                <ShoppingBag
                  size={20}
                  className="mx-auto text-blue-600 dark:text-blue-300"
                />
                <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-300">
                  Total Orders
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.totalOrders}
                </p>
              </div>

              <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-900">
                <DollarSign
                  size={20}
                  className="mx-auto text-green-600 dark:text-green-300"
                />
                <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-300">
                  Total Spent
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  ₹{stats.totalSpent.toLocaleString()}
                </p>
              </div>

              <div className="rounded-lg bg-purple-50 p-4 text-center dark:bg-purple-900">
                <Package
                  size={20}
                  className="mx-auto text-purple-600 dark:text-purple-300"
                />
                <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-300">
                  Active Orders
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.activeOrders}
                </p>
              </div>

              <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900">
                <XCircle
                  size={20}
                  className="mx-auto text-red-600 dark:text-red-300"
                />
                <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-300">
                  Cancelled Orders
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.cancelledOrders}
                </p>
              </div>

              <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-900">
                <CheckCircle
                  size={20}
                  className="mx-auto text-emerald-600 dark:text-emerald-300"
                />
                <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-300">
                  Delivered Orders
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.deliveredOrders}
                </p>
              </div>
            </div>

            {user.addresses?.length > 0 && (
              <div className="mt-6">
                <h3 className="flex items-center text-lg font-medium text-gray-900 dark:text-white">
                  <MapPin size={18} className="mr-2 text-gray-500" />
                  Addresses
                </h3>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {user.addresses.map((address, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                    >
                      <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {address.type || "Home"}
                      </span>
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        <p>{address.street}</p>
                        <p>
                          {address.city}, {address.state} {address.pincode}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:bg-gray-900 dark:border-gray-700">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">
            Order History
          </h2>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {userOrders.length > 0 ? (
            userOrders.map((order) => (
              <div key={order._id} className="p-6">
                <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-base font-medium text-gray-900 dark:text-white">
                        #{order._id.slice(-6)}
                      </h3>
                      <span
                        className={`ml-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {formatDateTime(order.createdAt)}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-col items-end sm:mt-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      ₹{order.totalAmount.toFixed(2)}
                    </p>
                    <Link
                      to={`/orders/${order._id}`}
                      className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View Order
                      <ExternalLink size={14} className="ml-1" />
                    </Link>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center">
                    <Package size={16} className="mr-2 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {order.items?.length || 0} items
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {order.items?.map((item, i) => (
                      <span
                        key={i}
                        className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-white"
                      >
                        {item.name} x{item.quantity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No order history found for this user.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
