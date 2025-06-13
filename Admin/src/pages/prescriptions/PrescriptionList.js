import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Filter, ExternalLink, X,
  CheckCircle, AlertTriangle, XCircle, Calendar
} from 'lucide-react';

const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {

        const res = await fetch('http://localhost:5000/api/prescription/all', {
          method: 'GET',
          credentials:"include"
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Failed to fetch prescriptions');
        }

        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Invalid data format');
        setPrescriptions(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchPrescriptions();
  }, []);

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesSearch =
      prescription.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prescription.orderId && prescription.orderId.toString().includes(searchTerm));
    const matchesStatus = statusFilter ? prescription.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Not reviewed yet';
    const options = {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle size={18} className="text-green-500" />;
      case 'pending': return <AlertTriangle size={18} className="text-amber-500" />;
      case 'rejected': return <XCircle size={18} className="text-red-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Prescription Management</h1>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name or order ID..."
              className="w-full rounded-md border py-2 pl-10 pr-4 text-sm focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center px-4 py-2 border rounded-md text-sm"
          >
            <Filter size={18} className="mr-2" />
            Filter
            {statusFilter && <span className="ml-2 bg-blue-100 px-2 text-xs text-blue-800 rounded-full">1</span>}
          </button>
          <div className="hidden sm:flex gap-3 items-center">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border py-2 px-3 text-sm"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            {(searchTerm || statusFilter) && (
              <button onClick={clearFilters} className="text-blue-600 text-sm flex items-center">
                <X size={16} className="mr-1" /> Clear
              </button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 sm:hidden">
            <label className="block text-sm mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border py-2 px-3 text-sm"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Prescription Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrescriptions.length > 0 ? (
          filteredPrescriptions.map((prescription) => (
            <div key={prescription.id} className="card hover:shadow-md">
              <div className="relative h-48 w-full overflow-hidden rounded-lg">
                <img
                  src={prescription.image}
                  alt={`Prescription for ${prescription.userName}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x300?text=Prescription+Image';
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-white text-base font-medium">{prescription.userName}</h3>
                  <p className="text-white text-sm mt-1">Order ID: {prescription.orderId}</p>
                </div>
                <div className="absolute top-2 right-2 bg-white p-1 rounded-full">
                  {getStatusIcon(prescription.status)}
                </div>
              </div>
              <div className="mt-4 px-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(prescription.status)}`}>
                    {prescription.status}
                  </span>
                </div>
                <div className="mt-2 flex items-center">
                  <Calendar size={16} className="text-gray-400 mr-1" />
                  <span className="text-sm text-gray-600">{formatDate(prescription.reviewDate)}</span>
                </div>
                {prescription.notes && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{prescription.notes}</p>
                )}
                <div className="mt-4 text-right">
                  <Link
                    to={`/prescriptions/${prescription.id}`}
                    className="text-blue-600 text-sm flex items-center justify-end"
                  >
                    {prescription.status === 'pending' ? 'Review Now' : 'View Details'}
                    <ExternalLink size={14} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 p-8 text-center border rounded-lg">
            <p className="text-gray-500">No prescriptions found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionList;
