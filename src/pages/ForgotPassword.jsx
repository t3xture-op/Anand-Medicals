import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
 const API_BASE = import.meta.env.VITE_API_BASE_URL;
 
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSubmitted, setOtpSubmitted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
 
  // ✅ Redirect after successful OTP submission
  useEffect(() => {
    if (otpSubmitted) {
      navigate('/reset-password', { state: { email } });
    }
  }, [otpSubmitted, email, navigate]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/user/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || 'Error sending an email');
        return;
      }
      setSubmitted(true);
    } catch (error) {
      console.error("Email error:", error);
      toast.error("Something went wrong!");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/user/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Invalid OTP');
        return;
      }
      setOtpSubmitted(true);
    } catch (err) {
      console.error('OTP error:', err);
      setError("Invalid OTP. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md space-y-8">
        {!submitted ? (
          <>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">Reset your password</h2>
            <p className="text-center text-sm text-gray-600">
              Enter your email address and you will receive an OTP shortly.
            </p>
            <form className="space-y-6" onSubmit={handleEmailSubmit}>
              <input
                type="email"
                required
                placeholder="Email address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Send OTP
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
              OTP sent to <strong>{email}</strong>. Check your inbox or spam folder.
            </div>
            <form className="space-y-6" onSubmit={handleOtpSubmit}>
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Verify OTP
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
