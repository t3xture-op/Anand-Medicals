"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "../utils/ui/animated-model.jsx";
import { toast } from "sonner"; 
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export function RequestMedicine({ open, setOpen }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    manufacturer: "",
    description: "",
  });

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
      const res = await fetch(`${API_BASE}/api/product-request/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to request product");
        return;
      }

      toast.success("Product requested successfully");

      // reset form
      setFormData({
        name: "",
        category: "",
        stock: "",
        manufacturer: "",
        description: "",
      });
      setOpen(false);

      return data;
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalBody>
        <ModalContent className="bg-white rounded-2xl shadow-lg pt-6 m-6 border border-green-100">
          <h4 className="text-2xl font-bold text-center mb-10 text-green-700">
            Request Your Product
          </h4>

          {/* Attach onSubmit here */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Product Name */}
              <div className="flex flex-col">
                <label htmlFor="name" className="mb-2 text-sm font-semibold text-green-700">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="rounded-lg border border-green-300 px-4 py-2  focus:ring-green-400 text-gray-800"
                  placeholder="Enter Product Name"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col">
                <label htmlFor="category" className="mb-2 text-sm font-semibold text-green-700">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="rounded-lg border border-green-300 px-4 py-2  focus:ring-green-400 text-gray-800"
                  placeholder="Enter Category"
                />
              </div>

              {/* quantity */}
              <div className="flex flex-col">
                <label htmlFor="quantity" className="mb-2 text-sm font-semibold text-green-700">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="0"
                  className="rounded-lg border border-green-300 px-4 py-2  focus:ring-green-400 text-gray-800"
                  placeholder="Number of Strips(if tabs)"
                />
              </div>

              {/* Manufacturer */}
              <div className="flex flex-col">
                <label htmlFor="manufacturer" className="mb-2 text-sm font-semibold text-green-700">
                  Manufacturer
                </label>
                <input
                  type="text"
                  id="manufacturer"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  className="rounded-lg border border-green-300 px-4 py-2  focus:ring-green-400 text-gray-800"
                  placeholder="Enter Manufacturer"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2 flex flex-col">
                <label htmlFor="description" className="mb-2 text-sm font-semibold text-green-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="rounded-lg border border-green-300 px-4 py-2  focus:ring-green-400 text-gray-800"
                  placeholder="Enter product description (content if medicine)"
                ></textarea>
              </div>
            </div>

            {/* Footer Buttons inside form */}
            <ModalFooter className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setOpen(false)}
                type="button"
                className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white shadow-md transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Book Now"}
              </button>
            </ModalFooter>
          </form>
        </ModalContent>
      </ModalBody>
    </Modal>
  );
}
