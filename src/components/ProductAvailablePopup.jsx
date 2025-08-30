import { useEffect, useState } from "react";
import { toast } from "sonner";

const ProductAvailabilityPopup = ({ API_BASE }) => {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetch(`${API_BASE}/api/user/notifications/`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        // Get the latest unread notification
        const latest = data.find(n => n.type === "product request" && !n.isRead);
        if (latest) setNotification(latest);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // every 30s
    return () => clearInterval(interval);
  }, [API_BASE]);

const handleBuyNow = () => {
  console.log(notification.targetId)
  if (notification.targetId) {
    window.location.href = `/product/${notification.targetId}`;
    handleClose(); 
  } else {

    toast.warning("The product is not yet available for purchase. Please check back later.");
    handleClose(); 
  }
};

  const handleClose = async () => {
    await fetch(`${API_BASE}/api/user/notifications/${notification._id}/read`, {
      method: "PATCH",
      credentials: "include",
    });
    setNotification(null);
  };

  if (!notification) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white  p-6 rounded-2xl shadow-lg max-w-md text-center">
        <h2 className="text-lg font-bold mb-2">{notification.title}</h2>
        <p className="mb-4">{notification.message}</p>
        <div className="flex justify-center gap-4">
          
          <button
            onClick={handleClose}
            className="bg-gray-300  text-black  px-4 py-2 rounded-lg"
          >
            Close
          </button>
          <button
            onClick={handleBuyNow}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductAvailabilityPopup;
