import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";

const SubCategoryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    emoji: "",
  });

  useEffect(() => {
    const fetchSubCategory = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/subcategory/${id}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setFormData({
            name: data.name || "",
            emoji: data.emoji || "",
          });
        } else {
          alert("Failed to fetch subcategory: " + data.message);
          navigate("/sub-category");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong!");
        navigate("/sub-category");
      }
    };

    fetchSubCategory();
  }, [id, navigate]);

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

    try {
      const res = await fetch(`http://localhost:5000/api/subcategory/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (!res.ok) {
        alert("Failed to update subcategory: " + data.message);
        return;
      }

      alert("Subcategory updated successfully");
      navigate("/sub-category");
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
          onClick={() => navigate("/sub-category")}
          className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Edit Subcategory</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-800">Subcategory Details</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="form-label">Subcategory Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Emoji</label>
              <input
                type="text"
                name="emoji"
                value={formData.emoji}
                onChange={handleChange}
                maxLength={2}
                required
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        {(formData.name || formData.emoji) && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-medium text-gray-800">Subcategory Preview</h2>
            <div className="flex items-start gap-6">
              <div className="h-16 w-16 flex justify-center items-center text-3xl border rounded bg-gray-50">
                {formData.emoji || "❓"}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => navigate("/subcategory")} className="btn btn-outline" disabled={isSubmitting}>
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
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubCategoryEdit;
