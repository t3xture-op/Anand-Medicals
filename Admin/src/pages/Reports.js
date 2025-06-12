import React, { useState, useEffect } from "react";
import {
  Calendar,
  ArrowRight,
  Download,
  BarChart2,
  TrendingUp,
  Package,
  Users,
} from "lucide-react";
import DashboardChart from "../components/dashboard/DashboardChart";

export default function Reports() {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [reportType, setReportType] = useState("sales");
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .substr(0, 10),
    to: new Date().toISOString().substr(0, 10),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/reports/stats", {
          credentials: "include",
        });
        const data = await res.json();
        setDashboardStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/reports/stats?from=${dateRange.from}&to=${dateRange.to}`,
        { credentials: "include" }
      );
      const data = await res.json();
      console.log("Fetched Dashboard Stats: ", data);
      setDashboardStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    // Map frontend report type to backend expected value
    let backendType = reportType;
    if (reportType === "orders") backendType = "order-status";
    else if (reportType === "users") backendType = "user-registrations";
    else if (reportType === "products") backendType = "product-performance";

    const link = document.createElement("a");
    link.href = `http://localhost:5000/api/reports/download?type=${reportType}`;
    link.setAttribute("download", `${backendType}_report.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getChartData = () => {
    if (!dashboardStats) return { labels: [], data: [], type: "line" };

    switch (reportType) {
      case "sales":
        const salesData = [...dashboardStats.salesChart.data];
        const salesLabels = [...dashboardStats.salesChart.labels];

        if (salesData.length === 1) {
          salesData.unshift(0);
          salesLabels.unshift("Previous");
        }
        return {
          labels: dashboardStats?.salesChart?.labels || [],
          data: dashboardStats?.salesChart?.data || [],
          type: dashboardStats?.salesChart?.data?.length < 2 ? "bar" : "line",

          label: "Sales (₹)",
          borderColor: "#2563EB",
          backgroundColor: "rgba(37, 99, 235, 0.1)",
        };
      case "orders":
        return {
          labels: dashboardStats.orderStatusChart.labels,
          data: dashboardStats.orderStatusChart.data,
          type: "bar",
          label: "Orders",
          backgroundColor: ["#F59E0B", "#3B82F6", "#10B981", "#EF4444"],
        };

      case "products":
        return {
          labels: dashboardStats.topSellingProducts.map((p) => p.name),
          data: dashboardStats.topSellingProducts.map((p) => p.sold),
          type: "bar",
          label: "Units Sold",
          backgroundColor: "#10B981",
        };

      case "users":
        return {
          labels: dashboardStats?.userChart?.labels || [],
          data: dashboardStats?.userChart?.data || [],
          type: dashboardStats?.userChart?.data?.length < 2 ? "bar" : "line",
          label: "New Users",
          borderColor: "#8B5CF6",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
        };

      default:
        return { labels: [], data: [], type: "line" };
    }
  };

  const getReportTitle = () => {
    switch (reportType) {
      case "sales":
        return "Sales Report";
      case "orders":
        return "Order Status Report";
      case "products":
        return "Product Performance Report";
      case "users":
        return "User Registration Report";
      default:
        return "Report";
    }
  };

  if (loading) return <div className="p-4">Loading report data...</div>;

  const chartData = getChartData();

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">
          Reports & Analytics
        </h1>
        <button
          onClick={handleDownload}
          className="btn btn-primary flex items-center"
        >
          <Download size={18} className="mr-2" />
          Download Report
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1">
            <label
              htmlFor="reportType"
              className="block text-sm font-medium text-gray-700"
            >
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
                  onChange={(e) =>
                    setDateRange({ ...dateRange, from: e.target.value })
                  }
                  className="w-full border rounded-md px-2 py-1 text-sm"
                />
              </div>
              <ArrowRight size={20} className="mx-2 text-gray-400" />
              <div className="flex-1">
                <input
                  type="date"
                  value={dateRange.to}
                  min={dateRange.from}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, to: e.target.value })
                  }
                  className="w-full border rounded-md px-2 py-1 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchStats}
              className="btn btn-primary flex items-center"
            >
              <Calendar size={18} className="mr-2" /> Apply
            </button>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {["sales", "orders", "products", "users"].map((type) => {
          const icons = {
            sales: BarChart2,
            orders: Calendar,
            products: Package,
            users: Users,
          };
          const colors = {
            sales: "blue",
            orders: "purple",
            products: "green",
            users: "amber",
          };
          const titles = {
            sales: "Total Sales",
            orders: "Total Orders",
            products: "Total Products",
            users: "Total Users",
          };
          const growths = {
            sales: "+18.3%",
            orders: "+12.5%",
            products: "+5.2%",
            users: "+9.7%",
          };
          const values = {
            sales: dashboardStats.totalSales?.toLocaleString() || 0,
            orders: dashboardStats.totalOrders || 0,
            products: dashboardStats.totalProducts || 0,
            users: dashboardStats.totalUsers || 0,
          };
          const Icon = icons[type];
          const color = colors[type];
          return (
            <div key={type} className="card">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-gray-500">
                  {titles[type]}
                </h2>
                <div
                  className={`rounded-full bg-${color}-50 p-2 text-${color}-600`}
                >
                  <Icon size={20} />
                </div>
              </div>
              <p className="mt-2 text-2xl font-semibold text-gray-800">
                {type === "sales" ? `₹${values[type]}` : values[type]}
              </p>
              <div className="mt-2 flex items-center">
                <TrendingUp size={16} className="text-green-500" />
                <span className="ml-1 text-xs font-medium text-green-600">
                  {growths[type]}
                </span>
                <span className="ml-1 text-xs text-gray-500">
                  vs. previous period
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800">
            {getReportTitle()}
          </h2>
          <span className="text-sm text-gray-500">
            {new Date(dateRange.from).toLocaleDateString()} -{" "}
            {new Date(dateRange.to).toLocaleDateString()}
          </span>
        </div>
        <div className="h-80">
          {chartData.labels.length === 0 ? (
            <div className="text-center text-sm text-gray-500">
              No data available for this report.
            </div>
          ) : (
            <>
              <DashboardChart
                type={chartData.type}
                labels={chartData.labels}
                data={chartData.data}
                label={chartData.label}
                borderColor={chartData.borderColor}
                backgroundColor={chartData.backgroundColor}
              />
            </>
          )}
        </div>
      </div>

      {/* Tables (still mock or to be connected) */}
      {reportType === "sales" && (
        <div className="card">
          <h2 className="mb-4 text-lg font-medium text-gray-800">
            Sales Breakdown
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              …same as original…
            </table>
          </div>
        </div>
      )}
      {reportType === "products" && (
        <div className="card">
          <h2 className="mb-4 text-lg font-medium text-gray-800">
            Top Selling Products
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              …same as original…
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
