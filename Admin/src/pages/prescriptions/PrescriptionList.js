import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  ExternalLink,
  X,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
const API_BASE = process.env.REACT_APP_API_BASE_URL;

const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/prescription/admin/all`, {
          method: "GET",
          credentials:"include",
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to fetch prescriptions");
        }

        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid data format");
        setPrescriptions(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchPrescriptions();
  }, []);

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesSearch =
      prescription.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prescription.orderId &&
        prescription.orderId.toString().includes(searchTerm));
    const matchesStatus = statusFilter
      ? prescription.status === statusFilter
      : true;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Not reviewed yet";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle size={18} className="text-green-500" />;
      case "pending":
        return <AlertTriangle size={18} className="text-amber-500" />;
      case "rejected":
        return <XCircle size={18} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDelete = async (id) => {
    toast("DELETE PRESCRIPTION", {
      description: "Are you sure you want to delete this prescription?",
      action: {
        label: "DELETE",
        onClick: async () => {
          try {
            const res = await fetch(
              `${API_BASE}/api/prescription/admin/${id}`,
              {
                method: "DELETE",
                credentials: "include",
              }
            );

            if (!res.ok) {
              const data = await res.json();
              throw new Error(data.message || "Failed to delete prescription");
            }

            setPrescriptions((prev) => prev.filter((p) => p.id !== id));
            toast.success("Prescription deleted successfully");
          } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete prescription");
          }
        },
      },
    });
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Prescription Management
        </h1>
      </div>

      {/* Filters Container */}
      <div className="rounded-lg border border-gray-200 dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name or order ID..."
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0d1117] py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center px-4 py-2 border border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#0d1117] text-gray-700 dark:text-white rounded-md text-sm"
          >
            <Filter size={18} className="mr-2" />
            Filter
            {statusFilter && (
              <span className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 text-xs rounded-full">
                1
              </span>
            )}
          </button>

          {/* Desktop Filter & Clear */}
          <div className="hidden sm:flex gap-3 items-center">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#0d1117] text-sm text-gray-900 dark:text-white"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            {(searchTerm || statusFilter) && (
              <button
                onClick={clearFilters}
                className="text-blue-600 dark:text-blue-400 text-sm flex items-center"
              >
                <X size={16} className="mr-1" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filter Dropdown */}
        {showFilters && (
          <div className="mt-4 sm:hidden">
            <label className="block text-sm text-gray-700 dark:text-white mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#0d1117] text-sm text-gray-900 dark:text-white"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950 text-red-600 border border-red-200 dark:border-red-800 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Prescription Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrescriptions.length > 0 ? (
          filteredPrescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="rounded-lg bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Image Section */}
              <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                <img
                  src={prescription.image}
                  alt={`Prescription for ${prescription.userName}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/400x300?text=Prescription+Image";
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-white text-base font-medium">
                    {prescription.userName}
                  </h3>
                  <p className="text-white text-sm mt-1">
                    Order ID: {prescription.orderId}
                  </p>
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  <div className="bg-white p-1 rounded-full">
                    {getStatusIcon(prescription.status)}
                  </div>
                  <button
                    onClick={() => handleDelete(prescription.id)}
                    className="bg-white p-1 rounded-full hover:bg-red-100"
                    title="Delete Prescription"
                  >
                    <X size={16} className="text-red-600" />
                  </button>
                </div>
              </div>

              {/* Meta Section */}
              <div className="mt-4 px-4 pb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Status:
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                      prescription.status
                    )}`}
                  >
                    {prescription.status}
                  </span>
                </div>
                <div className="mt-2 flex items-center">
                  <Calendar size={16} className="text-gray-400 mr-1" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(prescription.reviewDate)}
                  </span>
                </div>
                {prescription.notes && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {prescription.notes}
                  </p>
                )}
                <div className="mt-4 text-right">
                  <Link
                    to={`/prescriptions/${prescription.id}`}
                    className="text-blue-600 dark:text-blue-400 text-sm flex items-center justify-end hover:underline"
                  >
                    {prescription.status === "pending"
                      ? "Review Now"
                      : "View Details"}
                    <ExternalLink size={14} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 p-8 text-center border rounded-lg border-gray-200 dark:border-[#30363d] bg-white dark:bg-[#161b22]">
            <p className="text-gray-500 dark:text-gray-400">
              No prescriptions found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionList;
