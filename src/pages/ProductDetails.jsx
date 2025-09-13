import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { ShoppingCart } from "lucide-react";
import { AuthContext } from "../authContext";
import { toast } from "sonner";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [categories, setCategories] = useState([]);

  const addToCart = useCartStore((state) => state.addToCart);
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products/${id}`);
        const data = await res.json();
        setProduct(data);

        // ✅ Fetch related products (strictly same category)
        if (data.category?._id || data.category) {
          const categoryId = data.category._id || data.category;
          const relRes = await fetch(
            `${API_BASE}/api/products?category=${categoryId}`
          );
          const relData = await relRes.json();
          setRelatedProducts(
            relData.filter(
              (p) =>
                p._id !== data._id && String(p.category) === String(categoryId)
            )
          );
        }

        // ✅ Fetch "You may also like" products (different categories)
        const recRes = await fetch(`${API_BASE}/api/products`);
        const recData = await recRes.json();
        const filtered = recData.filter(
          (p) =>
            String(p.category) !== String(data.category._id || data.category)
        );
        setRecommendedProducts(filtered.slice(0, 10));
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/category`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast.info("Please login to add items to cart.");
      return;
    }

    if (product.stock <= 0) {
      toast.warning("This product is out of stock.");
      return;
    }

    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      composition: product.composition,
      discount: product.discount,
      discount_price: product.discount_price,
      image: product.image,
      stock: product.stock,
      description: product.description,
      quantity,
    });

    try {
      const response = await fetch(`${API_BASE}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          product: product._id,
          quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to add to cart");
        return;
      }

      toast.success("Item added to your cart");
    } catch (error) {
      console.error("Error adding to cart:", error.message);
      toast.error("Error adding to cart");
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Product Section */}
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10">
        {/* Image with zoom window */}
        <div className="overflow-hidden rounded-xl shadow-lg">
          <Zoom>
            <img alt="Product" src={product.image} width="500" />
          </Zoom>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* ✅ Highlight main info */}
          <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
          {product.composition &&
          <div>
            <h3 className="text-black font-bold text-2xl h-10">Composition</h3>
            <p className="text-gray-600 text-lg">{product.composition}</p>
          </div>
          }
          

          <div className="flex items-baseline gap-3">
            <span className="text-green-700 text-3xl font-bold">
              ₹{product.discount_price}
            </span>
            <span className="text-gray-500 line-through text-lg">
              ₹{product.price}
            </span>
            {product.discount > 0 && (
              <span className="text-red-500 text-sm font-semibold">
                {product.discount}% off
              </span>
            )}
          </div>

          <p className="text-gray-700">
            <span className="font-semibold">Manufacturer:</span>{" "}
            {product.manufacturer || "N/A"}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Category:</span>{" "}
            {categories.find((cat) => cat._id === product.category)?.name ||
              "Unknown"}
          </p>

          {/* Stock */}
          <p
            className={`text-md ${
              product.stock === 0 ? "text-red-500" : "text-gray-700"
            }`}
          >
            {product.stock === 0
              ? "Out of stock"
              : `${product.stock} items in stock`}
          </p>

          {/* Quantity selector */}
          <div className="flex items-center space-x-4 mt-4">
            <label className="text-sm font-medium text-gray-700">
              Quantity:
            </label>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              disabled={product.stock === 0}
              onChange={(e) =>
                setQuantity(
                  Math.min(product.stock, Math.max(1, Number(e.target.value)))
                )
              }
              className="w-20 px-3 py-1 border rounded-md"
            />
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`mt-6 flex items-center justify-center space-x-2 py-3 px-8 rounded-lg text-white font-medium transition ${
              product.stock === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800"
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>

      {/* About Product Section */}
      {product.description && 
        <div className="max-w-6xl mx-auto px-4 mt-12">
        <h2 className="text-3xl font-bold text-gray-900 border-b pb-2 mb-4">
          About {product.name}
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed  p-6 ">
          {product.description}
        </p>
      </div>
      }
    

      {/* Related Products - Horizontal Scroll */}
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 mt-16">
          <h2 className="text-2xl font-bold mb-4">Related Products</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {relatedProducts.map((item) => (
              <Link
                to={`/product/${item._id}`}
                key={item._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition w-48 flex-shrink-0"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <h3 className="text-sm font-semibold truncate">
                    {item.name}
                  </h3>
                  <p className="text-green-700 font-bold text-sm">
                    ₹{item.discount_price}
                  </p>
                  <p className="text-xs text-gray-500 line-through">
                    ₹{item.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Products */}
      {recommendedProducts.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 mt-12">
          <h2 className="text-2xl font-bold mb-4">You May Also Like</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {recommendedProducts.map((item) => (
              <Link
                to={`/product/${item._id}`}
                key={item._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition w-48 flex-shrink-0"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <h3 className="text-sm font-semibold truncate">
                    {item.name}
                  </h3>
                  <p className="text-green-700 font-bold text-sm">
                    ₹{item.discount_price}
                  </p>
                  <p className="text-xs text-gray-500 line-through">
                    ₹{item.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
