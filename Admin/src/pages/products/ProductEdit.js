import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Trash2 } from 'lucide-react';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    discount: '',
    stock: '',
    manufacturer: '',
    image: '',
    description: '',
    prescription_status: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await fetch(`http://localhost:5000/api/products/${id}`);
        const categoryRes = await fetch(`http://localhost:5000/api/category`);

        if (!productRes.ok || !categoryRes.ok) throw new Error('Failed to fetch data');

        const productData = await productRes.json();
        const categoryData = await categoryRes.json();

        setFormData({
          name: productData.name || '',
          price: productData.price || '',
          discount: productData.discount || '',
          description: productData.description || '',
          manufacturer: productData.manufacturer || '',
          stock: productData.stock || '',
          category: productData.category || '',
          image: productData.image || '',
          prescription_status: productData.prescription_status ?? false,
        });

        setCategories(categoryData);
      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: previewURL }));
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('category', formData.category);
      form.append('price', formData.price);
      form.append('discount', formData.discount);
      form.append('stock', formData.stock);
      form.append('manufacturer', formData.manufacturer);
      form.append('description', formData.description);
      form.append('prescription_status', formData.prescription_status.toString());
      if (selectedFile) {
        form.append('image', selectedFile);
      }

      const res = await fetch(`http://localhost:5000/api/products/edit/${id}`, {
        method: 'PUT',
        body: form,
      });

      if (!res.ok) throw new Error('Failed to update product');
      alert('Product updated successfully');
      navigate('/products');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/products/delete/${id}`, {
          method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to delete product');
        alert('Product deleted');
        navigate('/products');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  const discountedPrice = (
    formData.price -
    (formData.price * (formData.discount || 0)) / 100
  ).toFixed(2);

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/products')}
            className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Edit Product</h1>
        </div>
        <button onClick={handleDelete} className="btn btn-danger flex items-center">
          <Trash2 size={18} className="mr-2" /> Delete Product
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="form-label">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                min="0"
                max="100"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Manufacturer</label>
              <input
                type="text"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Upload New Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="form-input"
                ref={fileInputRef}
              />
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Product Preview"
                    className="h-32 rounded border object-contain"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="text-sm text-red-500 mt-2 underline"
                  >
                    Clear Image
                  </button>
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="form-input"
              ></textarea>
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="prescription_status"
                  checked={formData.prescription_status}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  This product requires a prescription
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Product Preview */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-800">Product Preview</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="h-48 w-48 overflow-hidden rounded border">
              <img
                src={formData.image}
                alt={formData.name}
                onError={(e) =>
                  (e.target.src =
                    'https://dummyimage.com/150x150/cccccc/ffffff&text=No+Image')
                }
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">{formData.name}</h3>
              <p className="text-sm text-gray-500">
                Category:{' '}
                {categories.find((c) => c._id === formData.category)?.name || 'N/A'}
              </p>
              <p className="text-sm text-gray-500">
                Price: ₹{parseFloat(formData.price || 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">Discount: {formData.discount || 0}%</p>
              <p className="text-sm font-semibold text-gray-700">
                Discounted Price: ₹{discountedPrice}
              </p>
              <p className="text-sm text-gray-500">Stock: {formData.stock} units</p>
              <p className="text-sm text-gray-500">Manufacturer: {formData.manufacturer}</p>
              {formData.prescription_status && (
                <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                  Prescription Required
                </span>
              )}
              {formData.description && (
                <p className="text-sm text-gray-600 mt-2">{formData.description}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/products')}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (
              <span className="flex items-center">
                <Save size={18} className="mr-2" />
                Save Changes
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;
