import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ExternalLink,
  X,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Calendar
} from 'lucide-react';
import { prescriptions } from '../../utils/mockData';

const PrescriptionList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter prescriptions
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = 
      prescription.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prescription.orderId && prescription.orderId.toString().includes(searchTerm));
    
    const matchesStatus = statusFilter ? prescription.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not reviewed yet';
    
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
  };
  
  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={18} className="text-green-500" />;
      case 'pending':
        return <AlertTriangle size={18} className="text-amber-500" />;
      case 'rejected':
        return <XCircle size={18} className="text-red-500" />;
      default:
        return null;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Prescription Management</h1>
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
              placeholder="Search by customer name or order ID..."
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
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
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
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
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
      
      {/* Prescriptions grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPrescriptions.length > 0 ? (
          filteredPrescriptions.map((prescription) => (
            <div key={prescription.id} className="card hover:shadow-md">
              {/* Prescription image */}
              <div className="aspect-h-3 aspect-w-4 relative h-48 w-full overflow-hidden rounded-lg">
                <img
                  src={prescription.image}
                  alt={`Prescription for ${prescription.userName}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x300?text=Prescription+Image';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-base font-medium text-white">{prescription.userName}</h3>
                  {prescription.orderId && (
                    <p className="mt-1 text-sm text-white/80">Order ID: {prescription.orderId}</p>
                  )}
                </div>
                <div className="absolute right-2 top-2 rounded-full bg-white p-1">
                  {getStatusIcon(prescription.status)}
                </div>
              </div>
              
              {/* Prescription details */}
              <div className="mt-4 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(prescription.status)}`}>
                    {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                  </span>
                </div>
                
                <div className="mt-2 flex items-center">
                  <Calendar size={16} className="mr-1 text-gray-400" />
                  <span className="text-sm text-gray-600">{formatDate(prescription.reviewDate)}</span>
                </div>
                
                {prescription.notes && (
                  <div className="mt-2">
                    <p className="line-clamp-2 text-sm text-gray-600">{prescription.notes}</p>
                  </div>
                )}
                
                <div className="mt-4 flex justify-end">
                  <Link
                    to={`/prescriptions/${prescription.id}`}
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    {prescription.status === 'pending' ? 'Review Now' : 'View Details'}
                    <ExternalLink size={14} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-gray-500">No prescriptions found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionList;