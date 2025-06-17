import React, { useEffect, useState } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Search,
  XCircle,
} from "lucide-react";

const getStatusIcon = (status) => {
  switch (status) {
    case "processing":
      return <Clock className="w-5 h-5 text-blue-500" />;
    case "shipped":
      return <Truck className="w-5 h-5 text-orange-500" />;
    case "delivered":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "cancelled":
      return <Package className="w-5 h-5 text-red-500" />;
    case "pending":
      return <Clock className="w-5 h-5 text-yellow-500" />;
    default:
      return null;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "shipped":
      return "bg-orange-100 text-orange-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function Orders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders/my", {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("❌ Error fetching orders:", data);
        setOrders([]);
        return;
      }
      setOrders(data);
    } catch (error) {
      console.error("❌ Network or parsing error:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmCancel) return;

    try {
      await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
        method: "PATCH",
        credentials: "include",
      });
      fetchOrders();
    } catch (error) {
      console.error("Error cancelling order", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders by ID or product name"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <p>Loading orders...</p>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No orders found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              We couldn't find any orders matching your search.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                          Order #{order._id}
                        </h2>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">
                            {order.status}
                          </span>
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ₹{order.totalAmount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.paymentMethod}
                      </p>
                      {order.status === "pending" && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="mt-2 inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded hover:bg-red-200"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-900">Items</h3>
                    <div className="mt-2 divide-y divide-gray-200">
                      {order.items.map((item) => {
                        const imgUrl = item.product.image || "/placeholder.jpg";
                        const discountedPrice =
                          item.product.offer?.discount_price;
                        const finalPrice = discountedPrice ?? item.price;
                        return (
                          <div
                            key={item._id}
                            className="py-4 flex items-center"
                          >
                            <img
                              src={imgUrl}
                              alt={item.product.name}
                              className="h-16 w-16 object-cover rounded-md"
                            />
                            <div className="ml-4 flex-1">
                              <h4 className="text-sm font-medium text-gray-900">
                                {item.product.name}
                              </h4>
                              <p className="mt-1 text-sm text-gray-500">
                                Quantity: {item.quantity} × ₹
                                {item.product.discount_price?.toFixed(2) ||
                                  item.price.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                ₹
                                {(
                                  item.quantity *
                                  (item.product.discount_price || item.price)
                                ).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-900">
                      Shipping Address
                    </h3>
                    <address className="mt-2 text-sm text-gray-500 not-italic">
                      {order.shippingAddress.fullName}
                      <br />
                      {order.shippingAddress.addressLine1}
                      <br />
                      {order.shippingAddress.addressLine2 &&
                        `${order.shippingAddress.addressLine2}, `}
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state} -{" "}
                      {order.shippingAddress.pincode}
                      <br />
                      Phone: {order.shippingAddress.phoneNumber}
                    </address>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
