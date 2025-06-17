import Feedback from '../models/Feedback.js';

// Create new feedback
export const createFeedback = async (req, res) => {
    try {
 
        const { name, email, message, rating } = req.body;
        
        if (!name || !email || !message || !rating) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields (name, email, message, rating)'
            });
        }

        const feedback = new Feedback({
            name,
            email,
            message,
            rating
        });

        const savedFeedback = await feedback.save();

        
        return res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully',
            data: savedFeedback
        });
    } catch (error) {
        console.error('Error in createFeedback:', error);
        return res.status(500).json({
            success: false,
            message: 'Error submitting feedback',
            error: error.message
        });
    }
};

// Get all feedbacks (for admin)
export const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            data: feedbacks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching feedbacks',
            error: error.message
        });
    }
};

// Get approved feedbacks (for public user view)
export const getApprovedFeedbacks = async (req, res) => {
    try {
        const approvedFeedbacks = await Feedback.find({ approved: true }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            data: approvedFeedbacks
        });
    } catch (error) {
        console.error('Error in getApprovedFeedbacks:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching approved feedbacks',
            error: error.message
        });
    }
};

// Update feedback approval status (for admin)
export const updateFeedbackStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { approved } = req.body;

        const feedback = await Feedback.findByIdAndUpdate(
            id,
            { approved },
            { new: true }
        );

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        res.status(200).json({
            success: true,
            data: feedback
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating feedback status',
            error: error.message
        });
    }
};

// Delete feedback (for admin)
export const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;

        const feedback = await Feedback.findByIdAndDelete(id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Feedback deleted successfully',
            data: {}
        });
    } catch (error) {
        console.error('Error in deleteFeedback:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting feedback',
            error: error.message
        });
    }
}; 