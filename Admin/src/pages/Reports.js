import React, { useState } from 'react';
import { 
  Calendar, 
  ArrowRight, 
  Download, 
  BarChart2, 
  TrendingUp, 
  Package, 
  Users
} from 'lucide-react';
import { dashboardStats } from '../utils/mockData';
import DashboardChart from '../components/dashboard/DashboardChart';

const Reports = () => {
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10),
    to: new Date().toISOString().substr(0, 10)
  });
  
  // Get chart data based on selected report type
  const getChartData = () => {
    switch (reportType) {
      case 'sales':
        return {
          labels: dashboardStats.salesChart.labels,
          data: dashboardStats.salesChart.data,
          type: 'line',
          label: 'Sales (₹)',
          borderColor: '#2563EB',
          backgroundColor: 'rgba(37, 99, 235, 0.1)'
        };
      case 'orders':
        return {
          labels: dashboardStats.orderStatusChart.labels,
          data: dashboardStats.orderStatusChart.data,
          type: 'bar',
          backgroundColor: [
            '#F59E0B', // Pending - amber
            '#3B82F6', // Processing - blue
            '#10B981', // Shipped - green
            '#059669', // Delivered - green
            '#EF4444', // Cancelled - red
          ]
        };
      case 'products':
        return {
          labels: dashboardStats.topSellingProducts.map(p => p.name),
          data: dashboardStats.topSellingProducts.map(p => p.sold),
          type: 'bar',
          label: 'Units Sold',
          backgroundColor: '#10B981'
        };
      case 'users':
        // Mock data for user registrations
        return {
          labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          data: [3, 5, 8, 12, 15, 20],
          type: 'line',
          label: 'New Users',
          borderColor: '#8B5CF6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)'
        };
      default:
        return {
          labels: [],
          data: [],
          type: 'line'
        };
    }
  };
  
  // Get report title
  const getReportTitle = () => {
    switch (reportType) {
      case 'sales':
        return 'Sales Report';
      case 'orders':
        return 'Order Status Report';
      case 'products':
        return 'Product Performance Report';
      case 'users':
        return 'User Registration Report';
      default:
        return 'Report';
    }
  };
  
  // Mock download report function
  const downloadReport = () => {
    alert(`Downloading ${getReportTitle()} for ${dateRange.from} to ${dateRange.to} (mock)`);
    // In a real app, this would generate and download a report file
  };
  
  const chartData = getChartData();
  
  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Reports & Analytics</h1>
        <button 
          onClick={downloadReport}
          className="btn btn-primary flex items-center"
        >
          <Download size={18} className="mr-2" />
          Download Report
        </button>
      </div>
      
      {/* Report filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1">
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">
              Report Type
            </label>
            <select
              id="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            >
              <option value="sales">Sales Report</option>
              <option value="orders">Order Status Report</option>
              <option value="products">Product Performance Report</option>
              <option value="users">User Registration Report</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Date Range
            </label>
            <div className="mt-1 flex items-center">
              <div className="flex-1">
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <ArrowRight size={20} className="mx-2 text-gray-400" />
              <div className="flex-1">
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  min={dateRange.from}
                  className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-end">
            <button className="btn btn-primary flex items-center">
              <Calendar size={18} className="mr-2" />
              Apply
            </button>
          </div>
        </div>
      </div>
      
      {/* Report summary cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-500">Total Sales</h2>
            <div className="rounded-full bg-blue-50 p-2 text-blue-600">
              <BarChart2 size={20} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-800">₹{dashboardStats.totalSales.toLocaleString()}</p>
          <div className="mt-2 flex items-center">
            <TrendingUp size={16} className="text-green-500" />
            <span className="ml-1 text-xs font-medium text-green-600">+18.3%</span>
            <span className="ml-1 text-xs text-gray-500">vs. previous period</span>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-500">Total Orders</h2>
            <div className="rounded-full bg-purple-50 p-2 text-purple-600">
              <Calendar size={20} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-800">{dashboardStats.totalOrders}</p>
          <div className="mt-2 flex items-center">
            <TrendingUp size={16} className="text-green-500" />
            <span className="ml-1 text-xs font-medium text-green-600">+12.5%</span>
            <span className="ml-1 text-xs text-gray-500">vs. previous period</span>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-500">Total Products</h2>
            <div className="rounded-full bg-green-50 p-2 text-green-600">
              <Package size={20} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-800">8</p>
          <div className="mt-2 flex items-center">
            <TrendingUp size={16} className="text-green-500" />
            <span className="ml-1 text-xs font-medium text-green-600">+5.2%</span>
            <span className="ml-1 text-xs text-gray-500">vs. previous period</span>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-500">Total Users</h2>
            <div className="rounded-full bg-amber-50 p-2 text-amber-600">
              <Users size={20} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-800">{dashboardStats.totalUsers}</p>
          <div className="mt-2 flex items-center">
            <TrendingUp size={16} className="text-green-500" />
            <span className="ml-1 text-xs font-medium text-green-600">+9.7%</span>
            <span className="ml-1 text-xs text-gray-500">vs. previous period</span>
          </div>
        </div>
      </div>
      
      {/* Report chart */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800">{getReportTitle()}</h2>
          <span className="text-sm text-gray-500">
            {new Date(dateRange.from).toLocaleDateString()} - {new Date(dateRange.to).toLocaleDateString()}
          </span>
        </div>
        
        <div className="h-80">
          <DashboardChart
            type={chartData.type}
            labels={chartData.labels}
            data={chartData.data}
            label={chartData.label}
            borderColor={chartData.borderColor}
            backgroundColor={chartData.backgroundColor}
          />
        </div>
      </div>
      
      {/* Detailed data table */}
      {reportType === 'sales' && (
        <div className="card">
          <h2 className="mb-4 text-lg font-medium text-gray-800">Sales Breakdown</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Avg. Order Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {dashboardStats.salesChart.labels.map((month, index) => {
                  const orders = Math.floor(Math.random() * 10) + 1;
                  const revenue = dashboardStats.salesChart.data[index];
                  const avgOrderValue = revenue / orders;
                  
                  // Calculate mock growth rate
                  let growth = 0;
                  if (index > 0) {
                    const prevRevenue = dashboardStats.salesChart.data[index - 1];
                    growth = ((revenue - prevRevenue) / prevRevenue) * 100;
                  }
                  
                  return (
                    <tr key={month}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {month} 2023
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {orders}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        ₹{revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        ₹{avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          growth > 0 
                            ? 'bg-green-100 text-green-800' 
                            : growth < 0 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {growth > 0 && '+'}
                          {growth.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {reportType === 'products' && (
        <div className="card">
          <h2 className="mb-4 text-lg font-medium text-gray-800">Top Selling Products</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Units Sold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Conversion Rate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {dashboardStats.topSellingProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {product.id <= 2 ? 'Baby Products' : 
                       product.id <= 4 ? 'Medicine' : 
                       product.id <= 6 ? 'Medical Devices' : 'Supplements'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {product.sold}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      ₹{product.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {(Math.random() * 10 + 20).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;