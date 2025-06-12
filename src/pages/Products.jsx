import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { AuthContext } from "../authContext"; // ✅ Add this
import SearchBar from "../components/SearchBar";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const addToCart = useCartStore((state) => state.addToCart);
  const { isLoggedIn } = useContext(AuthContext); // ✅ Use context properly

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search") || "";
    setSearchQuery(query);
  }, [location]);

  const handleAddToCart = async (product) => {
    if (!isLoggedIn) {
      alert("Please login to add items to cart.");
      return;
    }

    if (product.stock <= 0) {
      alert("This product is out of stock.");
      return;
    }

    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      discount_price: product.discount_price,
      image: product.image,
      stock: product.stock,
      quantity: 1,
    });

    try {
      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          product: product._id,
          quantity: 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to add to cart");
        return;
      }

      alert("Item added to your cart");
    } catch (error) {
      alert("Error adding item to cart");
    }
  };

  const filteredProducts = products.filter((product) =>
    [product.name, product.description, product.category, product.manufacturer]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Products</h1>
        <div className="w-full md:w-96">
          <SearchBar
            value={searchQuery}
            onChange={(value) =>
              window.history.pushState(null, "", `/products?search=${value}`)
            }
            placeholder="Search products..."
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center text-gray-500">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg shadow-md p-4 bg-white"
            >
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-4 rounded"
                />
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-sm text-gray-600">{product.manufacturer}</p>
              </Link>

              <div className="flex justify-between items-center mt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-green-700 font-bold">
                    ₹{product.discount_price}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-sm text-red-500">
                      {product.discount}% off
                    </span>
                  )}
                </div>
                <span
                  className={`text-sm ${
                    product.stock === 0 ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {product.stock === 0
                    ? "Out of stock"
                    : `${product.stock} in stock`}
                </span>
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
