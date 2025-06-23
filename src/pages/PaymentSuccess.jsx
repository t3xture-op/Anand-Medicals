import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to home after 5 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center">
          <CheckCircle className="w-20 h-20 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Order Successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            You will be redirected to the homepage in 5 seconds...
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-8 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}