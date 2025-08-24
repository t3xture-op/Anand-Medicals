import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Pill, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Fuse from "fuse.js";

const MedicinesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { medications } = location.state || { medications: [] };
  const [products, setProducts] = useState([]);
  const [fuse, setFuse] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        setProducts(data);
        //...
        const fuseInstance = new Fuse(data, {
          keys: [
            { name: "name", weight: 0.7 }, // Higher priority (70%)
            { name: "description", weight: 0.3 }, // Lower priority (30%)
          ],
          threshold: 0.35,
          includeScore: true, // Good practice for weighted searches
        });
        //...
        setFuse(fuseInstance);
      } catch (error) {
        toast.error("Failed to load products: " + error.message);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (medicationName) => {
    if (!fuse) return;

    const result = fuse.search(medicationName);
    if (result.length === 0) {
      toast.error(`Product similar to "${medicationName}" not found`);
      return;
    }

    const matched = result[0].item;

    try {
      const res = await fetch(`http://localhost:5000/api/cart/add`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: matched._id, quantity: 1 }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to add to cart");
      }

      toast.success(`Added ${matched.name} (from "${medicationName}")`);
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const getBestMatch = (medicationName) => {
    if (!fuse) return null;
    const result = fuse.search(medicationName);
    return result.length > 0 ? result[0].item : null;
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-120px)] font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-6">
        {/* Top Buttons (Stacked on Mobile) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/upload-prescription")}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Scanner
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition duration-200"
          >
            Go to Cart
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 text-center">
          Prescribed Medications
        </h1>

        {medications.length === 0 ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md flex items-center">
            <Pill className="w-6 h-6 mr-3 text-yellow-600" />
            <p>No medications were extracted from the prescription scan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {medications.map((med, index) => {
              const matchedProduct = getBestMatch(med.name || "");
              return (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition duration-300"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <Pill className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <h2 className="font-semibold text-lg text-slate-800">
                        {med.name || "Unknown Medication"}
                      </h2>
                      {med.purpose && (
                        <p className="text-sm text-slate-500 mt-0.5">
                          {med.purpose}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 ml-9">
                    {med.dosage || "Dosage not specified"}
                  </p>
                  {med.duration && (
                    <p className="text-xs text-blue-700 font-medium ml-9 mt-1">{`Duration: ${med.duration}`}</p>
                  )}

                  {/* Product Match Preview */}
                  {matchedProduct && (
                    <div className="ml-9 mt-4 flex items-center gap-3">
                      <img
                        src={matchedProduct.image}
                        alt={matchedProduct.name}
                        className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm text-gray-700 font-semibold">
                          ₹{matchedProduct.discount_price?.toFixed(2)}
                        </p>
                        {matchedProduct.discount > 0 && (
                          <p className="text-xs text-green-600">
                            {matchedProduct.discount}% off (MRP ₹
                            {matchedProduct.price})
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Add to Cart */}
                  <div className="mt-4 pt-4 border-t border-slate-100 ml-9 flex justify-between items-center">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-green-800">
                      Available: {matchedProduct ? "Yes" : "No"}
                    </span>
                    <button
                      onClick={() => handleAddToCart(med.name)}
                      className={`font-bold py-1.5 px-3 text-xs rounded transition ${
                        matchedProduct
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={!matchedProduct}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicinesPage;
