import { useNavigate, Link } from "react-router-dom";
import {
  Trash2,
  MinusCircle,
  PlusCircle,
  FileUp,
  UploadCloud,
} from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { useEffect, useState } from "react";
import { toast } from "sonner";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Cart() {
  const navigate = useNavigate();
  const { items, setItems } = useCartStore();
  const [error, setError] = useState("");
  const [prescriptionRequired, setPrescriptionRequired] = useState(false);
  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    // Check if any item requires prescription
    const requiresPrescription = items.some(
      (item) => item?.product?.prescription_status === true
    );
    setPrescriptionRequired(requiresPrescription);
  }, [items]);

  const fetchCart = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/cart/get`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to fetch cart items");
      const data = await res.json();
      setItems(data.cartItems || []);
    } catch (error) {
      console.error("Error fetching cart:", error.message);
      setError(error.message);
      setItems([]);
    }
  };

  const handlePrescriptionUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("doctorName", "Dr. John Doe"); // default/fake, or add form inputs later
    formData.append("doctorSpecialization", "General Medicine");
    formData.append("notes", "Uploaded via cart page");
    formData.append(
      "medicines",
      JSON.stringify([{ name: "Required", dosage: "", frequency: "" }])
    );

    try {
      setUploading(true);
      const res = await fetch(`${API_BASE}/api/prescription/add`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      toast.success("Prescription uploaded successfully");
      setPrescriptionUploaded(true);
      setPrescriptionRequired(false);
    } catch (error) {
      toast.error("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateQuantity = async (productId, newQty) => {
    if (newQty < 1) {
      return handleRemoveItem(productId);
    }

    try {
      const res = await fetch(
        `${API_BASE}/api/cart/update-quantity`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity: newQty }),
        }
      );

      if (!res.ok) toast.error(res.message);

      await fetchCart();
    } catch (error) {
      toast.error("Error updating quantity: " + error.message);
    }
  };

  const subtotal = items.reduce((sum, item) => {
    if (
      !item ||
      !item.product ||
      typeof item.product.discount_price !== "number" ||
      typeof item.quantity !== "number"
    ) {
      return sum;
    }
    return sum + item.product.discount_price * item.quantity;
  }, 0);

  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;
  const handleRemoveItem = async (productId) => {
    try {
      const res = await fetch(`${API_BASE}/api/cart/delete`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) throw new Error("Failed to delete item");

      toast.success("Item deleted successfully from cart");
      await fetchCart();
    } catch (error) {
      toast.error("Error deleting item: " + error.message);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0 || (prescriptionRequired && !prescriptionUploaded))
      return;
    navigate("/cart/delivery");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your Cart is Empty
          </h2>
          {error && (
            <p className="text-red-600 mb-4">
              Error loading products in your cart.
            </p>
          )}
          <p className="text-gray-600 mb-8">
            Add some products to your cart to continue shopping.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-md"
          >
            Continue Shopping
          </button>
          <div className="mt-6">
            <p className="text-gray-600 mb-2">
              Or upload a prescription to order medicines
            </p>
            <Link
              to="/upload-prescription"
              className="inline-flex items-center px-6 py-3 border border-green-600 text-green-600 hover:bg-green-50 rounded-md"
            >
              <FileUp className="w-5 h-5 mr-2" />
              Upload Prescription
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
        {error && (
          <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-md">
            Error loading products in your cart.
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT - Item List */}
          <div className="lg:col-span-8">
            <div className="bg-white shadow-sm rounded-lg">
              {prescriptionRequired && !prescriptionUploaded && (
                <div className="p-6 border-t bg-yellow-50">
                  <p className="text-yellow-700 mb-2 text-sm">
                    ⚠️ One or more products in your cart require a prescription.
                  </p>
                  <label className="inline-flex items-center cursor-pointer text-green-600 hover:underline">
                    <UploadCloud className="w-5 h-5 mr-2" />
                    <span>Upload Prescription</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePrescriptionUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Please upload a clear image  with the prescription
                    date and doctor’s details visible.
                  </p>
                </div>
              )}
              {items.map((item) => {
                if (!item || !item.product) return null;

                return (
                  <div
                    key={item.product._id}
                    className="p-6 border-b last:border-b-0"
                  >
                    <div className="flex items-center">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <div className="ml-6 flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.product.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.product.description}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product._id,
                                  item.quantity - 1
                                )
                              }
                            >
                              <MinusCircle className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                            </button>
                            <span className="text-gray-700">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product._id,
                                  item.quantity + 1
                                )
                              }
                            >
                              <PlusCircle className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                            </button>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-lg font-medium text-gray-900">
                              ₹
                              {(
                                item.product.discount_price * item.quantity
                              ).toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{(item.product.price * item.quantity).toFixed(2)}
                            </span>
                            {item.product.discount > 0 && (
                              <span className="text-xs text-red-500 font-medium">
                                {item.product.discount}% off
                              </span>
                            )}
                            <button
                              onClick={() => handleRemoveItem(item.product._id)}
                            >
                              <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700 mt-2" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT - Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-medium">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">₹{total.toFixed(2)}</span>
                  </div>
                </div>
                {prescriptionRequired && !prescriptionUploaded && (
                  <p className="text-red-600 text-sm mb-2">
                    Some items require a valid prescription to proceed.
                  </p>
                )}
                <button
                  onClick={handleCheckout}
                  disabled={prescriptionRequired && !prescriptionUploaded}
                  className={`w-full py-3 px-4 rounded-md ${
                    prescriptionRequired && !prescriptionUploaded
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  Proceed to Checkout
                </button>
                <p className="text-sm text-gray-500 text-center mt-4">
                  Free shipping on orders above ₹500
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
