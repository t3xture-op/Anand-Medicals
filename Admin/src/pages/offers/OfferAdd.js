import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
const API_BASE = process.env.REACT_APP_API_BASE_URL;

export default function OfferAdd() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    offerName: "",
    description: "",
    discount: "",
    startDate: "",
    endDate: "",
    status: "active",
    products: [],
  });

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${API_BASE}/api/products`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    }

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductToggle = (productId) => {
    setFormData((prev) => {
      const exists = prev.products.includes(productId);
      return {
        ...prev,
        products: exists
          ? prev.products.filter((id) => id !== productId)
          : [...prev.products, productId],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/api/offer/admin/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();
      setIsSubmitting(false);

      if (!response.ok) {
        toast.error("Failed to add offer: " + JSON.stringify(data));
        return;
      }

      toast.success("Offer added successfully");
      navigate("/offers");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong".err);
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 fade-in text-black dark:text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/offers")}
            className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-[#30363d] dark:hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            Add New Offer
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Offer Info */}
        <div className="rounded-lg border border-gray-200 dark:border-[#30363d] bg-white dark:bg-[#161b22] p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-800 dark:text-white">
            Offer Information
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="offerName"
                className="form-label dark:text-gray-300"
              >
                Offer Name
              </label>
              <input
                type="text"
                id="offerName"
                name="offerName"
                value={formData.offerName}
                onChange={handleChange}
                required
                className="form-input dark:bg-[#0d1117] dark:border-[#30363d] dark:text-white"
                placeholder="Enter offer name"
              />
            </div>

            <div>
              <label
                htmlFor="discount"
                className="form-label dark:text-gray-300"
              >
                Discount (%)
              </label>
              <input
                type="number"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                required
                min="0"
                max="100"
                className="form-input dark:bg-[#0d1117] dark:border-[#30363d] dark:text-white"
                placeholder="0%"
              />
            </div>

            <div>
              <label
                htmlFor="startDate"
                className="form-label dark:text-gray-300"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="form-input dark:bg-[#0d1117] dark:border-[#30363d] dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="form-label dark:text-gray-300"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="form-input dark:bg-[#0d1117] dark:border-[#30363d] dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="status" className="form-label dark:text-gray-300">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-input dark:bg-[#0d1117] dark:border-[#30363d] dark:text-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="form-label dark:text-gray-300"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="form-input dark:bg-[#0d1117] dark:border-[#30363d] dark:text-white"
                placeholder="Enter offer description"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Product Selection */}
        <div className="rounded-lg border border-gray-200 dark:border-[#30363d] bg-white dark:bg-[#161b22] p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-800 dark:text-white">
            Select Products
          </h2>

          <input
            type="text"
            placeholder="Search products..."
            className="form-input mb-4 w-full dark:bg-[#0d1117] dark:border-[#30363d] dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredProducts.map((product) => (
              <div key={product._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.products.includes(product._id)}
                  onChange={() => handleProductToggle(product._id)}
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  {product.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        {(formData.offerName ||
          formData.discount ||
          formData.products.length > 0) && (
          <div className="rounded-lg border border-gray-200 dark:border-[#30363d] bg-white dark:bg-[#161b22] p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-medium text-gray-800 dark:text-white">
              Offer Preview
            </h2>

            <div className="space-y-3 text-gray-800 dark:text-gray-300">
              <div>
                <strong>Offer Name:</strong> {formData.offerName || "N/A"}
              </div>
              <div>
                <strong>Description:</strong> {formData.description || "N/A"}
              </div>
              <div>
                <strong>Discount:</strong> {formData.discount || 0}%
              </div>
              <div>
                <strong>Start Date:</strong> {formData.startDate || "N/A"}
              </div>
              <div>
                <strong>End Date:</strong> {formData.endDate || "N/A"}
              </div>
              <div>
                <strong>Status:</strong> {formData.status}
              </div>
              <div>
                <strong>Selected Products:</strong>
                <ul className="ml-5 list-disc">
                  {formData.products.length === 0 && (
                    <li>No products selected</li>
                  )}
                  {formData.products.map((id) => {
                    const prod = products.find((p) => p._id === id);
                    return prod ? <li key={id}>{prod.name}</li> : null;
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/offers")}
            className="btn btn-outline"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 
                      1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              <span className="flex items-center">
                <Save size={18} className="mr-2" />
                Save Offer
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
