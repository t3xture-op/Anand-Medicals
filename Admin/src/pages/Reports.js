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
import { toast } from "sonner";

export default function Reports() {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [reportType, setReportType] = useState("sales");
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60e3).toISOString().slice(0, 10),
    to: new Date().toISOString().slice(0, 10),
  });
  const [loading, setLoading] = useState(true);
  const [detailsData, setDetailsData] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchDetails();
  }, [reportType]);

  async function fetchStats() {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/reports/stats?from=${dateRange.from}&to=${dateRange.to}`,
        { credentials: "include" }
      );
      setDashboardStats(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchDetails() {
    try {
      const url =
        reportType === "sales"
          ? `http://localhost:5000/api/reports/sales-details?from=${dateRange.from}&to=${dateRange.to}`
          : reportType === "orders"
          ? `http://localhost:5000/api/reports/orders-report?from=${dateRange.from}&to=${dateRange.to}`
          : reportType === "products"
          ? `http://localhost:5000/api/reports/products-report?from=${dateRange.from}&to=${dateRange.to}`
          : null;
      if (!url) return setDetailsData([]);
      const res = await fetch(url, { credentials: "include" });
      setDetailsData(await res.json());
    } catch (err) {
      console.error(err);
    }
  }

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `http://localhost:5000/api/reports/download?type=${reportType}`;
    link.download = `${reportType}-report.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success("Report Downloaded")
  };

  if (loading) return <div className="p-4">Loading report data...</div>;
  const { labels, data, type, label, borderColor, backgroundColor } = (() => {
    if (!dashboardStats) return {};
    if (reportType === "sales") {
      return {
        labels: dashboardStats.salesChart.labels,
        data: dashboardStats.salesChart.data,
        type: dashboardStats.salesChart.data.length < 2 ? "bar" : "line",
        label: "Sales (₹)",
        borderColor: "#2563EB",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
      };
    }
    if (reportType === "orders") {
      return {
        labels: dashboardStats.orderStatusChart.labels,
        data: dashboardStats.orderStatusChart.data,
        type: "bar",
        label: "Orders",
        backgroundColor: ["#F59E0B", "#3B82F6", "#10B981", "#EF4444"],
      };
    }
    if (reportType === "products") {
      return {
        labels: dashboardStats.topSellingProducts.map((p) => p.name),
        data: dashboardStats.topSellingProducts.map((p) => p.sold),
        type: "bar",
        label: "Units Sold",
        backgroundColor: "#10B981",
      };
    }
    if (reportType === "users") {
      return {
        labels: dashboardStats.userChart.labels,
        data: dashboardStats.userChart.data,
        type: dashboardStats.userChart.data.length < 2 ? "bar" : "line",
        label: "New Users",
        borderColor: "#8B5CF6",
        backgroundColor: "rgba(139,92,246,0.1)",
      };
    }
    return {};
  })();

  function getReportTitle() {
    if (reportType === "sales") return "Sales Report";
    if (reportType === "orders") return "Order Status Report";
    if (reportType === "products") return "Product Performance Report";
    if (reportType === "users") return "User Registration Report";
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Reports & Analytics
        </h1>
        <button
          onClick={handleDownload}
          className="btn btn-primary flex items-center"
        >
          <Download size={18} className="mr-2" /> Download Report
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1">
            <label
              htmlFor="reportType"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Report Type
            </label>
            <select
              id="reportType"
              value={reportType}
              onChange={(e) => {
                setReportType(e.target.value);
                setDetailsData([]);
              }}
              className="block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md py-2 pl-3 pr-10 text-base focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="sales">Sales Report</option>
              <option value="orders">Order Status Report</option>
              <option value="products">Product Performance Report</option>
              <option value="users">User Registration Report</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date Range
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange({ ...dateRange, from: e.target.value })
                }
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1 text-sm"
              />
              <ArrowRight size={20} className="mx-2 text-gray-400" />
              <input
                type="date"
                value={dateRange.to}
                min={dateRange.from}
                onChange={(e) =>
                  setDateRange({ ...dateRange, to: e.target.value })
                }
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1 text-sm"
              />
              <button
                onClick={() => {
                  fetchStats();
                  fetchDetails();
                }}
                className="btn btn-primary flex items-center ml-4"
              >
                <Calendar size={18} className="mr-2" /> Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {["sales", "orders", "products", "users"].map((type) => {
          const Icon = {
            sales: BarChart2,
            orders: Calendar,
            products: Package,
            users: Users,
          }[type];
          const colors = {
            sales: "blue",
            orders: "purple",
            products: "green",
            users: "amber",
          }[type];
          const titles = {
            sales: "Total Sales",
            orders: "Total Orders",
            products: "Total Products",
            users: "Total Users",
          }[type];
          const growth = {
            sales: "+18.3%",
            orders: "+12.5%",
            products: "+5.2%",
            users: "+9.7%",
          }[type];
          const vals = {
            sales: dashboardStats.totalSales,
            orders: dashboardStats.totalOrders,
            products: dashboardStats.totalProducts,
            users: dashboardStats.totalUsers,
          };
          return (
            <div key={type} className="card dark:bg-gray-900">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  {titles}
                </h2>
                <div
                  className={`rounded-full bg-${colors}-50 dark:bg-${colors}-800/20 p-2 text-${colors}-600`}
                >
                  <Icon size={20} />
                </div>
              </div>
              <p className="mt-2 text-2xl font-semibold text-gray-800 dark:text-gray-100">
                {type === "sales"
                  ? `₹${vals[type]?.toLocaleString()}`
                  : vals[type] || 0}
              </p>
              <div className="mt-2 flex items-center">
                <TrendingUp size={16} className="text-green-500" />
                <span className="ml-1 text-xs font-medium text-green-600">
                  {growth}
                </span>
                <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                  vs. previous period
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="card dark:bg-gray-900">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100">
            {getReportTitle()}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(dateRange.from).toLocaleDateString()} -{" "}
            {new Date(dateRange.to).toLocaleDateString()}
          </span>
        </div>
        <div className="h-80">
          {!labels?.length || !data?.length ? (
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              No data available for this report.
            </div>
          ) : (
            <DashboardChart
              type={type}
              labels={labels}
              data={data}
              label={label}
              borderColor={borderColor}
              backgroundColor={backgroundColor}
            />
          )}
        </div>
      </div>

      {/* Detail Table (Sales) */}
      {reportType === "sales" && (
        <div className="card dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-medium text-gray-800 dark:text-gray-100">
            Sales Details
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                    Time
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                    Items
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                    Total (₹)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {detailsData.map((d) => (
                  <tr key={d.id} className="text-gray-800 dark:text-gray-100">
                    <td className="px-4 py-2">{d.date}</td>
                    <td className="px-4 py-2">{d.time}</td>
                    <td className="px-4 py-2">
                      {d.items.map((i) => `${i.name}(${i.qty})`).join(", ")}
                    </td>
                    <td className="px-4 py-2 font-medium">
                      ₹{d.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders */}
      {reportType === "orders" && (
        <div className="card dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-medium text-gray-800 dark:text-gray-100">
            Orders Report
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                    Time
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                    Total (₹)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {detailsData.map((d) => (
                  <tr key={d.id} className="text-gray-800 dark:text-gray-100">
                    <td className="px-4 py-2">{d.date}</td>
                    <td className="px-4 py-2">{d.time}</td>
                    <td className="px-4 py-2">{d.status}</td>
                    <td className="px-4 py-2 font-medium">
                      ₹{d.total?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Products */}
      {reportType === "products" && (
        <div className="card dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-medium text-gray-800 dark:text-gray-100">
            Product Performance
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                    Product
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                    Manufacturer
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                    Units Sold
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                    Revenue (₹)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {detailsData.map((d, idx) => (
                  <tr key={idx} className="text-gray-800 dark:text-gray-100">
                    <td className="px-4 py-2">{d.name}</td>
                    <td className="px-4 py-2">{d.manufacturer}</td>
                    <td className="px-4 py-2">{d.totalQuantity}</td>
                    <td className="px-4 py-2 font-medium">
                      ₹{d.totalRevenue?.toLocaleString()}
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
}
