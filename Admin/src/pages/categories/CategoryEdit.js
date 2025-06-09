import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Trash2, Upload, X } from 'lucide-react';

const CategoryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isImageCleared, setIsImageCleared] = useState(false); // NEW

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (!id) return;
    const fetchCategory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/category/${id}`);
        if (!response.ok) throw new Error('Category not found');
        const data = await response.json();
        setFormData({
          name: data.name || '',
          description: data.description || '',
        });

        if (data.image && typeof data.image === 'string') {
          setPreviewUrl(data.image); // Handle URL directly
        }
      } catch (error) {
        console.error('Error fetching category:', error);
        navigate('/category');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setIsImageCleared(false); // Reset clear state
    }
  };

  const handleClearImage = () => {
    setFile(null);
    setPreviewUrl('');
    setIsImageCleared(true); // Signal backend to remove image
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      if (file) {
        submitData.append('image', file);
      }
      if (isImageCleared) {
        submitData.append('removeImage', 'true');
      }

      const response = await fetch(`http://localhost:5000/api/category/edit/${id}`, {
        method: 'PUT',
        body: submitData,
      });

      if (!response.ok) throw new Error('Failed to update category');
      alert('Category updated successfully');
      navigate('/category');
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error updating category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/category/delete/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Delete failed');
        alert('Category deleted successfully');
        navigate('/category');
      } catch (err) {
        console.error('Delete error:', err);
        alert('Error deleting category');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading category data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/category')}
            className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Edit Category</h1>
        </div>
        <button onClick={handleDelete} className="btn btn-danger flex items-center">
          <Trash2 size={18} className="mr-2" />
          Delete Category
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-800">Category Information</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="form-label">Category Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter category name"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="form-input"
                placeholder="Enter category description"
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="form-label block mb-1">Image</label>

              {previewUrl && (
                <div className="mb-2 relative inline-block">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-32 h-32 rounded border object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    title="Clear Image"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              <label className="inline-flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer text-sm font-medium">
                <Upload className="w-4 h-4 mr-2" />
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/category')}
            className="btn btn-outline"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </span>
            ) : (
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

export default CategoryEdit;
