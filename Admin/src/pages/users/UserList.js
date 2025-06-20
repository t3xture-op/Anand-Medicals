import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  ExternalLink,
  X,
  TrendingUp,
  Calendar,
} from "lucide-react";

const UserList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderdetails, setOrderDetails] = useState([]);

  // Fetch users from backend
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("http://localhost:5000/api/user/get"); // Update with your backend base path if needed
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setLoading(false);
      }
    }

    fetchUsers();
    fetchOrder();
  }, []);

  async function fetchOrder() {
    try {
      const res = await fetch(
        "http://localhost:5000/api/orders/admin/user-order-stats",
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      console.log(data);
      setOrderDetails(data);
    } catch (error) {
      console.error("Failed to fetch order:", error);
      setLoading(false);
    }
  }

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    return (
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm)
    );
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "totalOrders":
        comparison = a.totalOrders - b.totalOrders;
        break;
      case "totalSpent":
        comparison = a.totalSpent - b.totalSpent;
        break;
      case "createdAt":
      default:
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Toggle sort order
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">Loading users...</div>
    );
  }

  return (
    <div className="space-y-6 fade-in text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          User Management
        </h1>
      </div>

      {/* Search and filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:bg-gray-900 dark:border-gray-700">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email or phone..."
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-[#0d1117]  dark:text-white dark:border-gray-600"
            />
          </div>

          {/* Filter button (mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:hidden dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <Filter size={18} className="mr-2" />
            Sort
            {sortBy !== "createdAt" && (
              <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                1
              </span>
            )}
          </button>

          {/* Sort options (desktop) */}
          <div className="hidden items-center space-x-4 sm:flex">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort by:
            </span>
            {["name", "totalOrders", "totalSpent", "createdAt"].map((field) => (
              <button
                key={field}
                onClick={() => toggleSort(field)}
                className={`flex items-center text-sm ${
                  sortBy === field
                    ? "font-medium text-blue-600 dark:text-blue-400"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                {field === "totalOrders"
                  ? "Orders"
                  : field === "totalSpent"
                  ? "Spent"
                  : field === "createdAt"
                  ? "Date Joined"
                  : "Name"}
                {sortBy === field && (
                  <span className="ml-1">
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            ))}
            {(searchTerm || sortBy !== "createdAt") && (
              <button
                onClick={clearFilters}
                className="flex items-center text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                <X size={16} className="mr-1" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Mobile sort options */}
        {showFilters && (
          <div className="mt-4 space-y-4 border-t border-gray-200 pt-4 sm:hidden dark:border-gray-700">
            <div className="space-y-2">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sort by:
              </span>
              <div className="flex flex-col space-y-2">
                {["name", "totalOrders", "totalSpent", "createdAt"].map(
                  (field) => (
                    <button
                      key={field}
                      onClick={() => toggleSort(field)}
                      className={`flex items-center rounded-md px-3 py-2 text-sm ${
                        sortBy === field
                          ? "bg-blue-50 font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                          : "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {field === "totalOrders"
                        ? "Orders"
                        : field === "totalSpent"
                        ? "Spent"
                        : field === "createdAt"
                        ? "Date Joined"
                        : "Name"}
                      {sortBy === field && (
                        <span className="ml-auto">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </button>
                  )
                )}
              </div>
            </div>

            {(searchTerm || sortBy !== "createdAt") && (
              <button
                onClick={clearFilters}
                className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-blue-400 dark:hover:bg-gray-700"
              >
                <X size={16} className="mr-1" />
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Users list */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sortedUsers.length > 0 ? (
          sortedUsers.map((user) => {
            const stats = orderdetails.find((o) => o.userId === user._id);
            return (
              <div
                key={user._id}
                className="card hover:shadow-md border border-gray-200 bg-white p-4 rounded-lg dark:bg-gray-900 dark:border-gray-700"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={user.image || "./user.jpg"}
                    alt={user.name}
                    className="h-12 w-12 rounded-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/100?text=User";
                    }}
                  />
                  <div className="flex-1 overflow-hidden">
                    <h3 className="truncate text-base font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-md bg-blue-50 p-3 text-center dark:bg-blue-900">
                    <div className="flex items-center justify-center text-blue-600 dark:text-blue-300">
                      <Calendar size={16} className="mr-1" />
                      <span className="text-xs font-medium">Joined</span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                  <div className="rounded-md bg-green-50 p-3 text-center dark:bg-green-900">
                    <div className="flex items-center justify-center text-green-600 dark:text-green-300">
                      <TrendingUp size={16} className="mr-1" />
                      <span className="text-xs font-medium">Total</span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                      ₹{stats?.totalSpent?.toLocaleString() || "0"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stats?.totalOrders || 0}{" "}
                    {stats?.totalOrders === 1 ? "order" : "orders"}
                  </span>
                  <Link
                    to={`/users/${user._id}`}
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    View Details
                    <ExternalLink size={14} className="ml-1" />
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm dark:bg-gray-900 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              No users found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
