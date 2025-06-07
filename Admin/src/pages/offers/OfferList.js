import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus,
  X,
  Calendar,
  Tag,
  Trash2,
  Edit
} from 'lucide-react';
import { offers } from '../../utils/mockData';

const OfferList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter offers
  const filteredOffers = offers.filter(offer => {
    const matchesSearch = 
      offer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? offer.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
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
  
  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
  };
  
  // Delete offer (mock)
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      alert('Offer deleted successfully (mock)');
      // In a real app, this would call an API to delete the offer
    }
  };
  
  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6 fade-in">
      {/* Header with actions */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-xl font-semibold text-gray-800">Offers & Discounts</h1>
        <Link to="/offers/add" className="btn btn-primary flex items-center justify-center">
          <Plus size={18} className="mr-1" />
          Create New Offer
        </Link>
      </div>
      
      {/* Filters and search */}
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
              placeholder="Search by code or description..."
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          {/* Filter button (mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:hidden"
          >
            <Filter size={18} className="mr-2" />
            Filter
            {statusFilter && (
              <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                1
              </span>
            )}
          </button>
          
          {/* Filters (desktop) */}
          <div className="hidden items-center gap-3 sm:flex">
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="scheduled">Scheduled</option>
              <option value="expired">Expired</option>
            </select>
            
            {(searchTerm || statusFilter) && (
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
        
        {/* Mobile filters */}
        {showFilters && (
          <div className="mt-4 space-y-4 border-t border-gray-200 pt-4 sm:hidden">
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="scheduled">Scheduled</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            
            {(searchTerm || statusFilter) && (
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
      
      {/* Offers list */}
      <div className="space-y-6">
        {filteredOffers.length > 0 ? (
          filteredOffers.map((offer) => (
            <div key={offer.id} className="card">
              <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                    <Tag size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{offer.code}</h3>
                    <p className="text-sm text-gray-600">{offer.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(offer.status)}`}>
                    {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                  </span>
                  
                  <button
                    onClick={() => handleDelete(offer.id)}
                    className="rounded-md p-1 text-red-600 hover:bg-red-50 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                  
                  <Link
                    to={`/offers/edit/${offer.id}`}
                    className="rounded-md p-1 text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </Link>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-md bg-gray-50 p-3">
                  <p className="text-xs font-medium text-gray-500">Discount</p>
                  <p className="text-sm font-medium text-gray-900">
                    {offer.discountType === 'percentage' 
                      ? `${offer.discountValue}% off`
                      : `₹${offer.discountValue} off`}
                  </p>
                  {offer.minOrderValue > 0 && (
                    <p className="mt-1 text-xs text-gray-500">
                      Min order: ₹{offer.minOrderValue}
                    </p>
                  )}
                  {offer.maxDiscount > 0 && offer.discountType === 'percentage' && (
                    <p className="mt-1 text-xs text-gray-500">
                      Max discount: ₹{offer.maxDiscount}
                    </p>
                  )}
                </div>
                
                <div className="rounded-md bg-gray-50 p-3">
                  <p className="text-xs font-medium text-gray-500">Validity</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(offer.startDate)} to {formatDate(offer.endDate)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Created on {formatDate(offer.createdAt)}
                  </p>
                </div>
                
                <div className="rounded-md bg-gray-50 p-3">
                  <p className="text-xs font-medium text-gray-500">Usage</p>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div 
                      className="h-full rounded-full bg-blue-600" 
                      style={{ width: `${(offer.usageCount / offer.usageLimit) * 100}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {offer.usageCount} of {offer.usageLimit} used
                    ({Math.round((offer.usageCount / offer.usageLimit) * 100)}%)
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-gray-500">No offers found matching your criteria.</p>
            <Link to="/offers/add" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-500">
              Create a new offer
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferList;