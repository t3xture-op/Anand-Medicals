import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { Toaster } from 'sonner';
import { ThemeProvider } from "../src/utils/ThemeProvider.js"

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/products/ProductList';
import ProductAdd from './pages/products/ProductAdd';
import ProductEdit from './pages/products/ProductEdit';
import CategoryList from './pages/categories/CategoryList';
import CategoryAdd from './pages/categories/CategoryAdd';
import CategoryEdit from './pages/categories/CategoryEdit';
import OrderList from './pages/orders/OrderList';
import OrderDetail from './pages/orders/OrderDetail';
import UserList from './pages/users/UserList';
import UserDetail from './pages/users/UserDetail';
import PrescriptionList from './pages/prescriptions/PrescriptionList';
import PrescriptionDetail from './pages/prescriptions/PrescriptionDetail';
import OfferList from './pages/offers/OfferList';
import OfferAdd from './pages/offers/OfferAdd';
import OfferEdit from './pages/offers/OfferEdit'
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Layout from './components/layout/Layout';
import BannerList from './pages/banners/BannerList';
import BannerAdd from './pages/banners/BannerAdd';
import SubCategoryList from './pages/subcategories/SubCategoryList'
import SubCategoryEdit from './pages/subcategories/subCategoryEdit'
import SubCategoryAdd from './pages/subcategories/subCategoryAdd';
import MyAccount from './pages/MyAccount'
import Feedback from './pages/feedback/Feedback';


// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const { isAuthenticated } = useContext(AuthContext);
  
  return (
    <>
    <ThemeProvider >
     <Toaster richColors position="top-center" />
    <Router>
     <div className="min-h-screen bg-white text-black dark:bg-[#0d1117] dark:text-white font-sans">
       
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          
          <Route path="my-account" element={<MyAccount />} />
          
          {/* Product Routes */}
          <Route path="products" element={<ProductList />} />
          <Route path="products/add" element={<ProductAdd />} />
          <Route path="products/edit/:id" element={<ProductEdit />} />

          {/* category Routes */}
          <Route path="category" element={<CategoryList />} />
          <Route path="category/add" element={<CategoryAdd />} />
          <Route path="category/edit/:id" element={<CategoryEdit />} />

          {/* sub category Routes */}
          <Route path="sub-category" element={<SubCategoryList />} />
          <Route path="sub-category/add" element={<SubCategoryAdd />} />
          <Route path="sub-category/edit/:id" element={<SubCategoryEdit />} />
          
          {/* Order Routes */}
          <Route path="orders" element={<OrderList />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          
          {/* User Routes */}
          <Route path="users" element={<UserList />} />
          <Route path="users/:id" element={<UserDetail />} />
          
          {/* Prescription Routes */}
          <Route path="prescriptions" element={<PrescriptionList />} />
          <Route path="prescriptions/:id" element={<PrescriptionDetail />} />
          
          {/* Offer Routes */}
          <Route path="offers" element={<OfferList />} />
          <Route path="offers/add" element={<OfferAdd />} />
          <Route path="offers/edit/:id" element={<OfferEdit />} />

             {/* banner Routes */}
          <Route path="banner" element={<BannerList/>} />
          <Route path="banner/add" element={<BannerAdd />} />
          
          
          {/* Other Routes */}
          <Route path="reports" element={<Reports />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="feedback" element={<Feedback />} />
        </Route>
      </Routes>
      </div>
    </Router>
    </ThemeProvider>
    </>
  );
}

export default App;