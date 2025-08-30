import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";
const API_BASE = process.env.REACT_APP_API_BASE_URL;

function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reqProduct, setreqProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const reqProduct = await fetch(
          `${API_BASE}/api/product-request/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!reqProduct.ok) {
          throw new Error("Failed to fetch order");
        }

        const fetchedreq = await reqProduct.json();
        setreqProduct(fetchedreq);
        setSelectedStatus(fetchedreq.request_status);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setIsLoading(false);
        navigate("/product-req");
      }
    };

    fetchData();
  }, [id, navigate]);


  // Handle status update
  const handleStatusUpdate = async () => {
    if (selectedStatus === reqProduct.request_status) return;

    setIsUpdatingStatus(true);

    try {
      const response = await fetch(
        `${API_BASE}/api/product-request/status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: selectedStatus }),
        }
      );
      console.log(response.body);
      if (!response.ok) {
        throw new Error("Failed to update request status");
      }

      const updatedrequest = await response.json();
      setreqProduct(updatedrequest);
      toast.success(`Request status updated to: ${selectedStatus}`);
    } catch (error) {
      console.error("Error updating request status:", error);
      toast.error("Failed to update request status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "available":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";

    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-700">
            Loading request details...
          </p>
        </div>
      </div>
    );
  }

  if (!reqProduct) return null;
  return (
    <div className="space-y-6 fade-in dark:text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/product-req")}
            className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              Request #{reqProduct?._id?.substring(0, 8) || "N/A"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Placed on {formatDate(reqProduct?.createdAt)}
            </p>
          </div>
        </div>

        {/* Status Update Controls */}
        <div className="flex items-center space-x-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            disabled={
              isUpdatingStatus || reqProduct?.request_status === "cancelled"
            }
            className="rounded-md border border-gray-300 dark:border-gray-700 py-2 pl-3 pr-10 text-sm bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="available">Available</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={handleStatusUpdate}
            disabled={
              selectedStatus === reqProduct?.request_status ||
              isUpdatingStatus ||
              reqProduct?.request_status === "cancelled"
            }
            className={`btn btn-primary ${
              selectedStatus === reqProduct?.request_status || isUpdatingStatus
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isUpdatingStatus ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>

      {/* Request Status Overview */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0d1117] p-6 shadow-sm flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <ShoppingCart size={22} />
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Current Status
          </p>
          <p
            className={`mt-1 text-lg font-semibold ${getStatusColor(
              reqProduct?.request_status
            )}`}
          >
            {reqProduct?.request_status
              ? reqProduct.request_status.charAt(0).toUpperCase() +
                reqProduct.request_status.slice(1)
              : "Unknown"}
          </p>
        </div>
      </div>

      {/* Request Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Request Items */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0d1117] shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-800 dark:text-white">
                Request Items
              </h2>
              <Link
                to={`/product-req/${id}/add`}
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                Add Product
              </Link>
            </div>

            {/* Content */}
            <div className="p-6 space-y-2">
              <h3 className="text-base font-medium text-gray-900 dark:text-gray-200">
                Name: {reqProduct?.name || "Product"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Quantity: {reqProduct?.quantity || "N/A"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manufacturer: {reqProduct?.manufacturer || "N/A"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Category: {reqProduct?.category || "N/A"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Description: {reqProduct?.description || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0d1117] shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-800 dark:text-white">
                  Customer
                </h2>

                {reqProduct?.user?._id && (
                  <Link
                    to={`/users/${reqProduct.user._id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    View Profile
                  </Link>
                )}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center">
                <img
                  src={reqProduct?.user?.image || "/user.jpg"}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                  alt="Customer"
                />
                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-gray-300">
                    {reqProduct?.user?.name || "Customer"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Customer #{reqProduct?.user?._id?.substring(0, 8) || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestDetail;
