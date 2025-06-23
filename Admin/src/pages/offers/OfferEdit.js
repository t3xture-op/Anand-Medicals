import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
const API_BASE = process.env.REACT_APP_API_BASE_URL;

function OfferEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offerName, setOfferName] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productPreview, setProductPreview] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  // Fetch all products
  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then((res) => res.json())
      .then((data) => setAllProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Fetch offer data
  useEffect(() => {
    fetch(`${API_BASE}/api/offer/admin/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setOfferName(data.offerName);
        setDescription(data.description);
        setDiscount(data.discount);
        setStartDate(data.startDate?.substring(0, 10));
        setEndDate(data.endDate?.substring(0, 10));
        setStatus(data.status);

        if (data.products.length && typeof data.products[0] === "object") {
          setSelectedProducts(data.products.map((p) => p._id));
          setProductPreview(data.products);
        } else {
          setSelectedProducts(data.products);
          setProductPreview(
            allProducts.filter((p) => data.products.includes(p._id))
          );
        }
      })
      .catch((err) => console.error("Error loading offer:", err));
  }, [id, allProducts]);

  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleUpdate = async () => {
    if (
      !offerName ||
      !discount ||
      !startDate ||
      !endDate ||
      selectedProducts.length === 0
    ) {
      toast.warning(
        "Please fill in all fields and select at least one product."
      );
      return;
    }

    const updatedOffer = {
      offerName,
      description,
      discount: Number(discount),
      startDate,
      endDate,
      status,
      products: selectedProducts,
    };

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${API_BASE}/api/offer/admin/edit/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials:"include",
          body: JSON.stringify(updatedOffer),
        }
        
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Offer updated successfully!");
        navigate("/offers");
      } else {
        toast.error(`Update failed: ${result.message}`);
      }
    } catch (err) {
      console.error("Error updating offer:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = allProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 fade-in text-black dark:text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/offers")}
            className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-[#30363d] dark:hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            Edit Offer
          </h1>
        </div>
      </div>

      <div className="space-y-6">
        {/* Offer Info */}
        <div className="rounded-lg border border-gray-200 dark:border-[#30363d] bg-white dark:bg-[#161b22] p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-800 dark:text-white">
            Offer Information
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="form-label dark:text-gray-300">
                Offer Name
              </label>
              <input
                type="text"
                value={offerName}
                onChange={(e) => setOfferName(e.target.value)}
                className="form-input dark:bg-[#0d1117] dark:border-[#30363d] dark:text-white"
                placeholder="Enter offer name"
              />
            </div>

            <div>
              <label className="form-label dark:text-gray-300">
                Discount (%)
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="form-input dark:bg-[#0d1117] dark:border-[#30363d] dark:text-white"
                placeholder="0%"
              />
            </div>

            <div>
              <label className="form-label dark:text-gray-300">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-input dark:bg-[#0d1117] dark:border-[#30363d] dark:text-white"
              />
            </div>

            <div>
              <label className="form-label dark:text-gray-300">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="form-input dark:bg-[#0d1117] dark:border-[#30363d] dark:text-white"
              />
            </div>

            <div>
              <label className="form-label dark:text-gray-300">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="form-input dark:bg-[#0d1117] dark:border-[#30363d] dark:text-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="form-label dark:text-gray-300">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredProducts.map((product) => (
              <div key={product._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product._id)}
                  onChange={() => handleCheckboxChange(product._id)}
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  {product.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Preview Section */}
        <div className="rounded-lg border border-gray-200 dark:border-[#30363d] bg-white dark:bg-[#161b22] p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-800 dark:text-white">
            Offer Preview
          </h2>

          <div className="space-y-3 text-gray-800 dark:text-gray-300">
            <div>
              <strong>Offer Name:</strong> {offerName || "N/A"}
            </div>
            <div>
              <strong>Description:</strong> {description || "N/A"}
            </div>
            <div>
              <strong>Discount:</strong> {discount || 0}%
            </div>
            <div>
              <strong>Start Date:</strong> {startDate || "N/A"}
            </div>
            <div>
              <strong>End Date:</strong> {endDate || "N/A"}
            </div>
            <div>
              <strong>Status:</strong> {status}
            </div>
            <div>
              <strong>Selected Products:</strong>
              <ul className="ml-5 list-disc">
                {selectedProducts.length === 0 ? (
                  <li>No products selected</li>
                ) : (
                  selectedProducts.map((id) => {
                    const prod = allProducts.find((p) => p._id === id);
                    return prod ? <li key={id}>{prod.name}</li> : null;
                  })
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => navigate("/offers")}
            className="btn btn-outline"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
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
                Update Offer
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OfferEdit;
