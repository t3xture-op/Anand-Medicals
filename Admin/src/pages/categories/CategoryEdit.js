import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, FileEdit, Trash2, X } from 'lucide-react';
import { toast, ToastContainer , Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/category');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
        setFilteredCategories(data);
      } catch (err) {
        setError('Error loading categories');
        toast.error('❌ Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/category/delete/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Delete failed');
        }

        toast.success('🗑️ Category deleted successfully');
        const updated = categories.filter(c => c._id !== id);
        setCategories(updated);
        setFilteredCategories(updated);
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('❌ Error deleting category: ' + error.message);
      }
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-xl font-semibold text-gray-800">Category Management</h1>
        <Link to="/category/add" className="btn btn-primary flex items-center justify-center">
          <Plus size={18} className="mr-1" />
          Add New Category
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search categories by name or description..."
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {searchTerm && (
            <button
              onClick={clearSearch}
              className="flex items-center text-sm text-blue-600 hover:text-blue-500"
            >
              <X size={16} className="mr-1" />
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading categories...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : filteredCategories.length > 0 ? (
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Category</th>
                <th className="table-header-cell">Description</th>
                <th className="table-header-cell">Image</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredCategories.map((category) => (
                <tr key={category._id} className="table-row">
                  <td className="table-cell font-medium text-gray-900">{category.name}</td>
                  <td className="table-cell text-gray-700">{category.description || '-'}</td>
                  <td className="table-cell">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-10 w-10 rounded-md border object-cover object-center"
                      />
                    ) : (
                      <span className="text-sm text-gray-500">No image</span>
                    )}
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <Link
                        to={`/category/edit/${category._id}`}
                        className="rounded-md p-1 text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                        title="Edit"
                      >
                        <FileEdit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="rounded-md p-1 text-red-600 hover:bg-red-50 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-10 text-gray-500">
            No categories found.{' '}
            <Link to="/category/add" className="text-blue-600 hover:underline">Create one</Link>.
          </div>
        )}
      </div>

      <ToastContainer
              position="top-center"
              autoClose={4000}
              hideProgressBar={false}
              closeOnClick
              pauseOnHover
              draggable
              pauseOnFocusLoss
              theme="light"
              transition={Bounce}
            />
    </div>
  );
};

export default CategoryList;
