import express from 'express';
import {
  getAllNotifications,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearAllNotifications
} from '../controllers/notificationController.js';
import { EventEmitter } from 'events';

const router = express.Router();
export const notificationEmitter = new EventEmitter();

// SSE endpoint
// SSE stream route — MUST come first
router.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendNotification = (notif) => {
    res.write(`data: ${JSON.stringify(notif)}\n\n`);
  };

  notificationEmitter.on('newNotif', sendNotification);

  req.on('close', () => {
    notificationEmitter.off('newNotif', sendNotification);
  });
});


// NEW: Create a notification
router.post('/', createNotification);

// Standard REST routes
router.get('/', getAllNotifications);
router.patch('/read/:id', markNotificationAsRead);
router.patch('/read-all', markAllNotificationsAsRead);
router.delete('/clear-all', clearAllNotifications);

export default router;
