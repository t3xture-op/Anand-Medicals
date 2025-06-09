import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  ExternalLink,
  X,
  TrendingUp,
  Calendar
} from 'lucide-react';

const UserList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateJoined');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from backend
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('http://localhost:5000/api/user/get'); // Update with your backend base path if needed
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    return (
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm)
    );
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'totalOrders':
        comparison = a.totalOrders - b.totalOrders;
        break;
      case 'totalSpent':
        comparison = a.totalSpent - b.totalSpent;
        break;
      case 'dateJoined':
      default:
        comparison = new Date(a.dateJoined) - new Date(b.dateJoined);
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Toggle sort order
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('dateJoined');
    setSortOrder('desc');
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading users...
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">User Management</h1>
      </div>

      {/* Search and filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email or phone..."
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Filter button (mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:hidden"
          >
            <Filter size={18} className="mr-2" />
            Sort
            {sortBy !== 'dateJoined' && (
              <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                1
              </span>
            )}
          </button>

          {/* Sort options (desktop) */}
          <div className="hidden items-center space-x-4 sm:flex">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            {['name', 'totalOrders', 'totalSpent', 'dateJoined'].map(field => (
              <button
                key={field}
                onClick={() => toggleSort(field)}
                className={`flex items-center text-sm ${
                  sortBy === field ? 'font-medium text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {field === 'totalOrders' ? 'Orders' : field === 'totalSpent' ? 'Spent' : field === 'dateJoined' ? 'Date Joined' : 'Name'}
                {sortBy === field && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </button>
            ))}
            {(searchTerm || sortBy !== 'dateJoined') && (
              <button
                onClick={clearFilters}
                className="flex items-center text-sm text-blue-600 hover:text-blue-500"
              >
                <X size={16} className="mr-1" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Mobile sort options */}
        {showFilters && (
          <div className="mt-4 space-y-4 border-t border-gray-200 pt-4 sm:hidden">
            <div className="space-y-2">
              <span className="block text-sm font-medium text-gray-700">Sort by:</span>
              <div className="flex flex-col space-y-2">
                {['name', 'totalOrders', 'totalSpent', 'dateJoined'].map(field => (
                  <button
                    key={field}
                    onClick={() => toggleSort(field)}
                    className={`flex items-center rounded-md px-3 py-2 text-sm ${
                      sortBy === field
                        ? 'bg-blue-50 font-medium text-blue-600'
                        : 'bg-gray-50 text-gray-600'
                    }`}
                  >
                    {field === 'totalOrders' ? 'Orders' : field === 'totalSpent' ? 'Spent' : field === 'dateJoined' ? 'Date Joined' : 'Name'}
                    {sortBy === field && (
                      <span className="ml-auto">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {(searchTerm || sortBy !== 'dateJoined') && (
              <button
                onClick={clearFilters}
                className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm hover:bg-gray-50"
              >
                <X size={16} className="mr-1" />
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Users list */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sortedUsers.length > 0 ? (
          sortedUsers.map((user) => (
            <div key={user._id} className="card hover:shadow-md">
              <div className="flex items-start space-x-4">
                <img
                  src={user.avatar || 'https://via.placeholder.com/100?text=User'}
                  alt={user.name}
                  className="h-12 w-12 rounded-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/100?text=User';
                  }}
                />
                <div className="flex-1 overflow-hidden">
                  <h3 className="truncate text-base font-medium text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

                           <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-md bg-blue-50 p-3 text-center">
                  <div className="flex items-center justify-center text-blue-600">
                    <Calendar size={16} className="mr-1" />
                    <span className="text-xs font-medium">Joined</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {formatDate(user.dateJoined)}
                  </p>
                </div>
                <div className="rounded-md bg-green-50 p-3 text-center">
                  <div className="flex items-center justify-center text-green-600">
                    <TrendingUp size={16} className="mr-1" />
                    <span className="text-xs font-medium">Total</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    ₹{user.totalSpent?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  {user.totalOrders || 0} {user.totalOrders === 1 ? 'order' : 'orders'}
                </span>
                <Link
                  to={`/users/${user._id}`}
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View Details
                  <ExternalLink size={14} className="ml-1" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-gray-500">No users found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;

