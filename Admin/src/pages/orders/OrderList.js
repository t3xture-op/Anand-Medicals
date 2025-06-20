import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  ChevronDown,
  Calendar,
  X,
  ExternalLink,
} from "lucide-react";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [prescriptionFilter, setPresFilter] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const token =
          localStorage.getItem("accessToken") ||
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            ?.split("=")[1];

        const response = await fetch("http://localhost:5000/api/orders", {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            window.location.href = "/login";
            return;
          }
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err.message || "Failed to fetch orders. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSearch = order.customerName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchPayment = selectedPaymentMethod
      ? order.paymentMethod === selectedPaymentMethod
      : true;

    const matchesStatus = statusFilter ? order.status === statusFilter : true;

    const matchesPayment = paymentFilter
      ? order.paymentStatus === paymentFilter
      : true;

    const matchesPrescription =
      prescriptionFilter === "required"
        ? order.prescriptionRequired === true
        : prescriptionFilter === "notRequired"
        ? order.prescriptionRequired === false
        : true;

    let matchesDate = true;
    if (dateRange.from && dateRange.to) {
      const orderDate = new Date(order.orderDate);
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59);

      matchesDate = orderDate >= fromDate && orderDate <= toDate;
    }

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPayment &&
      matchesPrescription &&
      matchesDate &&
      matchSearch &&
      matchPayment
    );
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

  const getPaymentBadge = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setPaymentFilter("");
    setPresFilter("");
    setDateRange({ from: "", to: "" });
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
              Error loading orders
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
          Order Management
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
            {(statusFilter ||
              paymentFilter ||
              prescriptionFilter ||
              dateRange.from) && (
              <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                {(statusFilter ? 1 : 0) +
                  (paymentFilter ? 1 : 0) +
                  (prescriptionFilter ? 1 : 0) +
                  (dateRange.from ? 1 : 0)}
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
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/*Payment methoed filter*/}
            <select
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-[#0d1117] dark:border-gray-700 dark:text-white"
            >
              <option value="">All Payments</option>
              <option value="cod">Cash on Delivery</option>
              <option value="online">Online</option>
            </select>

            {/* Payment Status filter */}
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-[#0d1117] dark:border-gray-700 dark:text-white"
            >
              <option value="">All Payments</option>
              <option value="completed">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

            {/* Prescription filter */}
            <select
              value={prescriptionFilter}
              onChange={(e) => setPresFilter(e.target.value)}
              className="rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-[#0d1117] dark:border-gray-700 dark:text-white"
            >
              <option value="">All Orders</option>
              <option value="required">Prescription Required</option>
              <option value="notRequired">No Prescription</option>
            </select>

            {/* Date Range Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:bg-[#0d1117] dark:border-gray-700 dark:text-white"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Calendar size={16} className="mr-2" />
                Date Range
                <ChevronDown size={16} className="ml-2" />
              </button>

              {showFilters && (
                <div className="absolute right-0 z-10 mt-2 w-72 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-[#0d1117] dark:border-gray-700 dark:text-white">
                  <div className="p-4">
                    <div className="mb-4 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:bg-[#0d1117] dark:border-gray-700 dark:text-white">
                          From
                        </label>
                        <input
                          type="date"
                          value={dateRange.from}
                          onChange={(e) =>
                            setDateRange({ ...dateRange, from: e.target.value })
                          }
                          className="mt-1 block w-full dark:bg-[#0d1117] dark:border-gray-700 dark:text-white rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:bg-[#0d1117] dark:border-gray-700 dark:text-white">
                          To
                        </label>
                        <input
                          type="date"
                          value={dateRange.to}
                          onChange={(e) =>
                            setDateRange({ ...dateRange, to: e.target.value })
                          }
                          min={dateRange.from}
                          className="mt-1 block w-full rounded-md dark:bg-[#0d1117] dark:border-gray-700 dark:text-white border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowFilters(false)}
                        className="btn btn-sm btn-outline"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {(statusFilter ||
              paymentFilter ||
              prescriptionFilter ||
              dateRange.from) && (
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
          <div className="mt-4 space-y-4 border-t border-gray-200 pt-4 sm:hidden">
            {/* Order Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Order Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-[#0d1117] dark:border-gray-700 dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Payment Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Status
              </label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="mt-1 block w-full rounded-md border dark:bg-[#0d1117] dark:border-gray-700 dark:text-white border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Payments</option>
                <option value="completed">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <select
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="mt-1 block w-full rounded-md border dark:bg-[#0d1117] dark:border-gray-700 dark:text-white border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Methods</option>
                <option value="cod">Cash on Delivery</option>
                <option value="online">Online</option>
              </select>
            </div>

            {/* Prescription */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Prescription
              </label>
              <select
                value={prescriptionFilter}
                onChange={(e) => setPresFilter(e.target.value)}
                className="mt-1 block w-full rounded-md border dark:bg-[#0d1117] dark:border-gray-700 dark:text-white border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Orders</option>
                <option value="required">Prescription Required</option>
                <option value="notRequired">No Prescription</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:bg-[#0d1117] dark:border-gray-700 dark:text-white">
                Date Range
              </label>
              <div className="mt-1 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 dark:bg-[#0d1117] dark:border-gray-700 dark:text-white">
                    From
                  </label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, from: e.target.value })
                    }
                    className="block w-full rounded-md border dark:bg-[#0d1117] dark:border-gray-700 dark:text-white border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:bg-[#0d1117] dark:border-gray-700 dark:text-white">
                    To
                  </label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, to: e.target.value })
                    }
                    min={dateRange.from}
                    className="block w-full rounded-md border dark:bg-[#0d1117] dark:border-gray-700 dark:text-white border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {(statusFilter ||
              paymentFilter ||
              selectedPaymentMethod ||
              prescriptionFilter ||
              dateRange.from) && (
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

      {/* Orders table */}
      <div className="table-container rounded-md border border-gray-200 dark:border-[#30363d] bg-white dark:bg-[#161b22] p-2 shadow-sm">
        <table className="table w-full border-collapse text-sm bg-white dark:bg-[#161b22]">
          <thead className="table-header bg-gray-100 dark:bg-[#21262d]">
            <tr>
              {[
                "S.No.",
                "Order Number",
                "Customer",
                "Date",
                "Total",
                "Status",
                "Payment Method",
                "Payment",
                "Prescription",
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
              filteredOrders.map((order, index) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 dark:hover:bg-[#1e242c] transition"
                >
                  <td className="table-cell text-center font-medium text-gray-800 dark:text-gray-400">
                    {index + 1}
                  </td>
                  <td className="table-cell font-medium text-gray-800 dark:text-gray-400">
                    {order.orderNumber}
                  </td>
                  <td className="table-cell text-gray-700 dark:text-gray-400">
                    {order.customerName}
                  </td>
                  <td className="table-cell text-gray-700 dark:text-gray-400">
                    {formatDate(order.orderDate)}
                  </td>
                  <td className="table-cell font-medium text-gray-800 dark:text-gray-400">
                    ₹{order.totalAmount.toFixed(2)}
                  </td>
                  <td className="table-cell">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </td>
                  <td className="table-cell capitalize text-gray-700 dark:text-gray-400">
                    {order.paymentMethod}
                  </td>
                  <td className="table-cell">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getPaymentBadge(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus === "completed"
                        ? "Paid"
                        : order.paymentStatus.charAt(0).toUpperCase() +
                          order.paymentStatus.slice(1)}
                    </span>
                  </td>
                  <td className="table-cell">
                    {order.prescriptionRequired ? (
                      order.prescriptionStatus === "approved" ? (
                        <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-600">
                          Approved
                        </span>
                      ) : order.prescriptionStatus === "pending" ? (
                        <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                          Pending Review
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                          Rejected
                        </span>
                      )
                    ) : (
                      <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        Not Required
                      </span>
                    )}
                  </td>
                  <td className="table-cell">
                    <Link
                      to={`/orders/${order.id}`}
                      className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900"
                    >
                      <ExternalLink size={12} className="mr-1" />
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="10"
                  className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  {orders.length === 0
                    ? "No orders found."
                    : "No orders match your criteria."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
