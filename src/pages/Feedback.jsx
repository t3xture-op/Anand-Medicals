import React from 'react';
import FeedbackForm from '../components/FeedbackForm';

const Feedback = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900">We Value Your Feedback</h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Your feedback helps us improve our services and provide better care.
                    </p>
                </div>
                <FeedbackForm />
            </div>
        </div>
    );
};

export default Feedback;