import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Save,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
const API_BASE = process.env.REACT_APP_API_BASE_URL;

export default function PrescriptionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/prescription/admin/${id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("Access denied");
        const data = await res.json();
        setPrescription(data);
        setStatus(data.status);
        setNotes(data.notes || "");
        if (data.order) setOrder(data.order);
      } catch (err) {
        console.error(err.message);
        navigate("/prescriptions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrescription();
  }, [id, navigate]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/prescription/admin/review/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status, notes }),
        }
      );

      if (!res.ok) {
        const errorData = await res.text(); // show full error response
        throw new Error(`Review failed: ${errorData}`);
      }

      const data = await res.json();
      setPrescription(data.prescription);
      toast.success(`Prescription has been ${status}`);
      navigate("/prescriptions");
    } catch (err) {
      console.error("Review error:", err);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

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

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-lg text-gray-700">
        Loading...
      </div>
    );
  }

  if (!prescription) return null;

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center">
        <button
          onClick={() => navigate("/prescriptions")}
          className="mr-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            Prescription Review
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ID: {prescription._id} • Submitted by {prescription.user?.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white dark:bg-[#161b22] p-6 rounded border dark:border-[#30363d]">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Prescription Details
            </h2>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(
                prescription.status
              )}`}
            >
              {prescription.status.charAt(0).toUpperCase() +
                prescription.status.slice(1)}
            </span>
          </div>

          <img
            src={prescription.image}
            alt="Prescription"
            className="w-full object-contain border rounded mb-4"
          />

          <div className="grid gap-2 mb-4 text-sm text-gray-800 dark:text-gray-300">
            <div>
              <strong>Doctor Name:</strong> {prescription.doctorName || "—"}
            </div>
            <div>
              <strong>Specialization:</strong>{" "}
              {prescription.doctorSpecialization || "—"}
            </div>
            <div>
              <strong>Notes:</strong> {prescription.notes || "—"}
            </div>
          </div>

          {prescription.medicines?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">
                Prescribed Medicines
              </h3>
              <ul className="divide-y divide-gray-200 dark:divide-[#30363d] rounded border dark:border-[#30363d] text-sm text-gray-800 dark:text-gray-300">
                {prescription.medicines.map((med, idx) => (
                  <li key={idx} className="p-2">
                    <div>
                      <strong>Name:</strong> {med.name}
                    </div>
                    <div>
                      <strong>Dosage:</strong> {med.dosage}
                    </div>
                    <div>
                      <strong>Frequency:</strong> {med.frequency}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleReviewSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">
                Review Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 w-full rounded border dark:border-[#30363d] bg-white dark:bg-[#0d1117] text-gray-800 dark:text-gray-100 px-3 py-2"
                required
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">
                Notes
              </label>
              <textarea
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 w-full rounded border dark:border-[#30363d] bg-white dark:bg-[#0d1117] text-gray-800 dark:text-gray-100 px-3 py-2"
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={
                  status === prescription.status && notes === prescription.notes
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
              >
                {isSubmitting ? (
                  <span className="flex items-center">Saving...</span>
                ) : (
                  <span className="flex items-center">
                    <Save size={18} className="mr-2" /> Save Review
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-[#161b22] p-4 rounded border dark:border-[#30363d] text-gray-800 dark:text-gray-300">
            <h2 className="text-lg font-medium mb-2">Status</h2>
            <div className="flex items-center">
              {prescription.status === "approved" ? (
                <CheckCircle size={20} className="text-green-500 mr-2" />
              ) : prescription.status === "pending" ? (
                <AlertTriangle size={20} className="text-yellow-500 mr-2" />
              ) : (
                <XCircle size={20} className="text-red-500 mr-2" />
              )}
              <span>{prescription.status}</span>
            </div>
            {prescription.reviewedBy && (
              <p>Reviewed by: {prescription.reviewedBy}</p>
            )}
            {prescription.reviewDate && (
              <p>Reviewed on: {formatDate(prescription.reviewDate)}</p>
            )}
          </div>

          <div className="bg-white dark:bg-[#161b22] p-4 rounded border dark:border-[#30363d]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-800 dark:text-white">
                Customer
              </h2>
              <Link
                to={`/users/${prescription.user?._id}`}
                className="text-blue-600 text-sm"
              >
                View Profile
              </Link>
            </div>
            <div className="flex items-center mt-3">
              <div className="rounded-full bg-gray-100 dark:bg-[#0d1117] mr-3 object-cover ">
                <img
                  src={prescription.user?.image || "/user.jpg"}
                  className="w-10 h-10 rounded-full object-cover "
                  alt="Photo"
                />
              </div>
              <div>
                <h3 className="text-gray-800 dark:text-white">
                  {prescription.user?.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {prescription.user?.email}
                </p>
              </div>
            </div>
          </div>

          {order && (
            <div className="bg-white dark:bg-[#161b22] p-4 rounded border dark:border-[#30363d]">
              <div className="flex justify-between">
                <h2 className="text-lg font-medium text-gray-800 dark:text-white">
                  Order
                </h2>
                <Link
                  to={`/orders/${order._id}`}
                  className="text-blue-600 text-sm"
                >
                  View Order
                </Link>
              </div>
              <div className="mt-3">
                <div className="flex items-center">
                  <ShoppingBag size={20} className="mr-2 text-blue-600" />
                  <span className="text-gray-800 dark:text-white">
                    {order.orderNumber}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
