import React from 'react';
import { Routes, Route } from 'react-router-dom'; // removed BrowserRouter
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Products from './pages/Products';
import Categories from './pages/Categories';
import UploadPrescription from './pages/UploadPrescription';
import Cart from './pages/Cart';
import DeliveryAddress from './pages/DeliveryAddress';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import Feedback from './pages/Feedback';
import Orders from './pages/Orders';
import ResetPassword from './pages/ResetPassword'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/upload-prescription" element={<UploadPrescription />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/cart/delivery" element={<DeliveryAddress />} />
          <Route path="/cart/payment" element={<Payment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;