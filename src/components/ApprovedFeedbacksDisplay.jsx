import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const ApprovedFeedbacksDisplay = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApprovedFeedbacks = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE}/api/feedback/approved`);
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Failed to fetch approved feedbacks');
                }
                const data = await response.json();
                setFeedbacks(data.data);
            } catch (err) {
                console.error('Error fetching approved feedbacks:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApprovedFeedbacks();
    }, []);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % feedbacks.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + feedbacks.length) % feedbacks.length);
    };

    if (loading) return <div className="text-center py-8">Loading approved feedbacks...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    if (feedbacks.length === 0) return <div className="text-center py-8 text-gray-500">No approved feedback to display yet.</div>;

    const currentFeedback = feedbacks[currentIndex];

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">What Our Users Say</h2>
            
            <div className="mb-4">
                <p className="text-lg text-gray-700 italic mb-3">"{currentFeedback.message}"</p>
                <div className="flex justify-center mb-2">
                    {[...Array(currentFeedback.rating)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 text-yellow-400 fill-current mx-0.5" />
                    ))}
                    {[...Array(5 - currentFeedback.rating)].map((_, i) => (
                        <Star key={i + currentFeedback.rating} className="w-6 h-6 text-gray-300 mx-0.5" />
                    ))}
                </div>
                <p className="text-md font-semibold text-gray-800">- {currentFeedback.name}</p>
            </div>

            <div className="flex justify-between mt-6">
                <button
                    onClick={handlePrev}
                    disabled={feedbacks.length <= 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={feedbacks.length <= 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ApprovedFeedbacksDisplay; 