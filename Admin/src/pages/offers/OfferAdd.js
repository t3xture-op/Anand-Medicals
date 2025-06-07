import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

const OfferAdd = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderValue: '0',
    maxDiscount: '0',
    startDate: '',
    endDate: '',
    usageLimit: '100',
    status: 'active'
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would be an API call to create the offer
      alert('Offer created successfully (mock)');
      setIsSubmitting(false);
      navigate('/offers');
    }, 800);
  };
  
  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center">
        <button
          onClick={() => navigate('/offers')}
          className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Create New Offer</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-800">Offer Details</h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Offer Code */}
            <div>
              <label htmlFor="code" className="form-label">Offer Code</label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="e.g., SUMMER20"
              />
              <p className="mt-1 text-xs text-gray-500">
                This is the code that customers will enter at checkout.
              </p>
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="form-label">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="e.g., 20% off on all products"
              />
              <p className="mt-1 text-xs text-gray-500">
                Brief description of what this offer provides.
              </p>
            </div>
            
            {/* Discount Type */}
            <div>
              <label htmlFor="discountType" className="form-label">Discount Type</label>
              <select
                id="discountType"
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="percentage">Percentage Discount</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            
            {/* Discount Value */}
            <div>
              <label htmlFor="discountValue" className="form-label">
                {formData.discountType === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount (₹)'}
              </label>
              <input
                type="number"
                id="discountValue"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                required
                min="0"
                step={formData.discountType === 'percentage' ? '1' : '0.01'}
                max={formData.discountType === 'percentage' ? '100' : ''}
                className="form-input"
                placeholder={formData.discountType === 'percentage' ? '10' : '100'}
              />
            </div>
            
            {/* Minimum Order Value */}
            <div>
              <label htmlFor="minOrderValue" className="form-label">Minimum Order Value (₹)</label>
              <input
                type="number"
                id="minOrderValue"
                name="minOrderValue"
                value={formData.minOrderValue}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="form-input"
                placeholder="0"
              />
              <p className="mt-1 text-xs text-gray-500">
                Minimum cart value required to use this offer. Leave as 0 for no minimum.
              </p>
            </div>
            
            {/* Maximum Discount */}
            <div>
              <label htmlFor="maxDiscount" className="form-label">Maximum Discount Amount (₹)</label>
              <input
                type="number"
                id="maxDiscount"
                name="maxDiscount"
                value={formData.maxDiscount}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="form-input"
                placeholder="0"
                disabled={formData.discountType === 'fixed'}
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.discountType === 'percentage'
                  ? 'Maximum discount amount for percentage discounts. Leave as 0 for no limit.'
                  : 'Not applicable for fixed amount discounts.'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-800">Validity & Usage</h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="form-label">Start Date</label>
              <input
                type="datetime-local"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            
            {/* End Date */}
            <div>
              <label htmlFor="endDate" className="form-label">End Date</label>
              <input
                type="datetime-local"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                min={formData.startDate}
                className="form-input"
              />
            </div>
            
            {/* Usage Limit */}
            <div>
              <label htmlFor="usageLimit" className="form-label">Usage Limit</label>
              <input
                type="number"
                id="usageLimit"
                name="usageLimit"
                value={formData.usageLimit}
                onChange={handleChange}
                required
                min="1"
                className="form-input"
                placeholder="100"
              />
              <p className="mt-1 text-xs text-gray-500">
                Maximum number of times this offer can be used.
              </p>
            </div>
            
            {/* Status */}
            <div>
              <label htmlFor="status" className="form-label">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="active">Active</option>
                <option value="scheduled">Scheduled</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Scheduled offers will become active on the start date.
              </p>
            </div>
          </div>
        </div>
        
        {/* Preview */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-800">Preview</h2>
          
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <div className="flex flex-col items-start md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {formData.code || 'OFFERCODE'}
                </p>
                <p className="text-sm text-gray-600">
                  {formData.description || 'Offer description'}
                </p>
              </div>
              
              <div className="mt-4 rounded-md bg-white px-3 py-2 text-sm font-medium text-blue-700 md:mt-0">
                {formData.discountType === 'percentage'
                  ? `${formData.discountValue || '0'}% OFF`
                  : `₹${formData.discountValue || '0'} OFF`}
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <ul className="space-y-1">
                {formData.minOrderValue > 0 && (
                  <li>Minimum order value: ₹{formData.minOrderValue}</li>
                )}
                {formData.maxDiscount > 0 && formData.discountType === 'percentage' && (
                  <li>Maximum discount: ₹{formData.maxDiscount}</li>
                )}
                {formData.startDate && formData.endDate && (
                  <li>
                    Valid from {new Date(formData.startDate).toLocaleDateString()} to {new Date(formData.endDate).toLocaleDateString()}
                  </li>
                )}
                <li>Usage limit: {formData.usageLimit} times</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Form actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/offers')}
            className="btn btn-outline"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : (
              <span className="flex items-center">
                <Save size={18} className="mr-2" />
                Create Offer
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OfferAdd;