import React, { useState, useEffect } from 'react';

function OfferAdd() {
  const [offerName, setOfferName] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('active');
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching products:', err));
  }, []);

  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSubmit = async () => {
    const offerData = {
      offerName,
      description,
      discount: Number(discount),
      startDate,
      endDate,
      status,
      products: selectedProducts,
    };

    try {
      const response = await fetch('http://localhost:5000/api/offers', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offerData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Offer created successfully!');
        setOfferName('');
        setDescription('');
        setDiscount('');
        setStartDate('');
        setEndDate('');
        setStatus('active');
        setSelectedProducts([]);
      } else {
        alert(`Failed to create offer: ${result.message}`);
      }
    } catch (error) {
      console.error('Error creating offer:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Add New Offer</h2>

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
        <p><strong>Name:</strong> {offerName || 'Not set'}</p>
        <p><strong>Description:</strong> {description || 'Not set'}</p>
        <p><strong>Discount:</strong> {discount ? `${discount}%` : 'Not set'}</p>
        <p><strong>Start Date:</strong> {startDate || 'Not set'}</p>
        <p><strong>End Date:</strong> {endDate || 'Not set'}</p>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Selected Products:</strong></p>
        <div className="flex flex-wrap gap-4 mt-2">
          {products
            .filter((p) => selectedProducts.includes(p._id))
            .map((p) => (
              <div key={p._id} className="text-center w-28">
                <img src={p.image} alt={p.name} className="w-full h-20 object-contain" />
                <p className="text-sm">{p.name}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded"
      >
        Create Offer
      </button>
    </div>
  );
}

export default OfferAdd;
