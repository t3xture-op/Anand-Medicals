import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  FileText,
  TrendingUp,
  IndianRupee,
  Clock,
} from 'lucide-react';
import DashboardChart from '../components/dashboard/DashboardChart';
import DashboardMetricCard from '../components/dashboard/DashboardMetricCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import TopSellingProducts from '../components/dashboard/TopSellingProducts';
import LowStockAlert from '../components/dashboard/LowStockAlert';
const API_BASE = process.env.REACT_APP_API_BASE_URL;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/reports/admin/stats`, {
          credentials: 'include',
        });
        const data = await res.json();
        // Limit top selling products to 4
        data.topSellingProducts = data.topSellingProducts.slice(0, 4);
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/notifications`, {
          credentials: 'include',
        });
        const data = await res.json();
        const recent = data.slice(0, 4);
            const lowStock = data.filter(n => n.type === 'stock' && n.product && n.product.stock <= 10).slice(0, 4);
        setActivities(recent);
        setLowStockAlerts(lowStock);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    fetchStats();
    fetchNotifications();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-gray-500   dark:bg-[#0d1117] dark:text-white transition-colors">Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="text-center py-10 text-red-500  dark:bg-[#0d1117] dark:text-white transition-colors">Failed to load dashboard data.</div>;
  }

  return (
    <div className="space-y-6  fade-in text-black dark:bg-[#0d1117] dark:text-white transition-colors">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 ">
        <DashboardMetricCard
          title="Total Sales"
          value={`₹${stats.totalSales.toLocaleString()}`}
          icon={<IndianRupee className="h-8 w-8 text-green-600 "/>}
          change="+12.5%"
          trend="up"
          
        />

        <DashboardMetricCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<ShoppingBag className="h-8 w-8 text-blue-600" />}
          change="+7.2%"
          trend="up"
        />

        <DashboardMetricCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="h-8 w-8 text-purple-600" />}
          change="+4.3%"
          trend="up"
        />

        <DashboardMetricCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={<Clock className="h-8 w-8 text-amber-600" />}
          change="-2.1%"
          trend="down"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card bg-white dark:bg-[#161b22]">
          <h2 className="mb-4 text-lg font-medium text-gray-800 dark:text-white">Sales Overview</h2>
          <DashboardChart
            type={stats.salesChart.data.length === 1 ? 'bar' : 'line'}
            labels={stats.salesChart.labels}
            data={stats.salesChart.data}
            label="Sales (₹)"
            borderColor="#2563EB "
            backgroundColor="rgba(37, 99, 235, 0.1)"
          />
        </div>

        <div className="card bg-white dark:bg-[#161b22]">
          <h2 className="mb-4 text-lg font-medium text-gray-800 dark:text-white">Order Status</h2>
          <DashboardChart
            type="doughnut"
            labels={stats.orderStatusChart.labels}
            data={stats.orderStatusChart.data}
            backgroundColor={[
              '#F59E0B',
              '#3B82F6',
              '#10B981',
              '#059669',
              '#EF4444',
            ]}
          />
        </div>
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Low Stock Alert */}
        <div className="card bg-white dark:bg-[#161b22]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white ">Low Stock Alert</h2>
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          {lowStockAlerts.length > 0 ? (
            <LowStockAlert alerts={lowStockAlerts}/>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">All products are well stocked ✅</p>
          )}
          <div className="mt-4 text-center">
            <Link to="/products" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View all products
            </Link>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="card bg-white dark:bg-[#161b22]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Top Selling Products</h2>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <TopSellingProducts products={stats.topSellingProducts} />
          <div className="mt-4 text-center">
            <Link to="/reports" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View sales report
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card bg-white dark:bg-[#161b22]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Recent Activity</h2>
            <Clock className="h-5 w-5 text-blue-500" />
          </div>
          {activities.length > 0 ? (
            <RecentActivity activities={activities} />
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">No recent activities.</p>
          )}
          <div className="mt-4 text-center">
            <Link to="/notifications" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View all activity
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 bg-white  dark:bg-[#0d1117] dark:text-white transition-colors">
        <Link to="/products/add" className="card bg-white dark:bg-[#161b22] flex items-center justify-center p-4 text-center hover:bg-blue-50">
          <div>
            <Package className="mx-auto h-8 w-8 text-blue-600" />
            <h3 className="mt-2 text-sm font-medium text-gray-800 dark:text-white">Add New Product</h3>
          </div>
        </Link>

        <Link to="/orders" className="card bg-white dark:bg-[#161b22] flex items-center justify-center p-4 text-center hover:bg-blue-50">
          <div>
            <ShoppingBag className="mx-auto h-8 w-8 text-blue-600" />
            <h3 className="mt-2 text-sm font-medium text-gray-800 dark:text-white">
              Manage Orders
              {stats.pendingOrders > 0 && (
                <span className="ml-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-600">
                  {stats.pendingOrders}
                </span>
              )}
            </h3>
          </div>
        </Link>

        <Link to="/prescriptions" className="card  bg-white dark:bg-[#161b22] flex items-center justify-center p-4 text-center hover:bg-blue-50">
          <div>
            <FileText className="mx-auto h-8 w-8 text-blue-600" />
            <h3 className="mt-2 text-sm font-medium text-gray-800 dark:text-white">
              Review Prescriptions
              {stats.prescriptionToReview > 0 && (
                <span className="ml-2 inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                  {stats.prescriptionToReview}
                </span>
              )}
            </h3>
          </div>
        </Link>

        <Link to="/offers/add" className="card  bg-white dark:bg-[#161b22] flex items-center justify-center p-4 text-center hover:bg-blue-50">
          <div>
            <Package className="mx-auto h-8 w-8 text-blue-600" />
            <h3 className="mt-2 text-sm font-medium text-gray-800 dark:text-white">Create Offer</h3>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
