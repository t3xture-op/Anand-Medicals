import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Truck,
  CreditCard,
  FileText,
  User,
  MapPin,
  Package,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [copyStatus, setCopyStatus] = useState(null);

  // Fetch order and prescription data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const orderResponse = await fetch(
          `http://localhost:5000/api/orders/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!orderResponse.ok) {
          throw new Error("Failed to fetch order");
        }

        const fetchedOrder = await orderResponse.json();
        setOrder(fetchedOrder);
        setSelectedStatus(fetchedOrder.status);

        // If order has prescription, fetch prescription details
        if (fetchedOrder.prescriptionId) {
          const prescriptionResponse = await fetch(
            `http://localhost:5000/api/prescriptions/${fetchedOrder.prescriptionId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (prescriptionResponse.ok) {
            const prescriptionData = await prescriptionResponse.json();
            setPrescription(prescriptionData);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setIsLoading(false);
        navigate("/orders");
      }
    };

    fetchData();
  }, [id, navigate]);

  // Handle status update
  const handleStatusUpdate = async () => {
    if (selectedStatus === order.status) return;

    setIsUpdatingStatus(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ status: selectedStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      alert(`Order status updated to: ${selectedStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Status color mapping
  const getStatusColor = (status) => {
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

  const copyCoordinates = (lat, lng) => {
    navigator.clipboard.writeText(`${lat},${lng}`);
    setCopyStatus("Copied!");
    setTimeout(() => setCopyStatus(null), 2000);
  };

  // Payment status color mapping
  const getPaymentColor = (status) => {
    switch (status) {
      case "paid":
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

  // Format date for display
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
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/orders")}
            className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Order #{order._id.substring(0, 8)}
            </h1>
            <p className="text-sm text-gray-500">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            disabled={isUpdatingStatus || order.status === "cancelled"}
            className="rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={handleStatusUpdate}
            disabled={
              selectedStatus === order.status ||
              isUpdatingStatus ||
              order.status === "cancelled"
            }
            className={`btn btn-primary ${
              selectedStatus === order.status || isUpdatingStatus
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isUpdatingStatus ? "Updating..." : "Update Status"}
          </button>
          {/* Removed stray // ... comment here */}
        </div>
      </div>

      {/* Order Status Overview */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="flex items-start">
            <div className="mr-4 rounded-full bg-blue-100 p-3 text-blue-600">
              <ShoppingCart size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p
                className={`mt-1 text-sm font-semibold ${
                  getStatusColor(order.status).split(" ")[1]
                }`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="mr-4 rounded-full bg-green-100 p-3 text-green-600">
              <CreditCard size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Payment</p>
              <p className="mt-1 flex items-center text-sm">
                <span
                  className={`mr-2 rounded-full px-2 py-0.5 text-xs font-medium ${getPaymentColor(
                    order.paymentStatus
                  )}`}
                >
                  {order.paymentStatus.charAt(0).toUpperCase() +
                    order.paymentStatus.slice(1)}
                </span>
                <span className="font-medium text-gray-900">
                  {order.paymentMethod}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="mr-4 rounded-full bg-purple-100 p-3 text-purple-600">
              <Truck size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Delivery</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {order.deliveryDate
                  ? formatDate(order.deliveryDate)
                  : "Not delivered yet"}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="mr-4 rounded-full bg-amber-100 p-3 text-amber-600">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Prescription</p>
              {order.prescriptionId ? (
                <p className="mt-1 flex items-center text-sm">
                  {prescription?.status === "approved" ? (
                    <>
                      <CheckCircle size={16} className="mr-1 text-green-500" />
                      <span className="font-medium text-green-700">
                        Approved
                      </span>
                    </>
                  ) : prescription?.status === "pending" ? (
                    <>
                      <AlertTriangle
                        size={16}
                        className="mr-1 text-amber-500"
                      />
                      <span className="font-medium text-amber-700">
                        Pending Review
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle size={16} className="mr-1 text-red-500" />
                      <span className="font-medium text-red-700">Rejected</span>
                    </>
                  )}
                </p>
              ) : (
                <p className="mt-1 text-sm text-gray-500">Not Required</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-800">Order Items</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <div key={item._id} className="p-6">
                  <div className="flex items-center">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      {item.product?.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product?.name || "Product"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100">
                          {/* <Package size={24} className="text-gray-400" /> */}
                          <img
                            src={item.product.image}
                            alt={item.product?.name || "Product"}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-base font-medium text-gray-900">
                            {item.product?.name || "Product"}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Quantity: {item.quantity} × ₹
                            {item.product.discount_price?.toFixed(2) ||
                              item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                                ₹
                                {(
                                  item.quantity *
                                  (item.product.discount_price || item.price)
                                ).toFixed(2)}
                              </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Order Summary */}
              <div className="space-y-2 bg-gray-50 p-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <p>Subtotal</p>
                  <p>₹{order.totalAmount.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <p>Shipping</p>
                  <p>₹0.00</p>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <p>Tax</p>
                  <p>Included</p>
                </div>
                <div className="flex justify-between pt-2 text-base font-medium text-gray-900">
                  <p>Total</p>
                  <p>₹{order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer and Prescription Info */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-800">Customer</h2>
                <Link
                  to={`/users/${order.user._id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View Profile
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-gray-100 p-2">
                  <User size={20} className="text-gray-600" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    {order.user?.name || "Customer"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Customer #{order.user?._id?.substring(0, 8) || "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="flex items-center text-sm font-medium text-gray-900">
                  <MapPin size={16} className="mr-2 text-gray-500" />
                  Shipping Address
                </h4>
                <div className="mt-2 rounded-md bg-gray-50 p-3 text-sm text-gray-600">
                  {order.shippingAddress ? (
                    <>
                      <p>
                        <strong>{order.shippingAddress.fullName}</strong>
                      </p>
                      <p>{order.shippingAddress.phoneNumber}</p>
                      <p>{order.shippingAddress.addressLine1}</p>
                      {order.shippingAddress.addressLine2 && (
                        <p>{order.shippingAddress.addressLine2}</p>
                      )}
                      <p>
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state} -{" "}
                        {order.shippingAddress.pincode}
                      </p>

                      {/* Add coordinates display here */}
                      <div className="mt-2 flex items-center">
                        <span className="font-medium text-gray-900 mr-2">
                          Coordinates:
                        </span>
                        {order.shippingAddress.coordinates ? (
                          <>
                            <span
                              className="cursor-pointer text-blue-600 hover:underline"
                              onClick={() =>
                                copyCoordinates(
                                  order.shippingAddress.coordinates.lat,
                                  order.shippingAddress.coordinates.lng
                                )
                              }
                            >
                              {order.shippingAddress.coordinates.lat},{" "}
                              {order.shippingAddress.coordinates.lng}
                            </span>
                            {copyStatus && (
                              <span className="ml-2 text-xs text-green-600">
                                {copyStatus}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-600">nil</span>
                        )}
                      </div>
                    </>
                  ) : (
                    <p>Address not available</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Prescription Information (if required) */}
          {order.prescriptionId && prescription && (
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-800">
                    Prescription
                  </h2>
                  <Link
                    to={`/prescriptions/${prescription._id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Review
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4 overflow-hidden rounded-lg border border-gray-200">
                  <img
                    src={prescription.image}
                    alt="Prescription"
                    className="h-48 w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/400x200?text=Prescription+Image";
                    }}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Status:
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        prescription.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : prescription.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {prescription.status.charAt(0).toUpperCase() +
                        prescription.status.slice(1)}
                    </span>
                  </div>

                  {prescription.reviewedBy && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Reviewed by:
                        </span>
                        <span className="text-sm text-gray-900">
                          {prescription.reviewedBy}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Review date:
                        </span>
                        <span className="text-sm text-gray-900">
                          {formatDate(prescription.reviewDate)}
                        </span>
                      </div>
                    </>
                  )}

                  {prescription.notes && (
                    <div className="pt-2">
                      <span className="text-sm font-medium text-gray-500">
                        Notes:
                      </span>
                      <p className="mt-1 text-sm text-gray-600">
                        {prescription.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
