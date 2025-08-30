import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  ChevronDown,
  Calendar,
  X,
  FileEdit,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
const API_BASE = process.env.REACT_APP_API_BASE_URL;

function RequestList() {
  const [reqProducts, setReqProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [showDateRange, setShowDateRange] = useState(false);

  const dropdownRef = useRef(null);
  useEffect(() => {
    fetchProductRequest();
  }, []);

  const fetchProductRequest = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/product-request/all`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setReqProducts(data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading requests:", err);
      toast.error("Failed to load request");
      setError(err.message);
      setLoading(false);
    }
  };

  const filteredOrders = reqProducts.filter((reqProducts) => {
    const matchesSearch =
      reqProducts.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reqProducts.manufacturer &&
        reqProducts.manufacturer
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter
      ? reqProducts.request_status === statusFilter
      : true;

    let matchesDate = true;
    if (dateRange.from && dateRange.to) {
      const reqDate = new Date(reqProducts.createdAt);
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59);

      matchesDate = reqDate >= fromDate && reqDate <= toDate;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "available":
        return "bg-green-100 text-green-800";
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setDateRange({ from: "", to: "" });
  };

  const handleDelete = async (id) => {
    toast("DELETE PRODUCT", {
      description: "Are you sure you want to delete this request?",
      action: {
        label: "DELETE",
        onClick: async () => {
          try {
            const res = await fetch(
              `${API_BASE}/api/product-request/delete/${id}`,
              {
                method: "DELETE",
                credentials: "include",
              }
            );
            if (!res.ok) throw new Error("Delete failed");
            const updated = reqProducts.filter((p) => p._id !== id);
            setReqProducts(updated)
            toast.success("Product request deleted successfully");
          } catch (err) {
            console.error("Error deleting product request:", err);
            toast.error("Error deleting product request: " + err.message);
          }
        },
      },
    });
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading request
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Product Request Management
        </h1>
      </div>

      {/* Filters and search */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0d1117] p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={18} className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order number or customer name..."
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0d1117] py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Filter button (mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:hidden"
          >
            <Filter size={18} className="mr-2" />
            Filters
            {(statusFilter || dateRange.from) && (
              <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                {(statusFilter ? 1 : 0) + (dateRange.from ? 1 : 0)}
              </span>
            )}
          </button>

          {/* Filters (desktop) */}
          <div className="hidden items-center gap-3 sm:flex">
            {/* Order Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-[#0d1117] dark:border-gray-700 dark:text-white"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="available">Available</option>
            </select>

            {/* Date Range Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:bg-[#0d1117] dark:border-gray-700 dark:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDateRange((prev) => !prev);
                }}
              >
                <Calendar size={16} className="mr-2" />
                Date Range
                <ChevronDown size={16} className="ml-2" />
              </button>

              {showDateRange && (
                <div
                  className="absolute right-0 z-10 mt-2 w-72 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-[#0d1117] dark:border-gray-700 dark:text-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-4">
                    <div className="mb-4 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">
                          From
                        </label>
                        <input
                          type="date"
                          value={dateRange.from}
                          onChange={(e) =>
                            setDateRange({ ...dateRange, from: e.target.value })
                          }
                          className="mt-1 block w-full rounded-md border border-gray-300 dark:bg-[#0d1117] dark:border-gray-700 dark:text-white px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">
                          To
                        </label>
                        <input
                          type="date"
                          value={dateRange.to}
                          onChange={(e) =>
                            setDateRange({ ...dateRange, to: e.target.value })
                          }
                          min={dateRange.from}
                          className="mt-1 block w-full rounded-md border border-gray-300 dark:bg-[#0d1117] dark:border-gray-700 dark:text-white px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowDateRange(false)}
                        className="btn btn-sm btn-outline"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {(statusFilter || dateRange.from) && (
              <button
                onClick={clearFilters}
                className="flex items-center text-sm text-blue-600 hover:text-blue-500"
              >
                <X size={16} className="mr-1" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Mobile filters */}
        {showFilters && (
          <div
            className="mt-4 space-y-4 border-t border-gray-200 pt-4 sm:hidden"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            {/* Order Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Request Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-[#0d1117] dark:border-gray-700 dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="available">Available</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Date Range
              </label>
              <div className="mt-1 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-white">
                    From
                  </label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, from: e.target.value })
                    }
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-[#0d1117] dark:border-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-white">
                    To
                  </label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, to: e.target.value })
                    }
                    min={dateRange.from}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-[#0d1117] dark:border-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <button
              className="w-full mt-4 rounded-md bg-blue-600 py-2 text-sm text-white"
              onClick={() => setShowFilters(false)}
            >
              Apply Filters
            </button>

            {/* Clear Filters */}
            {(statusFilter || dateRange.from) && (
              <button
                onClick={clearFilters}
                className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm hover:bg-gray-50"
              >
                <X size={16} className="mr-1" />
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/*  table */}
      <div className="table-container rounded-md border border-gray-200 dark:border-[#30363d] bg-white dark:bg-[#161b22] p-2 shadow-sm">
        <table className="table w-full border-collapse text-sm bg-white dark:bg-[#161b22]">
          <thead className="table-header bg-gray-100 dark:bg-[#21262d]">
            <tr>
              {[
                "S.No.",
                "Request Number",
                "Name",
                "Quantity",
                "Manufacturer",
                "Category",
                "Customer",
                "Date",
                "Actions",
              ].map((title, idx) => (
                <th
                  key={idx}
                  className="table-header-cell text-gray-700 dark:text-white border-b border-gray-200 dark:border-[#30363d] text-center"
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="table-body bg-white dark:bg-[#161b22] divide-y divide-gray-200 dark:divide-gray-700">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((req, index) => (
                <tr
                  key={req._id}
                  className="hover:bg-gray-50 dark:hover:bg-[#1e242c] transition"
                >
                  {/* Serial Number */}
                  <td className="table-cell text-center font-medium text-gray-800 dark:text-gray-400">
                    {index + 1}
                  </td>

                  {/* Request Number (using _id) */}
                  <td className="table-cell font-medium text-gray-800 dark:text-gray-400">
                    {req._id}
                  </td>

                  {/* Name */}
                  <td className="table-cell text-gray-700 dark:text-gray-400">
                    {req.name}
                  </td>

                  {/* Quantity */}
                  <td className="table-cell text-gray-700 dark:text-gray-400">
                    {req.quantity}
                  </td>

                  {/* Manufacturer */}
                  <td className="table-cell text-gray-700 dark:text-gray-400">
                    {req.manufacturer || "N/A"}
                  </td>

                  {/* Category */}
                  <td className="table-cell text-gray-700 dark:text-gray-400">
                    {req.category || "N/A"}
                  </td>

                  {/* Customer (from user populate) */}
                  <td className="table-cell text-gray-700 dark:text-gray-400">
                    {req.user?.name || "N/A"}
                  </td>

                  {/* Date */}
                  <td className="table-cell text-gray-700 dark:text-gray-400">
                    {formatDate(req.createdAt)}
                  </td>

                  {/* Status */}
                  <td className="table-cell">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(
                        req.request_status
                      )}`}
                    >
                      {req.request_status.charAt(0).toUpperCase() +
                        req.request_status.slice(1)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <Link
                        to={`/product-req/${req._id}`}
                        className="rounded-md p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900"
                        title="Edit"
                      >
                        <FileEdit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(req._id)}
                        className="rounded-md p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="10"
                  className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  {reqProducts.length === 0
                    ? "No product request found."
                    : "No request match your criteria."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RequestList;
