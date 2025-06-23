import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, FileEdit, Trash2, X } from "lucide-react";
import { toast } from "sonner";
const API_BASE = process.env.REACT_APP_API_BASE_URL;

const CategoryList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/category`);
        if (!response.ok) throw new Error("Failed to fetch categories");

        const data = await response.json();
        setCategories(data);
        setFilteredCategories(data);
      } catch (err) {
        setError("Error loading categories");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Search filter
  useEffect(() => {
    const filtered = categories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleDelete = async (id) => {
      toast("DELETE CATEGORY", {
        description: "Are you sure you want to delete this category?",
        action: {
          label: "DELETE",
          onClick: async () => {
            try {
              const response = await fetch(
                `${API_BASE}/api/category/admin/delete/${id}`,
                {
                  method: "DELETE",
                  credentials:"include"
                }
              );

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Delete failed");
              }

              toast.success("Category deleted successfully");
              // Refetch categories after delete
              const updated = categories.filter((c) => c._id !== id);
              setCategories(updated);
              setFilteredCategories(updated);
            } catch (error) {
              console.error("Error deleting category:", error);
              toast.error("Error deleting category: " + error.message);
            }
          },
        },
      });
  };

  return (
    <div className="space-y-6 fade-in text-black dark:text-white">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Category Management
        </h1>
        <Link
          to="/category/add"
          className="btn btn-primary flex items-center justify-center"
        >
          <Plus size={18} className="mr-1" />
          Add New Category
        </Link>
      </div>

      {/* Search */}
      <div className="rounded-lg border border-gray-200 dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={18} className="text-gray-400 dark:text-gray-300" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search categories by name or description..."
              className="w-full rounded-md border border-gray-300 dark:border-[#444c56] bg-white dark:bg-[#0d1117] py-2 pl-10 pr-4 text-sm text-black dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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

      {/* Table */}
     
        {loading ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            Loading categories...
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : filteredCategories.length > 0 ? (
          <table className="table w-full border-collapse text-sm bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d]">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-white border-b border-gray-200 dark:border-[#30363d]">
                  S.No
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-white border-b border-gray-200 dark:border-[#30363d]">
                  Category
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-white border-b border-gray-200 dark:border-[#30363d]">
                  Description
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-white border-b border-gray-200 dark:border-[#30363d]">
                  Image
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-white border-b border-gray-200 dark:border-[#30363d]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCategories.map((category, index) => (
                <tr
                  key={category._id}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className="px-4 py-2 text-gray-800 dark:text-white">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 text-gray-900 dark:text-white">
                    {category.name}
                  </td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                    {category.description || "-"}
                  </td>
                  <td className="px-4 py-2">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-10 w-10 rounded-md border border-gray-300 dark:border-[#30363d] object-cover object-center"
                      />
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        No image
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      <Link
                        to={`/category/edit/${category._id}`}
                        className="rounded-md p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-[#30363d] hover:text-blue-800"
                        title="Edit"
                      >
                        <FileEdit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="rounded-md p-1 text-red-600 hover:bg-red-50 dark:hover:bg-[#401a1c] hover:text-red-800"
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
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No categories found.{" "}
            <Link to="/category/add" className="text-blue-600 hover:underline">
              Create one
            </Link>
            .
          </div>
        )}
     
    </div>
  );
};

export default CategoryList;
