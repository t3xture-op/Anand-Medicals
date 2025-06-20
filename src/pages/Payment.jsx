import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Truck } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { toast } from "sonner";

export default function Payment() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [shippingAddress, setShippingAddress] = useState(null);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product.price;
    const discount = item.product.discount || 0;
    const discountedPrice = price - (price * discount) / 100;
    return sum + discountedPrice * item.quantity;
  }, 0);

  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

  useEffect(() => {
    const selectedAddressId = localStorage.getItem("selectedAddressId");
    if (selectedAddressId) {
      setShippingAddress(selectedAddressId);
    } else {
      fetch("http://localhost:5000/api/address/default", {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.address?._id) {
            setShippingAddress(data.address._id);
          }
        })
        .catch((err) => console.error("Error fetching default address:", err));
    }
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (paymentMethod === "cod") {
      placeOrder();
    } else {
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error("Failed to load Razorpay SDK. Check your internet connection.");
        return;
      }

      const orderRes = await fetch(
        "http://localhost:5000/api/payment/razorpay",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ amount: total * 100 }),
        }
      );

      const orderData = await orderRes.json();

      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: "INR",
        name: "Anand Medicals",
        description: "Order Payment",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            const formattedItems = cartItems.map((item) => ({
              product: item.product._id,
              quantity: item.quantity,
              price: item.product.price,
            }));

            const confirmRes = await fetch(
              "http://localhost:5000/api/orders/add",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                  items: formattedItems,
                  shippingAddress,
                  totalAmount: total,
                  paymentMethod: "online",
                  paymentInfo: {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                  },
                }),
              }
            );

            const confirmData = await confirmRes.json();
            if (!confirmRes.ok)
              throw new Error(confirmData.message || "Order failed");

            await fetch("http://localhost:5000/api/cart/clear", {
              method: "DELETE",
              credentials: "include",
            });

            clearCart();
            navigate("/payment-success");
          } catch (err) {
            console.error("Payment handler error:", err);
            toast.error("Order failed after payment");
          }
        },
        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#22c55e",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    }
  };

  const placeOrder = async () => {
    try {
      const formattedItems = cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const orderData = {
        items: formattedItems,
        shippingAddress,
        totalAmount: total,
        paymentMethod: "cod",
      };

      const response = await fetch("http://localhost:5000/api/orders/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to place order");
      }

      await fetch("http://localhost:5000/api/cart/clear", {
        method: "DELETE",
        credentials: "include",
      });

      clearCart();
      navigate("/payment-success");
    } catch (error) {
      console.error("COD Order failed:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment</h1>

          {/* Product Items Preview */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Items in your Order
            </h2>
            <div className="space-y-4">
              {cartItems.map((item) => {
                const product = item.product;
                if (!product) return null;

                const originalPrice = product.price;
                const discountPercent = product.discount || 0;
                const discountedPrice =
                  originalPrice - (originalPrice * discountPercent) / 100;

                return (
                  <div
                    key={product._id}
                    className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="text-md font-medium text-gray-800">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                      <div className="mt-1 text-green-700 font-semibold">
                        ₹{(discountedPrice * item.quantity).toFixed(2)}
                      </div>
                      {discountPercent > 0 && (
                        <p className="text-xs text-gray-500 line-through">
                          MRP ₹{(originalPrice * item.quantity).toFixed(2)} (
                          {discountPercent}% OFF)
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Select Payment Method
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                className={`p-4 border rounded-lg flex items-center space-x-3 ${
                  paymentMethod === "cod"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-500"
                }`}
                onClick={() => setPaymentMethod("cod")}
              >
                <Truck className="h-6 w-6 text-green-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">
                    Cash on Delivery
                  </div>
                  <div className="text-sm text-gray-500">
                    Pay when you receive
                  </div>
                </div>
              </button>

              <button
                className={`p-4 border rounded-lg flex items-center space-x-3 ${
                  paymentMethod === "online"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-500"
                }`}
                onClick={() => setPaymentMethod("online")}
              >
                <CreditCard className="h-6 w-6 text-green-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">
                    Online Payment
                  </div>
                  <div className="text-sm text-gray-500">
                    Pay securely with Razorpay
                  </div>
                </div>
              </button>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={() => navigate("/cart/delivery")}
                className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handlePayment}
                className="px-6 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
              >
                {paymentMethod === "cod" ? "Place Order" : "Pay Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
