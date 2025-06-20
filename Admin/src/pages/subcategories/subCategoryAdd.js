import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const SubCategoryAdd = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    emoji: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/subcategory/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );

      const data = await response.json();
      setIsSubmitting(false);

      if (!response.ok) {
        toast.error("Failed to add subcategory: " + JSON.stringify(data));
        return;
      }

      toast.success("SubCategory added successfully");
      navigate("/sub-category");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 fade-in text-gray-900 dark:text-gray-100">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/sub-category")}
          className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Add New SubCategory
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-700">
          <h2 className="mb-4 text-lg font-medium text-gray-800 dark:text-gray-100">
            SubCategory Details
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="form-label dark:text-gray-300">
                SubCategory Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input dark:bg-[#0d1117]  dark:text-white dark:border-gray-700"
              />
            </div>

            <div>
              <label className="form-label dark:text-gray-300">Emoji</label>
              <input
                type="text"
                name="emoji"
                value={formData.emoji}
                onChange={handleChange}
                required
                placeholder="e.g. 💉"
                className="form-input text-2xl dark:bg-[#0d1117] dark:text-white dark:border-gray-700"
              />
            </div>
          </div>
        </div>

        {(formData.name || formData.emoji) && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-700">
            <h2 className="mb-4 text-lg font-medium text-gray-800 dark:text-gray-100">
              SubCategory Preview
            </h2>
            <div className="flex items-start gap-6">
              <div className="h-16 w-16 border rounded bg-gray-50 flex justify-center items-center text-2xl dark:bg-gray-800 dark:border-gray-700">
                {formData.emoji || (
                  <span className="text-gray-400 text-sm dark:text-gray-500">
                    No emoji
                  </span>
                )}
              </div>
              <div>
                <p className="text-lg font-semibold dark:text-white">
                  {formData.name}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/subcategory")}
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Saving...
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="mr-2 h-4 w-4" /> Save SubCategory
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubCategoryAdd;
