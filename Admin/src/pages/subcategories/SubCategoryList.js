import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, FileEdit, Trash2, X } from "lucide-react";
import { toast } from "sonner";
const API_BASE = process.env.REACT_APP_API_BASE_URL;

const SubCategoryList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/subcategory`);
        const data = await res.json();

        if (!res.ok || !Array.isArray(data)) {
          throw new Error(data.message || "Unexpected response");
        }

        setSubCategories(data);
        setFiltered(data);
      } catch (err) {
        setError(err.message || "Failed to load subcategories");
        setSubCategories([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, []);

  useEffect(() => {
    const result = subCategories.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(result);
  }, [searchTerm, subCategories]);

  const handleDelete = async (id) => {
    toast("DELETE SUB CATEGORY", {
      description: "Are you sure you want to delete this sub category?",
      action: {
        label: "DELETE",
        onClick: async () => {
          try {
            await fetch(`${API_BASE}/api/subcategory/admin/delete/${id}`, {
              method: "DELETE",
              credentials:"include",
            });
            const updated = subCategories.filter((s) => s._id !== id);
            setSubCategories(updated);
            setFiltered(updated);
            toast.success("Sub category deleted");
          } catch (error) {
            console.log(error);
            toast.error("error occured", error);
          }
        },
      },
    });
  };

  return (
    <div className="space-y-6 fade-in text-gray-900 dark:text-gray-100">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-xl font-semibold text-gray-800 ml-1 dark:text-gray-100">
          SubCategory Management
        </h1>
        <Link
          to="/sub-category/add"
          className="btn btn-primary flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Add SubCategory
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500"
            />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or category..."
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-blue-600 text-sm flex items-center dark:text-blue-400 hover:underline"
            >
              <X size={16} className="mr-1" /> Clear
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          Loading...
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300 w-12">
                  S.No.
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  Emoji
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filtered.length > 0 ? (
                filtered.map((s, index) => (
                  <tr
                    key={s._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-3 text-center text-sm text-gray-800 dark:text-gray-200">
                      {index + 1}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-200">
                      {s.name}
                    </td>
                    <td className="px-6 py-3 text-lg">{s.emoji}</td>
                    <td className="px-6 py-3">
                      <div className="flex space-x-2">
                        <Link
                          to={`/sub-category/edit/${s._id}`}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <FileEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(s._id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center text-gray-500 dark:text-gray-400 py-6 text-sm"
                  >
                    No subcategories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubCategoryList;
