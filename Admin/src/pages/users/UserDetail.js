import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Package, 
  Mail, 
  Phone, 
  Calendar, 
  ShoppingBag,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { users, orders } from '../../utils/mockData';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch user data
  useEffect(() => {
    const fetchData = () => {
      // In a real app, this would be an API call
      const foundUser = users.find(u => u.id === id);
      
      if (foundUser) {
        setUser(foundUser);
        
        // Get user orders
        const foundOrders = orders.filter(order => order.customerId === id);
        setUserOrders(foundOrders);
      } else {
        // User not found, redirect to users list
        navigate('/users');
      }
      
      setIsLoading(false);
    };
    
    // Simulate API delay
    setTimeout(fetchData, 500);
  }, [id, navigate]);
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format date with time for display
  const formatDateTime = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading user data...</p>
        </div>
      </div>
    );
  }
  
  if (!user) return null;
  
  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center">
        <button
          onClick={() => navigate('/users')}
          className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">User Profile</h1>
      </div>
      
      {/* User Profile */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="md:flex">
          {/* User Info */}
          <div className="border-b border-gray-200 p-6 md:w-1/3 md:border-b-0 md:border-r">
            <div className="flex flex-col items-center text-center">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-24 w-24 rounded-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/100?text=User';
                }}
              />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">Customer #{user.id}</p>
              
              <div className="mt-6 w-full space-y-4">
                <div className="flex items-center">
                  <Mail size={16} className="mr-2 text-gray-400" />
                  <span className="text-sm text-gray-600">{user.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="mr-2 text-gray-400" />
                  <span className="text-sm text-gray-600">{user.phone}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 text-gray-400" />
                  <span className="text-sm text-gray-600">Joined {formatDate(user.dateJoined)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* User Stats and Addresses */}
          <div className="p-6 md:w-2/3">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-blue-50 p-4 text-center">
                <div className="flex items-center justify-center">
                  <ShoppingBag size={20} className="text-blue-600" />
                </div>
                <p className="mt-2 text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{user.totalOrders}</p>
              </div>
              
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <div className="flex items-center justify-center">
                  <DollarSign size={20} className="text-green-600" />
                </div>
                <p className="mt-2 text-sm font-medium text-gray-500">Total Spent</p>
                <p className="text-2xl font-semibold text-gray-900">₹{user.totalSpent.toLocaleString()}</p>
              </div>
              
              <div className="rounded-lg bg-purple-50 p-4 text-center">
                <div className="flex items-center justify-center">
                  <Package size={20} className="text-purple-600" />
                </div>
                <p className="mt-2 text-sm font-medium text-gray-500">Active Orders</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {userOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length}
                </p>
              </div>
            </div>
            
            {/* Addresses */}
            <div className="mt-6">
              <h3 className="flex items-center text-lg font-medium text-gray-900">
                <MapPin size={18} className="mr-2 text-gray-500" />
                Addresses
              </h3>
              
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {user.addresses.map(address => (
                  <div key={address.id} className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>{address.street}</p>
                      <p>{address.city}, {address.state} {address.pincode}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Order History */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-800">Order History</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {userOrders.length > 0 ? (
            userOrders.map(order => (
              <div key={order.id} className="p-6">
                <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-base font-medium text-gray-900">{order.orderNumber}</h3>
                      <span className={`ml-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{formatDateTime(order.orderDate)}</p>
                  </div>
                  
                  <div className="mt-4 flex flex-col items-end sm:mt-0">
                    <p className="text-sm font-medium text-gray-900">₹{order.totalAmount.toFixed(2)}</p>
                    <Link
                      to={`/orders/${order.id}`}
                      className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      View Order
                      <ExternalLink size={14} className="ml-1" />
                    </Link>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center">
                    <Package size={16} className="mr-2 text-gray-400" />
                    <span className="text-sm text-gray-600">{order.items.length} items</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {order.items.map(item => (
                      <span key={item.productId} className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        {item.name} x{item.quantity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">No order history found for this user.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;