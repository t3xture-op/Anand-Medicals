import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, ArrowRight, Stethoscope, Upload, FlaskRound as Flask, Shield } from 'lucide-react';

const healthConditions = [
  {
    id: 'diabetes',
    name: 'Diabetes Care',
    icon: '🩺',
    link: '/category/diabetes'
  },
  {
    id: 'cardiac',
    name: 'Cardiac Care',
    icon: '❤️',
    link: '/category/cardiac'
  },
  {
    id: 'stomach',
    name: 'Stomach Care',
    icon: '🫁',
    link: '/category/stomach'
  },
  {
    id: 'pain',
    name: 'Pain Relief',
    icon: '💊',
    link: '/category/pain-relief'
  },
  {
    id: 'liver',
    name: 'Liver Care',
    icon: '🫀',
    link: '/category/liver'
  },
  {
    id: 'oral',
    name: 'Oral Care',
    icon: '🦷',
    link: '/category/oral'
  },
  {
    id: 'respiratory',
    name: 'Respiratory',
    icon: '🫁',
    link: '/category/respiratory'
  },
  {
    id: 'sexual',
    name: 'Sexual Health',
    icon: '💝',
    link: '/category/sexual-health'
  },
  {
    id: 'elderly',
    name: 'Elderly Care',
    icon: '👴',
    link: '/category/elderly'
  },
  {
    id: 'immunity',
    name: 'Cold & Immunity',
    icon: '🛡️',
    link: '/category/immunity'
  }
];

const quickLinks = [
  {
    id: 'pharmacy',
    title: 'Pharmacy Near Me',
    subtitle: 'FIND STORE',
    icon: <MapPin className="w-8 h-8 text-green-600" />,
    link: '/store-locator',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'upload',
    title: 'Get 20%* off on Medicines',
    subtitle: 'UPLOAD NOW',
    icon: <Upload className="w-8 h-8 text-green-600" />,
    link: '/upload-prescription',
    bgColor: 'bg-green-50'
  },
  {
    id: 'doctor',
    title: 'Doctor Appointment',
    subtitle: 'BOOK NOW',
    icon: <Stethoscope className="w-8 h-8 text-green-600" />,
    link: '/find-doctors',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'insurance',
    title: 'Health Insurance',
    subtitle: 'EXPLORE PLANS',
    icon: <Shield className="w-8 h-8 text-green-600" />,
    link: '/insurance',
    bgColor: 'bg-orange-50'
  },
  {
    id: 'labs',
    title: 'Lab Tests',
    subtitle: 'AT HOME',
    icon: <Flask className="w-8 h-8 text-green-600" />,
    link: '/lab-tests',
    bgColor: 'bg-blue-50'
  }
];

const carouselItems = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=60',
    title: 'Special Offer',
    description: 'Get 20% off on all medicines'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&auto=format&fit=crop&q=60',
    title: 'Lab Tests',
    description: 'Book lab tests at home'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&auto=format&fit=crop&q=60',
    title: 'Healthcare Products',
    description: 'Wide range of healthcare products'
  }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
      }
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <>
      {/* Health Conditions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by Health Conditions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {healthConditions.map((condition) => (
            <Link
              key={condition.id}
              to={condition.link}
              className="bg-white rounded-lg p-4 flex items-center space-x-3 hover:shadow-md transition-shadow border border-gray-100"
            >
              <span className="text-2xl">{condition.icon}</span>
              <span className="text-gray-900">{condition.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {carouselItems.map((item) => (
                <div key={item.id} className="w-full flex-shrink-0">
                  <div className="relative h-64 md:h-96">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                      <div className="text-white">
                        <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
          >
            <ArrowRight className="w-6 h-6 transform rotate-180" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
          >
            <ArrowRight className="w-6 h-6" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}