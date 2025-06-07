import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  FileText,
  TrendingUp,
  DollarSign,
  Clock
} from 'lucide-react';
import { dashboardStats } from '../utils/mockData';
import DashboardChart from '../components/dashboard/DashboardChart';
import DashboardMetricCard from '../components/dashboard/DashboardMetricCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import TopSellingProducts from '../components/dashboard/TopSellingProducts';
import LowStockAlert from '../components/dashboard/LowStockAlert';

const Dashboard = () => {
  const {
    totalSales,
    totalOrders,
    totalUsers,
    pendingOrders,
    lowStockProducts,
    pendingPrescriptions,
    salesChart,
    orderStatusChart,
    topSellingProducts,
    recentActivity
  } = dashboardStats;

  return (
    <div className="space-y-6 fade-in">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardMetricCard
          title="Total Sales"
          value={`₹${totalSales.toLocaleString()}`}
          icon={<DollarSign className="h-8 w-8 text-green-600" />}
          change="+12.5%"
          trend="up"
        />
        
        <DashboardMetricCard
          title="Total Orders"
          value={totalOrders}
          icon={<ShoppingBag className="h-8 w-8 text-blue-600" />}
          change="+7.2%"
          trend="up"
        />
        
        <DashboardMetricCard
          title="Total Users"
          value={totalUsers}
          icon={<Users className="h-8 w-8 text-purple-600" />}
          change="+4.3%"
          trend="up"
        />
        
        <DashboardMetricCard
          title="Pending Orders"
          value={pendingOrders}
          icon={<Clock className="h-8 w-8 text-amber-600" />}
          change="-2.1%"
          trend="down"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 text-lg font-medium text-gray-800">Sales Overview</h2>
          <DashboardChart 
            type="line"
            labels={salesChart.labels}
            data={salesChart.data}
            label="Sales (₹)"
            borderColor="#2563EB"
            backgroundColor="rgba(37, 99, 235, 0.1)"
          />
        </div>
        
        <div className="card">
          <h2 className="mb-4 text-lg font-medium text-gray-800">Order Status</h2>
          <DashboardChart 
            type="doughnut"
            labels={orderStatusChart.labels}
            data={orderStatusChart.data}
            backgroundColor={[
              '#F59E0B', // Pending - amber
              '#3B82F6', // Processing - blue
              '#10B981', // Shipped - green
              '#059669', // Delivered - green
              '#EF4444', // Cancelled - red
            ]}
          />
        </div>
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Low Stock Alert */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-800">Low Stock Alert</h2>
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <LowStockAlert />
          <div className="mt-4 text-center">
            <Link to="/products" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View all products
            </Link>
          </div>
        </div>
        
        {/* Top Selling Products */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-800">Top Selling Products</h2>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <TopSellingProducts products={topSellingProducts} />
          <div className="mt-4 text-center">
            <Link to="/reports" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View sales report
            </Link>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-800">Recent Activity</h2>
            <Clock className="h-5 w-5 text-blue-500" />
          </div>
          <RecentActivity activities={recentActivity} />
          <div className="mt-4 text-center">
            <Link to="/notifications" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View all activity
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Link to="/products/add" className="card flex items-center justify-center p-4 text-center hover:bg-blue-50">
          <div>
            <Package className="mx-auto h-8 w-8 text-blue-600" />
            <h3 className="mt-2 text-sm font-medium text-gray-800">Add New Product</h3>
          </div>
        </Link>
        
        <Link to="/orders" className="card flex items-center justify-center p-4 text-center hover:bg-blue-50">
          <div>
            <ShoppingBag className="mx-auto h-8 w-8 text-blue-600" />
            <h3 className="mt-2 text-sm font-medium text-gray-800">Manage Orders</h3>
            {pendingOrders > 0 && (
              <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                {pendingOrders} pending
              </span>
            )}
          </div>
        </Link>
        
        <Link to="/prescriptions" className="card flex items-center justify-center p-4 text-center hover:bg-blue-50">
          <div>
            <FileText className="mx-auto h-8 w-8 text-blue-600" />
            <h3 className="mt-2 text-sm font-medium text-gray-800">Review Prescriptions</h3>
            {pendingPrescriptions > 0 && (
              <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                {pendingPrescriptions} pending
              </span>
            )}
          </div>
        </Link>
        
        <Link to="/offers/add" className="card flex items-center justify-center p-4 text-center hover:bg-blue-50">
          <div>
            <Package className="mx-auto h-8 w-8 text-blue-600" />
            <h3 className="mt-2 text-sm font-medium text-gray-800">Create Offer</h3>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;