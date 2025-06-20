import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Trash2, PlusCircle } from "lucide-react";
import { toast } from "sonner";

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/banner")
      .then((res) => res.json())
      .then((data) => setBanners(data))
      .catch((err) => console.error("Failed to fetch banners:", err));
  }, []);

  const handleDelete = async (id) => {
    toast("DELETE BANNER", {
      description: "Are you sure you want to delete this banner?",
      action: {
        label: "DELETE",
        onClick: async () => {
          try {
            const res = await fetch(`http://localhost:5000/api/banner/${id}`, {
              method: "DELETE",
            });
            const result = await res.json();
            if (res.ok) {
              setBanners((prev) => prev.filter((b) => b._id !== id));
              toast.success("Banner deleted successfully");
            } else {
              toast.error(result.message || "Delete failed");
            }
          } catch (error) {
            console.error("Delete failed:", error);
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
          Banner Management
        </h1>
        <Link
          to="/banner/add"
          className="btn btn-primary flex items-center justify-center"
        >
          <PlusCircle size={18} className="mr-1" />
          Add New Banner
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 dark:border-[#30363d] rounded-lg shadow-sm bg-white dark:bg-[#161b22]">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100 dark:bg-[#21262d] text-gray-700 dark:text-gray-300 font-semibold">
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
              <tr
                key={banner._id}
                className="border-t border-gray-200 dark:border-[#30363d] hover:bg-gray-50 dark:hover:bg-[#1c2128] transition"
              >
                <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">
                  {index + 1}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                  {banner.name}
                </td>
                <td className="px-4 py-3">
                  <img
                    src={banner.image}
                    alt={banner.name}
                    className="h-20 w-32 object-contain rounded border border-gray-300 dark:border-[#30363d]"
                  />
                </td>
                <td className="px-4 py-3 break-all text-blue-600 dark:text-blue-400">
                  {banner.link}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  {banner.description}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {banners.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
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
