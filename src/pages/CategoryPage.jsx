import { useParams, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCartStore } from "../store/cartStore";

export default function CategoryPage() {
  const { id } = useParams();
  const location = useLocation();
  const categoryName = location.state?.categoryName;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/category/${id}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error loading category products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [id]);

  const handleAddToCart = async (product) => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.discount_price,
      image: product.image,
      stock: product.stock,
      quantity: 1,
    });

    try {
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          product: product._id,
          quantity: 1
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Failed to add to cart');
        return;
      }

      alert('Item added to your cart');
    } catch (error) {
      alert("Error adding to cart: " + error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 capitalize">Products in {categoryName}</h1>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="border rounded-lg shadow hover:shadow-lg transition p-4">
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-4 rounded transition-transform duration-300 transform hover:scale-105"
                />
                <h2 className="text-xl font-semibold hover:text-blue-600">{product.name}</h2>
              </Link>
              <p className="text-sm text-gray-600 mt-1">{product.description}</p>

              {/* Price and stock row */}
              <div className="mt-3 flex justify-between items-center">
                <div>
                  <div className="text-green-600 font-bold text-lg">
                    ₹{product.discount_price}
                  </div>
                  <div className="text-gray-500 text-sm line-through">
                    ₹{product.price}
                  </div>
                  {product.discount > 0 && (
                    <div className="text-red-500 text-xs font-medium">
                      {product.discount}% off
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-700 whitespace-nowrap">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </div>
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                className="mt-4 w-full bg-green-600 text-white text-sm font-medium py-2 px-4 rounded hover:bg-green-700 transition"
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
