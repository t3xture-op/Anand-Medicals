import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  FileText, 
  Calendar, 
  ShoppingBag,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Save
} from 'lucide-react';
import { prescriptions, orders } from '../../utils/mockData';

const PrescriptionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch prescription data
  useEffect(() => {
    const fetchData = () => {
      // In a real app, this would be an API call
      const foundPrescription = prescriptions.find(p => p.id === id);
      
      if (foundPrescription) {
        setPrescription(foundPrescription);
        setStatus(foundPrescription.status);
        setNotes(foundPrescription.notes || '');
        
        if (foundPrescription.orderId) {
          const foundOrder = orders.find(o => o.id === foundPrescription.orderId);
          setOrder(foundOrder);
        }
      } else {
        // Prescription not found, redirect to prescriptions list
        navigate('/prescriptions');
      }
      
      setIsLoading(false);
    };
    
    // Simulate API delay
    setTimeout(fetchData, 500);
  }, [id, navigate]);
  
  // Handle review submission
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would be an API call to update the prescription status
      setPrescription(prev => ({
        ...prev,
        status,
        notes,
        reviewedBy: 'Admin User',
        reviewDate: new Date().toISOString()
      }));
      
      setIsSubmitting(false);
      alert(`Prescription has been ${status}`);
    }, 800);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
  
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading prescription data...</p>
        </div>
      </div>
    );
  }
  
  if (!prescription) return null;
  
  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center">
        <button
          onClick={() => navigate('/prescriptions')}
          className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Prescription Review</h1>
          <p className="text-sm text-gray-500">
            ID: {prescription.id} • Submitted by {prescription.userName}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Prescription Image */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-800">Prescription Image</h2>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(prescription.status)}`}>
                  {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <img 
                  src={prescription.image} 
                  alt="Prescription" 
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/800x600?text=Prescription+Image';
                  }}
                />
              </div>
              
              {/* Review Form */}
              <form onSubmit={handleReviewSubmit} className="mt-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Review Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      required
                    >
                      <option value="pending">Pending Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows="3"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      placeholder="Add any notes or comments about this prescription..."
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={status === prescription.status && notes === prescription.notes}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Save size={18} className="mr-2" />
                          Save Review
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* Sidebar Information */}
        <div className="space-y-6">
          {/* Status Information */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-800">Status</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center">
                    {prescription.status === 'approved' ? (
                      <CheckCircle size={20} className="mr-2 text-green-500" />
                    ) : prescription.status === 'pending' ? (
                      <AlertTriangle size={20} className="mr-2 text-amber-500" />
                    ) : (
                      <XCircle size={20} className="mr-2 text-red-500" />
                    )}
                    <span className="text-base font-medium text-gray-900">
                      {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {prescription.reviewedBy && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Reviewed by:</span>
                      <span className="text-sm text-gray-900">{prescription.reviewedBy}</span>
                    </div>
                  )}
                  
                  {prescription.reviewDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Review date:</span>
                      <span className="text-sm text-gray-900">{formatDate(prescription.reviewDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Customer Information */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-800">Customer</h2>
                <Link
                  to={`/users/${prescription.userId}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View Profile
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-gray-100 p-2">
                  <User size={20} className="text-gray-600" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900">{prescription.userName}</h3>
                  <p className="text-sm text-gray-500">Customer #{prescription.userId}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Information (if linked to an order) */}
          {order && (
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-800">Order</h2>
                  <Link
                    to={`/orders/${order.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    View Order
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="mr-4 rounded-full bg-blue-100 p-2">
                      <ShoppingBag size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-900">{order.orderNumber}</h3>
                      <p className="text-sm text-gray-500">{formatDate(order.orderDate)}</p>
                    </div>
                  </div>
                  
                  <div className="rounded-md bg-gray-50 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Total:</span>
                      <span className="text-sm font-medium text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Status:</span>
                      <span className="text-sm text-gray-900 capitalize">{order.status}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Items:</span>
                      <span className="text-sm text-gray-900">{order.items.length} products</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionDetail;