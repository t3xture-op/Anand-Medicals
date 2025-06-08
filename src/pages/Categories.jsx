import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/category");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error loading categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading categories...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">
            SHOP BY CATEGORIES..
          </h1>
          <div className="w-full md:w-96">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search categories..."
            />
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((category) => (
            <Link
              to={`/category/${category._id}`}
              key={category._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              state={{ categoryName: category.name }} // <-- pass categoryName here
            >
              {category.image && (
                <div className="overflow-hidden h-48">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {category.name}
                </h2>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
