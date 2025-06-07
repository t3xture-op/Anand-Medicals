import React, { useState } from 'react';
import { 
  Bell,
  Package,
  User,
  Calendar,
  ShoppingBag,
  AlertTriangle,
  Check,
  Clock,
  X
} from 'lucide-react';
import { notifications } from '../utils/mockData';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [filter, setFilter] = useState('all');
  
  // Get notifications based on filter
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    return notification.type === filter;
  });
  
  // Get unread count
  const unreadCount = notifications.filter(notification => !notification.isRead).length;
  
  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="h-6 w-6 text-blue-500" />;
      case 'user':
        return <User className="h-6 w-6 text-green-500" />;
      case 'prescription':
        return <Package className="h-6 w-6 text-purple-500" />;
      case 'stock':
        return <AlertTriangle className="h-6 w-6 text-amber-500" />;
      case 'payment':
        return <Clock className="h-6 w-6 text-red-500" />;
      default:
        return <Bell className="h-6 w-6 text-gray-500" />;
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    
    if (diffSec < 60) {
      return 'Just now';
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else if (diffHour < 24) {
      return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    } else if (diffDay < 7) {
      return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Mark all as read (mock)
  const markAllAsRead = () => {
    alert('All notifications marked as read (mock)');
    // In a real app, this would call an API to update the notification status
  };
  
  // Mark single notification as read (mock)
  const markAsRead = (id) => {
    alert(`Notification #${id} marked as read (mock)`);
    // In a real app, this would call an API to update the notification status
  };
  
  // Clear all notifications (mock)
  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      alert('All notifications cleared (mock)');
      // In a real app, this would call an API to clear notifications
    }
  };
  
  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Notifications</h1>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={markAllAsRead}
            className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <Check size={16} className="mr-1" />
            Mark all as read
          </button>
          
          <button
            onClick={clearAll}
            className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <X size={16} className="mr-1" />
            Clear all
          </button>
        </div>
      </div>
      
      {/* Notification filters */}
      <div className="border-b border-gray-200">
        <div className="flex items-center">
          <button
            onClick={() => setFilter('all')}
            className={`relative inline-flex items-center border-b-2 px-4 py-2 text-sm font-medium ${
              filter === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            All
            {unreadCount > 0 && filter === 'all' && (
              <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                {unreadCount}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setFilter('order')}
            className={`relative inline-flex items-center border-b-2 px-4 py-2 text-sm font-medium ${
              filter === 'order'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Orders
          </button>
          
          <button
            onClick={() => setFilter('user')}
            className={`relative inline-flex items-center border-b-2 px-4 py-2 text-sm font-medium ${
              filter === 'user'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Users
          </button>
          
          <button
            onClick={() => setFilter('prescription')}
            className={`relative inline-flex items-center border-b-2 px-4 py-2 text-sm font-medium ${
              filter === 'prescription'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Prescriptions
          </button>
          
          <button
            onClick={() => setFilter('stock')}
            className={`relative inline-flex items-center border-b-2 px-4 py-2 text-sm font-medium ${
              filter === 'stock'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Stock
          </button>
        </div>
      </div>
      
      {/* Notifications list */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`rounded-lg border ${
                notification.isRead ? 'bg-white' : 'bg-blue-50 border-blue-100'
              } p-4 shadow-sm transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex">
                <div className="mr-4 flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`text-base font-medium ${
                        notification.isRead ? 'text-gray-900' : 'text-blue-800'
                      }`}>
                        {notification.title}
                      </h3>
                      <p className={`mt-1 text-sm ${
                        notification.isRead ? 'text-gray-600' : 'text-blue-700'
                      }`}>
                        {notification.message}
                      </p>
                    </div>
                    <div className="ml-4 flex flex-shrink-0 flex-col items-end">
                      <span className="text-xs text-gray-500">
                        {formatDate(notification.createdAt)}
                      </span>
                      
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-500"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Action buttons based on notification type */}
                  <div className="mt-3 flex items-center justify-end space-x-2">
                    {notification.type === 'order' && (
                      <button className="rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100">
                        View Order
                      </button>
                    )}
                    
                    {notification.type === 'user' && (
                      <button className="rounded-md bg-green-50 px-2.5 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100">
                        View User
                      </button>
                    )}
                    
                    {notification.type === 'prescription' && (
                      <button className="rounded-md bg-purple-50 px-2.5 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-100">
                        Review Prescription
                      </button>
                    )}
                    
                    {notification.type === 'stock' && (
                      <button className="rounded-md bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100">
                        Update Stock
                      </button>
                    )}
                    
                    {notification.type === 'payment' && (
                      <button className="rounded-md bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100">
                        View Payment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
            <Bell size={48} className="mx-auto text-gray-400" />
            <p className="mt-4 text-gray-500">No notifications found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;