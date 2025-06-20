import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const ProductAdd = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [subcategories, setSubcategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subcategory: "", // NEW
    price: "",
    discount: "",
    stock: "",
    manufacturer: "",
    image: "",
    description: "",
    PrescriptionStatus: false,
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const [catRes, subcatRes] = await Promise.all([
          fetch("http://localhost:5000/api/category"),
          fetch("http://localhost:5000/api/subcategory"), // NEW
        ]);

        if (!catRes.ok || !subcatRes.ok) throw new Error("Failed to fetch");

        const [catData, subcatData] = await Promise.all([
          catRes.json(),
          subcatRes.json(),
        ]);

        setCategories(catData);
        setSubcategories(subcatData); // NEW
      } catch (error) {
        console.error("Error fetching categories or subcategories:", error);
      }
    }

    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  const handleClearImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, val]) =>
        form.append(
          key === "PrescriptionStatus" ? "prescription_status" : key,
          val
        )
      );

      if (file) form.append("image", file);

      const response = await fetch("http://localhost:5000/api/products/add", {
        method: "POST",
        body: form,
        credentials: "include",
      });

      const data = await response.json();
      setIsSubmitting(false);

      if (!response.ok) {
        toast.error("Failed to add product: " + JSON.stringify(data));
        return;
      }

      toast.success("Product added successfully");
      navigate("/products");
    } catch (err) {
      toast.error("Something went wrong!");
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const discountedPrice =
    formData.price && formData.discount
      ? (formData.price - (formData.price * formData.discount) / 100).toFixed(2)
      : null;

  return (
    <div className="space-y-6 fade-in text-gray-900 dark:text-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/products")}
            className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Add New Product
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-medium text-gray-800 dark:text-gray-100">
            Product Information
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="form-label dark:text-gray-300">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input dark:bg-[#0d1117] dark:border-gray-700 dark:text-gray-100"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="form-label dark:text-gray-300"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="form-input dark:bg-[#0d1117] dark:border-gray-700 dark:text-gray-100"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="subcategory" className="form-label dark:text-gray-300">
                Sub Category
              </label>
              <select
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                required
                className="form-input dark:bg-[#0d1117] dark:border-gray-700 dark:text-gray-100"
              >
                <option value="">Select a subcategory</option>
                {subcategories.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name} {sub.emoji && `(${sub.emoji})`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="price" className="form-label dark:text-gray-300">
                Price (₹)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="form-input dark:bg-[#0d1117]"
                placeholder="0.00"
              />
            </div>

                <div>
              <label htmlFor="discount" className="form-label dark:text-gray-300">
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
                step="0.01"
                className="form-input dark:bg-[#0d1117]"
                placeholder="0%"
              />
            </div>

            
            <div>
              <label htmlFor="stock" className="form-label dark:text-gray-300">
                Stock Quantity
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="form-input dark:bg-[#0d1117]"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="manufacturer" className="form-label dark:text-gray-300">
                Manufacturer
              </label>
              <input
                type="text"
                id="manufacturer"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                required
                className="form-input dark:bg-[#0d1117]"
                placeholder="Enter manufacturer "
              />
            </div>

            <div>
              <label className="form-label dark:text-gray-300">Upload Image</label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="form-input dark:bg-[#0d1117]"
                />
                {previewUrl && (
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="text-sm text-red-500 underline hover:text-red-700 dark:text-gray-300"
                  >
                    Clear
                  </button>
                )}
              </div>
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
                className="form-input dark:bg-[#0d1117] dark:border-gray-700 dark:text-gray-100"
                placeholder="Enter product description"
              ></textarea>
            </div>


            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="PrescriptionStatus"
                  name="PrescriptionStatus"
                  checked={formData.PrescriptionStatus}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-[#0d1117] dark:border-gray-700"
                />
                <label
                  htmlFor="PrescriptionStatus"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  This product requires a prescription
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Product Preview */}

        {(formData.name || previewUrl) && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h2 className="mb-4 text-lg font-medium text-gray-800 dark:text-gray-100">
              Product Preview
            </h2>

            <div className="flex flex-col items-center md:flex-row md:items-start">
              <div className="mb-4 h-48 w-48 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 md:mb-0 md:mr-6">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600">
                    No image
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {formData.name || "Product Name"}
                </h3>

                <div className="mt-2 space-y-2">
                  {formData.category && (
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500">
                        Category:
                      </span>
                      <span className="ml-2 inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                        {categories.find((cat) => cat._id === formData.category)
                          ?.name || "Unknown"}
                      </span>
                    </div>
                  )}

                  {formData.subcategory && (
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500">
                        Sub Category:
                      </span>
                      <span className="ml-2 inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                        {subcategories.find(
                          (cat) => cat._id === formData.subcategory
                        )?.name || "Unknown"}
                      </span>
                    </div>
                  )}

                  {formData.price && (
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 ">
                        Price:
                      </span>
                      <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        ₹{parseFloat(formData.price).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {formData.discount && (
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 ">
                        Discount:
                      </span>
                      <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {formData.discount}%
                      </span>
                    </div>
                  )}

                  {discountedPrice && (
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500">
                        Discounted Price:
                      </span>
                      <span className="ml-2 text-sm font-semibold text-green-600 dark:text-gray-300">
                        ₹{discountedPrice}
                      </span>
                    </div>
                  )}

                  {formData.stock && (
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500">
                        Stock:
                      </span>
                      <span className="ml-2 text-sm text-gray-900 dark:text-gray-300">
                        {formData.stock} units
                      </span>
                    </div>
                  )}

                  {formData.manufacturer && (
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500">
                        Manufacturer:
                      </span>
                      <span className="ml-2 text-sm text-gray-900 dark:text-gray-300">
                        {formData.manufacturer}
                      </span>
                    </div>
                  )}

                  {formData.PrescriptionStatus && (
                    <div className="flex items-center">
                      <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        Prescription Required
                      </span>
                    </div>
                  )}
                </div>

                {formData.description && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {formData.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="btn btn-outline dark:border-gray-600 dark:text-gray-800 "
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              <span className="flex items-center">
                <Save size={18} className="mr-2" />
                Save Product
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductAdd;
