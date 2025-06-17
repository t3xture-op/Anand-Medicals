import { useState } from 'react';
import { Star } from 'lucide-react'; // Import the Star icon

const FeedbackForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        rating: 0 // Add rating to formData
    });
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRatingClick = (selectedRating) => {
        setFormData({
            ...formData,
            rating: selectedRating
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Basic validation for rating
        if (formData.rating === 0) {
            setStatus({ type: 'error', message: 'Please select a star rating.' });
            return;
        }
        setStatus({ type: 'loading', message: 'Submitting feedback...' });

        try {
            const response = await fetch('http://localhost:5000/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to submit feedback');
            }

            const data = await response.json();
            setStatus({
                type: 'success',
                message: data.message || 'Thank you for your feedback!'
            });
            setFormData({ name: '', email: '', message: '', rating: 0 }); // Reset form including rating
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setStatus({
                type: 'error',
                message: error.message || 'Failed to submit feedback. Please try again.'
            });
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Send Feedback</h2>
            
            {status.message && (
                <div className={`mb-4 p-3 rounded ${
                    status.type === 'success' ? 'bg-green-100 text-green-700' :
                    status.type === 'error' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                }`}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Rating
                    </label>
                    <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-8 h-8 cursor-pointer ${
                                    star <= formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                                onClick={() => handleRatingClick(star)}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={status.type === 'loading'}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {status.type === 'loading' ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </form>
        </div>
    );
};

export default FeedbackForm; 