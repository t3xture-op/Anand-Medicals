import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, FileEdit, Trash2, X } from "lucide-react";

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
        const res = await fetch("http://localhost:5000/api/subcategory");
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
    try {
      if (window.confirm("Are you sure to delete this subcategory?")) {
      await fetch(`http://localhost:5000/api/subcategory/delete/${id}`, {
        method: "DELETE",
      });
      const updated = subCategories.filter((s) => s._id !== id);
      setSubCategories(updated);
      setFiltered(updated);
    }
    } catch (error) {
      console.log(error)
      alert("error occured",error)
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-xl font-semibold text-gray-800 ml-1">
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

      <div className="rounded-lg border p-4 bg-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or category..."
              className="w-full pl-10 py-2 border border-gray-300 rounded-md"
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-blue-600 text-sm flex items-center"
            >
              <X size={16} className="mr-1" /> Clear
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 w-12">
                  S.No.
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Emoji
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.length > 0 ? (
                filtered.map((s, index) => (
                  <tr key={s._id} className="hover:bg-gray-50 border-b border-gray-100">
                    <td className="px-6 py-3 text-center text-sm text-gray-800">
                      {index + 1}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-800">
                      {s.name}
                    </td>
                    <td className="px-6 py-3 text-lg">{s.emoji}</td>
                    <td className="px-6 py-3">
                      <div className="flex space-x-2">
                        <Link
                          to={`/sub-category/edit/${s._id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FileEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(s._id)}
                          className="text-red-600 hover:text-red-800"
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
                    className="text-center text-gray-500 py-6 text-sm"
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