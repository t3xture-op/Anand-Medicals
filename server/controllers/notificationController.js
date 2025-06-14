import Notification from "../models/Notification.js";
import { notificationEmitter } from "../routes/notification.js";
import Product from '../models/Product.js';

// GET all notifications

export async function getAllNotifications(req, res) {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });

    // Populate targetId manually for stock notifications
    const populated = await Promise.all(
      notifications.map(async (n) => {
        if (n.type === 'stock') {
          const product = await Product.findById(n.targetId).select('name stock image manufacturer');
          return {
            ...n.toObject(),
            product,
          };
        }
        return n.toObject();
      })
    );

    res.status(200).json(populated);
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching notifications',
      error: err.message,
    });
  }
}
// POST new notification and trigger SSE
export async function createNotification(req, res) {
  try {
    const { title, message, type, targetId } = req.body;

    const newNotification = new Notification({
      title,
      message,
      type,
      targetId,
      isRead: false,
    });
    const savedNotification = await newNotification.save();
    notificationEmitter.emit("newNotif", savedNotification);

    res
      .status(201)
      .json({
        message: "Notification created",
        notification: savedNotification,
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating notification", error: err.message });
  }
}

// PATCH mark one as read
export async function markNotificationAsRead(req, res) {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res
      .status(200)
      .json({ message: "Notification marked as read", notification });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating notification", error: err.message });
  }
}

// PATCH mark all as read
export async function markAllNotificationsAsRead(req, res) {
  try {
    await Notification.updateMany(
      { isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error marking all as read", error: err.message });
  }
}

// DELETE all
export async function clearAllNotifications(req, res) {
  try {
    await Notification.deleteMany();
    res.status(200).json({ message: "All notifications cleared" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error clearing notifications", error: err.message });
  }
}
