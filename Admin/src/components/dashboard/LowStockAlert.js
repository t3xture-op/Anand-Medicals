import React, { useEffect, useState } from "react";


const LowStockAlert = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/notifications", {
          credentials: "include",
        });
        const data = await res.json();

        // Deduplicate products by _id
        const seen = new Map();

        data.forEach((n) => {
          if (n.type?.toLowerCase() === "stock" && n.product) {
            const productId = n.product._id;
            if (!seen.has(productId)) {
              seen.set(productId, {
                _id: productId,
                name: n.product.name,
                image: n.product.image,
                stock: n.product.stock,
                manufacturer: n.product.manufacturer,
              });
            }
          }
        });

        const lowStock = Array.from(seen.values()).slice(0, 3);
        setLowStockProducts(lowStock);
      } catch (err) {
        console.error("Failed to fetch low stock alerts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStock();
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-400">Loading low stock alerts...</p>;
  }

  return (
    <div className="space-y-3  text-black ">
      {lowStockProducts.length > 0 ? (
        lowStockProducts.map((product) => (
          <div key={product._id} className="flex items-center justify-between">
            <div className="flex items-center ">
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-[#21262d] border border-gray-300 dark:border-[#30363d]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover object-center "
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {product.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-white-400">
                  Manufacturer: {product.manufacturer}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  product.stock <= 5
                    ? "bg-red-100 text-red-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {product.stock} left
              </span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 dark:text-white">All products are well stocked!</p>
      )}
    </div>
  );
};

export default LowStockAlert;
