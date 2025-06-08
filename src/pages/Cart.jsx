import { useNavigate, Link } from 'react-router-dom';
import { Trash2, MinusCircle, PlusCircle, FileUp } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useEffect, useState } from 'react';

export default function Cart() {
  const navigate = useNavigate();
  const { items, setItems } = useCartStore();
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/cart/get', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to fetch cart items');
      const data = await res.json();
      setItems(data.cartItems || []);
    } catch (error) {
      console.error('Error fetching cart:', error.message);
      setError(error.message);
      setItems([]);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const res = await fetch('http://localhost:5000/api/cart/delete', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) throw new Error('Failed to delete item');

      alert('Item deleted successfully from cart');
      await fetchCart();
    } catch (error) {
      alert('Error deleting item: ' + error.message);
    }
  };

  const handleUpdateQuantity = async (productId, newQty) => {
    if (newQty < 1) {
      return handleRemoveItem(productId);
    }

    try {
      const res = await fetch('http://localhost:5000/api/cart/update-quantity', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: newQty }),
      });

      if (!res.ok) alert(res.message)

      await fetchCart();
    } catch (error) {
      alert('Error updating quantity: ' + error.message);
    }
  };

  const subtotal = items.reduce((sum, item) => {
    if (
      !item ||
      !item.product ||
      typeof item.product.discount_price !== 'number' ||
      typeof item.quantity !== 'number'
    ) {
      return sum;
    }
    return sum + item.product.discount_price * item.quantity;
  }, 0);

  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (items.length === 0) return;
    navigate('/cart/delivery');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
          {error && (
            <p className="text-red-600 mb-4">Error loading products in your cart.</p>
          )}
          <p className="text-gray-600 mb-8">Add some products to your cart to continue shopping.</p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-md"
          >
            Continue Shopping
          </button>
          <div className="mt-6">
            <p className="text-gray-600 mb-2">Or upload a prescription to order medicines</p>
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
              {items.map((item) => {
                if (!item || !item.product) return null;

                return (
                  <div key={item.product._id} className="p-6 border-b last:border-b-0">
                    <div className="flex items-center">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <div className="ml-6 flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{item.product.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">{item.product.description}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <button onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}>
                              <MinusCircle className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                            </button>
                            <span className="text-gray-700">{item.quantity}</span>
                            <button onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}>
                              <PlusCircle className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                            </button>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-lg font-medium text-gray-900">
                              ₹{(item.product.discount_price * item.quantity).toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{(item.product.price * item.quantity).toFixed(2)}
                            </span>
                            {item.product.discount > 0 && (
                              <span className="text-xs text-red-500 font-medium">
                                {item.product.discount}% off
                              </span>
                            )}
                            <button onClick={() => handleRemoveItem(item.product._id)}>
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
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-medium">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">₹{total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700"
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
