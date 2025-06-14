import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, PlusCircle } from 'lucide-react';

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/banner')
      .then(res => res.json())
      .then(data => setBanners(data))
      .catch(err => console.error('Failed to fetch banners:', err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/banner/${id}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (res.ok) {
        setBanners(prev => prev.filter(b => b._id !== id));
        alert('Banner deleted successfully');
      } else {
        alert(result.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-xl font-semibold text-gray-800">Banner Management</h1>
        <Link to="/banner/add" className="btn btn-primary flex items-center justify-center">
          <PlusCircle size={18} className="mr-1" />
          Add New Banner
        </Link>
      </div>

      <div className="overflow-x-auto border rounded shadow-sm">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-sm font-semibold text-gray-700">
            <tr>
              <th className="text-left px-4 py-3 w-1/12">S.No</th>
              <th className="text-left px-4 py-3 w-1/5">Name</th>
              <th className="text-left px-4 py-3 w-1/5">Image</th>
              <th className="text-left px-4 py-3 w-2/5">URL</th>
              <th className="text-left px-4 py-3 w-2/5">Description</th>
              <th className="text-left px-4 py-3 w-1/5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner, index) => (
              <tr key={banner._id} className="border-t text-sm">
                <td className="px-4 py-3 font-medium text-gray-800">{index + 1}</td>
                <td className="px-4 py-3">{banner.name}</td>
                <td className="px-4 py-3">
                  <img
                    src={banner.image}
                    alt={banner.name}
                    className="h-20 w-32 object-contain rounded border"
                  />
                </td>
                <td className="px-4 py-3 break-all text-blue-600">{banner.link}</td>
                <td className="px-4 py-3">{banner.description}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {banners.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No banners found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BannerList;

