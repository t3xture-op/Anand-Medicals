import express from 'express';
import {  getAllNotifications,  markNotificationAsRead,  markAllNotificationsAsRead,  clearAllNotifications} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', getAllNotifications);
router.patch('/read/:id', markNotificationAsRead);
router.patch('/read-all', markAllNotificationsAsRead);
router.delete('/clear-all', clearAllNotifications);

export default router;
