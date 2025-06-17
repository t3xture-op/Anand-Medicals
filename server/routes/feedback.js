import express from 'express';
import { createFeedback, getAllFeedbacks, updateFeedbackStatus, deleteFeedback, getApprovedFeedbacks } from '../controllers/feedbackController.js';
import auth from '../middlewares/auth.js'; // Import default as auth

const router = express.Router();

// Public route - Submit feedback
router.post('/', createFeedback);

// Public route - Get approved feedback
router.get('/approved', getApprovedFeedbacks);

// Protected routes - Admin only (authorize is temporarily removed until defined)
router.get('/', auth, getAllFeedbacks);
router.patch('/:id', auth, updateFeedbackStatus);
router.delete('/:id', auth, deleteFeedback);

export default router; 