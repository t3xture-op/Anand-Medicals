import Notification from '../models/Notification.js';

export async function getAllNotifications(req, res) {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err.message });
  }
}

export async function markNotificationAsRead(req, res) {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (err) {
    res.status(500).json({ message: 'Error updating notification', error: err.message });
  }
}

export async function markAllNotificationsAsRead(req, res) {
  try {
    await Notification.updateMany({ isRead: false }, { $set: { isRead: true } });
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Error marking all as read', error: err.message });
  }
}

export async function clearAllNotifications(req, res) {
  try {
    await Notification.deleteMany();
    res.status(200).json({ message: 'All notifications cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Error clearing notifications', error: err.message });
  }
}
