import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAuthError = (err) => {
    const errorMessage = err.message || ""; // Ensure err.message is a string
    if (
      errorMessage === "Unauthorized" ||
      errorMessage.includes("jwt expired")
    ) {
      toast.error("Session expired. Please log in again.");
      logout();
      navigate("/login");
    } else {
      toast.error(errorMessage);
    }
  };

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/feedback", {
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unauthorized" }));
        throw new Error(errorData.message || "Failed to fetch feedbacks");
      }
      const data = await response.json();
      setFeedbacks(data.data);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      setError(err.message);
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/feedback/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ approved: status }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unauthorized" }));
        throw new Error(
          errorData.message || "Failed to update feedback status"
        );
      }

      toast.success(
        `Feedback ${status ? "approved" : "declined"} successfully!`
      );
      fetchFeedbacks();
    } catch (err) {
      console.error("Error updating feedback status:", err);
      handleAuthError(err);
      toast.error(err || "Something went wrong");
    }
  };

  const handleDeleteFeedback = async (id) => {
    toast("DELETE FEEDBACK", {
      description: "Are you sure you want to delete this feedback?",
      action: {
        label: "DELETE",
        onClick: async () => {
          try {
            const promise = fetch(`http://localhost:5000/api/feedback/${id}`, {
              method: "DELETE",
              credentials: "include",
            });

            await toast.promise(promise, {
              loading: "Deleting feedback...",
              success: () => {
                fetchFeedbacks();
                return "Feedback deleted successfully!";
              },
              error: (err) => {
                handleAuthError(err); // Re-use the existing error handler
                return err.message || "Failed to delete feedback";
              },
            });
          } catch (err) {
            console.error("Error deleting feedback:", err);
            toast.error(err || "Something went wrong");
          }
        },
      },
    });
  };

  if (loading)
    return <div className="text-center py-8">Loading feedbacks...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (feedbacks.length === 0)
    return (
      <div className="text-center py-8 text-gray-500">
        No feedback submitted yet.
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Feedback Management
      </h1>

      <div className="bg-white dark:bg-[#161b22] shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              {["Name", "Email", "Message", "Rating", "Date", "Status", ""].map(
                (header, index) => (
                  <th
                    key={index}
                    className="px-5 py-3 border-b-2 border-gray-200 dark:border-[#30363d] bg-gray-100 dark:bg-[#21262d] text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback) => (
              <tr key={feedback._id} className="bg-white dark:bg-[#0d1117]">
                {/* Name */}
                <td className="px-5 py-5 border-b border-gray-200 dark:border-[#30363d] text-sm">
                  <p className="text-gray-900 dark:text-white whitespace-no-wrap">
                    {feedback.name}
                  </p>
                </td>

                {/* Email */}
                <td className="px-5 py-5 border-b border-gray-200 dark:border-[#30363d] text-sm">
                  <p className="text-gray-900 dark:text-white whitespace-no-wrap">
                    {feedback.email}
                  </p>
                </td>

                {/* Message */}
                <td className="px-5 py-5 border-b border-gray-200 dark:border-[#30363d] text-sm">
                  <p className="text-gray-900 dark:text-gray-300 whitespace-normal">
                    {feedback.message}
                  </p>
                </td>

                {/* Rating */}
                <td className="px-5 py-5 border-b border-gray-200 dark:border-[#30363d] text-sm">
                  <div className="flex">
                    {(() => {
                      const rating =
                        Number.isFinite(feedback.rating) &&
                        feedback.rating >= 0 &&
                        feedback.rating <= 5
                          ? Math.round(feedback.rating)
                          : 0;
                      const filledStars = Math.max(0, Math.min(5, rating));
                      const emptyStars = 5 - filledStars;
                      return (
                        <>
                          {[...Array(filledStars)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-5 h-5 text-yellow-400 fill-current"
                            />
                          ))}
                          {[...Array(emptyStars)].map((_, i) => (
                            <Star
                              key={i + filledStars}
                              className="w-5 h-5 text-gray-300 dark:text-gray-600"
                            />
                          ))}
                        </>
                      );
                    })()}
                  </div>
                </td>

                {/* Date */}
                <td className="px-5 py-5 border-b border-gray-200 dark:border-[#30363d] text-sm">
                  <p className="text-gray-900 dark:text-gray-300 whitespace-no-wrap">
                    {format(new Date(feedback.createdAt), "PPP")}
                  </p>
                </td>

                {/* Status */}
                <td className="px-5 py-5 border-b border-gray-200 dark:border-[#30363d] text-sm">
                  <span
                    className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                      feedback.approved
                        ? "text-green-900 dark:text-green-300"
                        : "text-red-900 dark:text-red-400"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute inset-0 opacity-50 rounded-full ${
                        feedback.approved
                          ? "bg-green-200 dark:bg-green-800/30"
                          : "bg-red-200 dark:bg-red-800/30"
                      }`}
                    ></span>
                    <span className="relative">
                      {feedback.approved ? "Approved" : "Pending"}
                    </span>
                  </span>
                </td>

                {/* Actions */}
                <td className="px-5 py-5 border-b border-gray-200 dark:border-[#30363d] text-sm text-right space-x-2">
                  {!feedback.approved ? (
                    <button
                      onClick={() => handleStatusUpdate(feedback._id, true)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Approve
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusUpdate(feedback._id, false)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Decline
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteFeedback(feedback._id)}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Feedback;
