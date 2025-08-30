import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';



import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetails';
import Categories from './pages/Categories';
import CategoryPage from './pages/CategoryPage';
import UploadPrescription from './pages/UploadPrescription';
import Cart from './pages/Cart';
import DeliveryAddress from './pages/DeliveryAddress';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import Feedback from './pages/Feedback';
import Orders from './pages/Orders';
import ResetPassword from './pages/ResetPassword'
import MyAccount from './pages/MyAccount';
import SubCategoryProducts from './pages/SubCategoryProducts';
import AboutUs from './pages/AboutUs';
import StoreLocator from './pages/StoreLocator';
import ScrollToTop from './components/ScrollToTop';
import MedicinesPage from './pages/MedicinesPage';
import { RequestMedicine}  from './pages/RequestMedicine';
import ProductAvailabilityPopup from './components/ProductAvailablePopup'

function App() {
  return (
    <div className=" bg-gray-50 flex flex-col">
       <Toaster richColors position="top-center" />
       <ScrollToTop/>
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:id" element={<CategoryPage />} />    
          <Route path="/subcategory/:id" element={<SubCategoryProducts />} />
          <Route path="/upload-prescription" element={<UploadPrescription />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/cart/delivery" element={<DeliveryAddress />} />
          <Route path="/cart/payment" element={<Payment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/stores" element={<StoreLocator />} />
          <Route path="/medicines" element={<MedicinesPage />} />
          <Route path="/request-product" element={<RequestMedicine />} />
          
        </Routes>
      </div>
      <Footer />
       <ProductAvailabilityPopup API_BASE={import.meta.env.VITE_API_BASE_URL} />
    </div>
  );
}

export default App;