import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function OfferEdit() {
  const { id } = useParams(); // Offer ID from URL
  const navigate = useNavigate();

  const [offerName, setOfferName] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('active');
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch offer data
  useEffect(() => {
    fetch(`http://localhost:5000/api/offer/${id}`)
      .then(res => res.json())
      .then(data => {
        setOfferName(data.offerName);
        setDescription(data.description);
        setDiscount(data.discount);
        setStartDate(data.startDate?.substring(0, 10));
        setEndDate(data.endDate?.substring(0, 10));
        setStatus(data.status);
        setSelectedProducts(data.products || []);
      })
      .catch(err => console.error('Error loading offer:', err));
  }, [id]);

  // Fetch product list
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  const handleCheckboxChange = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleUpdate = async () => {
    const updatedOffer = {
      offerName,
      description,
      discount: Number(discount),
      startDate,
      endDate,
      status,
      products: selectedProducts
    };

    try {
      const response = await fetch(`http://localhost:5000/api/offer/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOffer),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Offer updated successfully!');
        navigate('/offers');
      } else {
        alert(`Update failed: ${result.message}`);
      }
    } catch (err) {
      console.error('Error updating offer:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <ArrowLeft
          className="cursor-pointer text-gray-600 hover:text-gray-900"
          size={24}
          onClick={() => navigate('/offers')}
        />
        <h2 className="text-xl font-bold">Edit Offer</h2>
      </div>

      <input
        type="text"
        placeholder="Offer Name"
        value={offerName}
        onChange={(e) => setOfferName(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <input
        type="number"
        placeholder="Discount (%)"
        value={discount}
        onChange={(e) => setDiscount(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border p-2 w-full mb-4"
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <div className="border p-2 max-h-56 overflow-y-scroll">
        {filteredProducts.map((product) => (
          <div key={product._id} className="flex items-center mb-1">
            <input
              type="checkbox"
              checked={selectedProducts.includes(product._id)}
              onChange={() => handleCheckboxChange(product._id)}
              className="mr-2"
            />
            {product.name}
          </div>
        ))}
      </div>

      <div className="mt-6 bg-blue-50 p-4 rounded">
        <h3 className="font-semibold text-blue-700 mb-2">Offer Preview</h3>
        <p><strong>Name:</strong> {offerName}</p>
        <p><strong>Description:</strong> {description}</p>
        <p><strong>Discount:</strong> {discount}%</p>
        <p><strong>Start Date:</strong> {startDate}</p>
        <p><strong>End Date:</strong> {endDate}</p>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Selected Products:</strong></p>
        <div className="flex flex-wrap gap-4 mt-2">
          {products
            .filter(p => selectedProducts.includes(p._id))
            .map(p => (
              <div key={p._id} className="text-center w-28">
                <img src={p.image} alt={p.name} className="w-full h-20 object-contain" />
                <p className="text-sm">{p.name}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleUpdate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"
        >
          Update Offer
        </button>
        <button
          onClick={() => navigate("/offers")}
          className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-6 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default OfferEdit;
