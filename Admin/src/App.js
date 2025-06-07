import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

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
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Layout from './components/layout/Layout';

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
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          
          {/* Product Routes */}
          <Route path="products" element={<ProductList />} />
          <Route path="products/add" element={<ProductAdd />} />
          <Route path="products/edit/:id" element={<ProductEdit />} />

          {/* category Routes */}
          <Route path="category" element={<CategoryList />} />
          <Route path="category/add" element={<CategoryAdd />} />
          <Route path="category/edit/:id" element={<CategoryEdit />} />
          
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
          
          {/* Other Routes */}
          <Route path="reports" element={<Reports />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;