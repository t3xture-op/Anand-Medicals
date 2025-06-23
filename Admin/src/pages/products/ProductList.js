import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  FileEdit,
  Trash2,
  Filter,
  AlertTriangle,
  X,
} from "lucide-react";
import { toast } from "sonner";
const API_BASE = process.env.REACT_APP_API_BASE_URL;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
      toast.error("Failed to load products");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/category`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setProductCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
      toast.error("Failed to load categories");
    }
  };

  const handleDelete = async (id) => {
    toast("DELETE PRODUCT", {
      description: "Are you sure you want to delete this product?",
      action: {
        label: "DELETE",
        onClick: async () => {
          try {
            const res = await fetch(
              `${API_BASE}/api/products/admin/delete/${id}`,
              {
                method: "DELETE",
                credentials:"include",
              }
            );
            if (!res.ok) throw new Error("Delete failed");
            const updated = products.filter((p) => p._id !== id);
            setProducts(updated);
            toast.success("Product deleted successfully");
          } catch (err) {
            console.error("Error deleting product:", err);
            toast.error("Error deleting product: " + err.message);
          }
        },
      },
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setStockFilter("");
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || product.category === selectedCategory;
    const matchesStock =
      stockFilter === ""
        ? true
        : stockFilter === "low"
        ? product.stock <= 10 && product.stock > 0
        : product.stock === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Product Management
        </h1>
        <Link
          to="/products/add"
          className="btn btn-primary flex items-center justify-center"
        >
          <Plus size={18} className="mr-1" />
          Add New Product
        </Link>
      </div>

      {/* Filters and search */}
      <div className="rounded-lg border border-gray-200 dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by name or manufacturer..."
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Filter button (mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0d1117] px-4 py-2 text-sm font-medium text-gray-700 dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-[#1a1f25] sm:hidden"
          >
            <Filter size={18} className="mr-2" />
            Filters
            {(selectedCategory || stockFilter) && (
              <span className="ml-2 rounded-full bg-blue-100 dark:bg-blue-900 px-2 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-100">
                {(selectedCategory ? 1 : 0) + (stockFilter ? 1 : 0)}
              </span>
            )}
          </button>

          {/* Filters (desktop) */}
          <div className="hidden items-center gap-4 sm:flex">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0d1117] text-sm text-gray-900 dark:text-white py-2 pl-3 pr-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {productCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0d1117] text-sm text-gray-900 dark:text-white py-2 pl-3 pr-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Stock</option>
              <option value="low">Low Stock (&lt;= 10)</option>
              <option value="out">Out of Stock</option>
            </select>

            {(selectedCategory || stockFilter || searchTerm) && (
              <button
                onClick={clearFilters}
                className="flex items-center text-sm text-blue-600 hover:text-blue-500"
              >
                <X size={16} className="mr-1" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Mobile filters */}
        {showFilters && (
          <div className="mt-4 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4 sm:hidden">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0d1117] text-sm text-gray-900 dark:text-white py-2 pl-3 pr-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {productCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Stock
              </label>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0d1117] text-sm text-gray-900 dark:text-white py-2 pl-3 pr-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Stock</option>
                <option value="low">Low Stock (&lt;= 10)</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>

            {(selectedCategory || stockFilter || searchTerm) && (
              <button
                onClick={clearFilters}
                className="flex w-full items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0d1117] px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 shadow-sm hover:bg-gray-50 dark:hover:bg-[#1a1f25]"
              >
                <X size={16} className="mr-1" />
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Products Table */}

      <table className="table w-full text-left bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-[#30363d]">
        <thead className="table-header bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white border dark:border-[#30363d]">
          <tr>
            <th className="table-header-cell w-12 text-center text-gray-700 dark:text-gray-300">
              S.No.
            </th>
            <th className="table-header-cell text-gray-700 dark:text-gray-300">
              Product
            </th>
            <th className="table-header-cell text-gray-700 dark:text-gray-300">
              Category
            </th>
            <th className="table-header-cell text-gray-700 dark:text-gray-300">
              Price
            </th>
            <th className="table-header-cell text-gray-700 dark:text-gray-300">
              Discount
            </th>
            <th className="table-header-cell text-gray-700 dark:text-gray-300">
              Discounted Price
            </th>
            <th className="table-header-cell text-gray-700 dark:text-gray-300">
              Stock
            </th>
            <th className="table-header-cell text-gray-700 dark:text-gray-300">
              MANUFACTURER
            </th>
            <th className="table-header-cell text-gray-700 dark:text-gray-300">
              Prescription
            </th>
            <th className="table-header-cell text-gray-700 dark:text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300 dark:divide-gray-700 dark:bg-[#161b22]">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <tr
                key={product._id}
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#161b22]"
              >
                <td className="table-cell text-center font-medium">
                  {index + 1}
                </td>
                <td>
                  <div className="flex items-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-10 w-10 rounded-md border object-cover object-center"
                    />
                    <div className="ml-4 font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </div>
                  </div>
                </td>
                <td>
                  <span className="inline-flex rounded-full bg-blue-100 dark:bg-blue-900 px-2 py-1 text-xs font-semibold text-blue-800 dark:text-blue-100">
                    {productCategories.find(
                      (cat) => cat._id === product.category
                    )?.name || "Unknown"}
                  </span>
                </td>
                <td>₹{product.price.toFixed(2)}</td>
                <td className="text-blue-600 dark:text-blue-400">
                  {product.discount ? `${product.discount}%` : "0%"}
                </td>
                <td className="text-green-600 dark:text-green-400">
                  ₹{product.discount_price?.toFixed(2)}
                </td>
                <td>
                  {product.stock <= 5 ? (
                    <div className="flex items-center text-red-600">
                      <AlertTriangle size={14} className="mr-1" />
                      {product.stock}
                    </div>
                  ) : product.stock <= 10 ? (
                    <div className="flex items-center text-amber-600">
                      <AlertTriangle size={14} className="mr-1" />
                      {product.stock}
                    </div>
                  ) : (
                    product.stock
                  )}
                </td>
                <td>{product.manufacturer}</td>
                <td>
                  {product.prescription_status ? (
                    <span className="inline-flex rounded-full bg-green-100 dark:bg-green-900 px-2 py-1 text-xs font-semibold text-green-800 dark:text-green-200">
                      Required
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200">
                      Not Required
                    </span>
                  )}
                </td>
                <td>
                  <div className="flex space-x-2">
                    <Link
                      to={`/products/edit/${product._id}`}
                      className="rounded-md p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900"
                      title="Edit"
                    >
                      <FileEdit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="rounded-md p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="10"
                className="py-8 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                No products found matching your criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
