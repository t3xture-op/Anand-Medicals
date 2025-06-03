import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Landmark, Smartphone } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export default function Payment() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [onlinePaymentOption, setOnlinePaymentOption] = useState('gpay');
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  const handlePayment = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      clearCart();
      navigate('/payment-success');
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment</h1>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold text-gray-900">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Select Payment Method</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                className={`p-4 border rounded-lg flex items-center space-x-3 ${
                  paymentMethod === 'cod'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-500'
                }`}
                onClick={() => setPaymentMethod('cod')}
              >
                <Truck className="h-6 w-6 text-green-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Cash on Delivery</div>
                  <div className="text-sm text-gray-500">Pay when you receive</div>
                </div>
              </button>

              <button
                className={`p-4 border rounded-lg flex items-center space-x-3 ${
                  paymentMethod === 'online'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-500'
                }`}
                onClick={() => setPaymentMethod('online')}
              >
                <CreditCard className="h-6 w-6 text-green-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Online Payment</div>
                  <div className="text-sm text-gray-500">Cards, UPI, Net Banking</div>
                </div>
              </button>
            </div>

            {paymentMethod === 'online' && (
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Select Payment Option</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    className={`p-4 border rounded-lg flex items-center space-x-3 ${
                      onlinePaymentOption === 'gpay'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-500'
                    }`}
                    onClick={() => setOnlinePaymentOption('gpay')}
                  >
                    <Smartphone className="h-6 w-6 text-green-600" />
                    <span className="font-medium text-gray-900">Google Pay</span>
                  </button>

                  <button
                    className={`p-4 border rounded-lg flex items-center space-x-3 ${
                      onlinePaymentOption === 'netbanking'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-500'
                    }`}
                    onClick={() => setOnlinePaymentOption('netbanking')}
                  >
                    <Landmark className="h-6 w-6 text-green-600" />
                    <span className="font-medium text-gray-900">Net Banking</span>
                  </button>

                  <button
                    className={`p-4 border rounded-lg flex items-center space-x-3 ${
                      onlinePaymentOption === 'card'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-500'
                    }`}
                    onClick={() => setOnlinePaymentOption('card')}
                  >
                    <CreditCard className="h-6 w-6 text-green-600" />
                    <span className="font-medium text-gray-900">Credit/Debit Card</span>
                  </button>

                  <button
                    className={`p-4 border rounded-lg flex items-center space-x-3 ${
                      onlinePaymentOption === 'upi'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-500'
                    }`}
                    onClick={() => setOnlinePaymentOption('upi')}
                  >
                    <Smartphone className="h-6 w-6 text-green-600" />
                    <span className="font-medium text-gray-900">Other UPI Apps</span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={() => navigate('/cart/delivery')}
                className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handlePayment}
                className="px-6 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
