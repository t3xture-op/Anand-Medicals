import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";

const CategoryAdd = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    isActive: true,
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
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
  if (isSubmitting) return;
  setIsSubmitting(true);

  console.log("Submitting form");

  try {
    const form = new FormData();
    form.append("name", formData.name);
    form.append("slug", formData.slug);
    form.append("description", formData.description);
    form.append("isActive", formData.isActive);
    if (file) form.append("image", file);

    const response = await fetch("http://localhost:5000/api/category/add", {
      method: "POST",
      body: form,
      credentials: "include",
    });

    const data = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      alert("Failed to add category: " + JSON.stringify(data));
      return;
    }

    alert("Category added successfully");
    navigate("/category");
  } catch (err) {
    console.error(err);
    alert("Something went wrong!");
    setIsSubmitting(false);
  }
};

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/categories")}
          className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Add New Category</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-800">Category Details</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="form-label">Category Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="md:col-span-2">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Upload Image</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="form-input" />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 border-gray-300 text-blue-600"
              />
              <label className="ml-2 text-sm text-gray-700">Is Active</label>
            </div>
          </div>
        </div>

        {/* Preview */}
        {(formData.name || previewUrl) && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-medium text-gray-800">Category Preview</h2>
            <div className="flex items-start gap-6">
              <div className="h-32 w-32 border rounded bg-gray-50 flex justify-center items-center">
                {previewUrl ? (
                  <img src={previewUrl} alt="Category Preview" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-sm">No image</span>
                )}
              </div>
              <div>
                <p className="text-lg font-semibold">{formData.name}</p>
                <p className="text-sm text-gray-500">{formData.slug}</p>
                <p className="mt-2 text-gray-700">{formData.description}</p>
                {formData.isActive && (
                  <span className="inline-block mt-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                    Active
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => navigate("/categories")} className="btn btn-outline" disabled={isSubmitting}>
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
                <Save className="mr-2 h-4 w-4" /> Save Category
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryAdd;

