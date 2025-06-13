import React, { useState, useEffect } from 'react';
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

const OfferList = () => {
  const [offers, setOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // 🟢 Fetch offers from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/offer')
      .then((res) => res.json())
      .then((data) => setOffers(data))
      .catch((err) => {
        console.error('Failed to load offers:', err);
      });
  }, []);

  // 🔍 Filter offers
  const filteredOffers = offers.filter(offer => {
    const matchesSearch = 
      offer.offerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter ? offer.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // 🗓 Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  // ❌ Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
  };

  // 🗑 Delete offer (mock for now)
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        const res = await fetch('http://localhost:5000/api/offer', {
          method: 'DELETE',
        });
        if (res.ok) {
          setOffers((prev) => prev.filter((o) => o._id !== id));
          alert('Offer deleted');
        } else {
          alert('Failed to delete offer');
        }
      } catch (err) {
        console.error('Delete error:', err);
        alert('Something went wrong.');
      }
    }
  };

  // 🏷️ Status badge colors
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
      {/* Header & Filters UI remains same... */}

      {/* Offer cards */}
      <div className="space-y-6">
        {filteredOffers.length > 0 ? (
          filteredOffers.map((offer) => (
            <div key={offer._id} className="card">
              <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                    <Tag size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{offer.offerName}</h3>
                    <p className="text-sm text-gray-600">{offer.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(offer.status)}`}>
                    {offer.status?.charAt(0).toUpperCase() + offer.status?.slice(1)}
                  </span>

                  <button
                    onClick={() => handleDelete(offer._id)}
                    className="rounded-md p-1 text-red-600 hover:bg-red-50 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>

                  <Link
                    to={`/offers/edit/${offer._id}`}
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
                    {offer.discount}% off
                  </p>
                </div>

                <div className="rounded-md bg-gray-50 p-3">
                  <p className="text-xs font-medium text-gray-500">Validity</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(offer.startDate)} to {formatDate(offer.endDate)}
                  </p>
                </div>

                <div className="rounded-md bg-gray-50 p-3">
                  <p className="text-xs font-medium text-gray-500">Created</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(offer.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-gray-500">No offers found.</p>
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
