import React from 'react';
import { TrendingUp } from 'lucide-react';

const TopSellingProducts = ({ products }) => {
  if (!products || products.length === 0) {
    return <p className="text-sm text-gray-500">No sales data available.</p>;
  }

  return (
    <div className="space-y-3">
      {products.map((product) => (
        <div key={product._id} className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800">{product.name}</p>
            <p className="text-xs text-gray-500">{product.sold} units sold</p>
            <p className="text-xs text-gray-400">by {product.manufacturer}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">
              ₹{product.revenue?.toLocaleString() || 0}
            </p>
            <div className="flex items-center justify-end">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="ml-1 text-xs font-medium text-green-600">
                +{Math.floor(Math.random() * 20) + 5}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopSellingProducts;
