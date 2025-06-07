import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const DashboardMetricCard = ({ title, value, icon, change, trend }) => {
  return (
    <div className="card hover:shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="rounded-full bg-blue-50 p-2">
          {icon}
        </div>
      </div>
      <p className="mt-2 text-2xl font-semibold text-gray-800">{value}</p>
      <div className="mt-2 flex items-center">
        {trend === 'up' ? (
          <>
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="ml-1 text-xs font-medium text-green-600">{change}</span>
          </>
        ) : (
          <>
            <TrendingDown className="h-4 w-4 text-red-500" />
            <span className="ml-1 text-xs font-medium text-red-600">{change}</span>
          </>
        )}
        <span className="ml-1 text-xs text-gray-500">from last month</span>
      </div>
    </div>
  );
};

export default DashboardMetricCard;