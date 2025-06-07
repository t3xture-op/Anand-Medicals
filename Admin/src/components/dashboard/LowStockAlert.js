import React from 'react';
import { products } from '../../utils/mockData';
import { Link } from 'react-router-dom';

const LowStockAlert = () => {
  // Filter products with low stock (less than or equal to 10)
  const lowStockProducts = products
    .filter(product => product.stock <= 10)
    .slice(0, 3); // Only show 3 for the dashboard

  return (
    <div className="space-y-3">
      {lowStockProducts.length > 0 ? (
        lowStockProducts.map((product) => (
          <div key={product.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">{product.name}</p>
                <p className="text-xs text-gray-500">SKU: {product.sku}</p>
              </div>
            </div>
            <div className="text-right">
              <span 
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  product.stock <= 5 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {product.stock} left
              </span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No products with low stock!</p>
      )}
    </div>
  );
};

export default LowStockAlert;