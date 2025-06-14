import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        const shuffled = data.sort(() => 0.5 - Math.random());
        setProducts(shuffled.slice(0, 8));
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    const fetchOffers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/offer/active");
        const data = await res.json();
        setOffers(data);
      } catch (err) {
        console.error("Failed to fetch offers:", err);
      }
    };

    const fetchSubCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/subcategory");
        const data = await res.json();
        setSubCategories(data);
      } catch (err) {
        console.error("Failed to fetch subcategories:", err);
      }
    };

    const fetchBanners = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/banner");
        const data = await res.json();
        setBanners(data);
      } catch (err) {
        console.error("Failed to fetch banners:", err);
      }
    };

    fetchProducts();
    fetchOffers();
    fetchSubCategories();
    fetchBanners();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && banners.length > 0) {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, banners]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <>
      {/* Subcategories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Browse by Health Conditions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {subCategories.map((condition) => (
            <Link
              key={condition._id}
              to={`/subcategory/${condition._id}`}
              className="bg-white rounded-lg p-4 flex items-center space-x-3 hover:shadow-md transition-shadow border border-gray-100"
            >
              <span className="text-2xl">{condition.emoji}</span>
              <span className="text-gray-900">{condition.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Offers */}
      {offers.length > 0 && (
        <div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="font-bold text-gray-900 text-2xl pb-4">
            Offers & Discounts
          </h1>
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="space-y-6">
              {offers.map((offer) => (
                <div
                  key={offer._id}
                  className="bg-white border rounded-lg shadow-sm p-6 mb-8"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {offer.offerName}
                    </h2>
                    <span className="inline-block bg-red-100 text-red-600 text-sm font-semibold px-3 py-1 rounded">
                      {offer.discount}% OFF
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {offer.products.map((productId) => (
                      <div
                        key={productId}
                        className="border rounded-lg p-3 shadow-sm hover:shadow-md transition"
                      >
                        <img
                          src={productId.image}
                          alt={productId.name}
                          className="w-full h-32 object-cover rounded mb-2"
                        />
                        <h4 className="text-sm font-medium text-gray-800">
                          {productId.name}
                        </h4>
                      </div>
                    ))}
                  </div>

                  <p className="text-gray-600 text-sm mb-2">
                    {offer.description}
                  </p>
                  <p className="text-gray-500 text-xs italic">
                    Ends on {new Date(offer.endDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Carousel (dynamic banners) */}
      {banners.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="overflow-hidden rounded-lg">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  width: `${banners.length * 100}%`,
                  transform: `translateX(-${
                    currentSlide * (100 / banners.length)
                  }%)`,
                }}
              >
                {banners.map((item, idx) => {
                  const content = (
                    <div
                      key={item._id}
                      className="w-full flex-shrink-0"
                      style={{ width: `${100 / banners.length}%` }}
                    >
                      <div className="relative h-64 md:h-96">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                          <div className="text-white">
                            <h3 className="text-2xl font-bold mb-2">
                              {item.name}
                            </h3>
                            <p>{item.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                  return item.link ? (
                    <a
                      href={item.link}
                      key={item._id}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      {content}
                    </a>
                  ) : (
                    content
                  );
                })}
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

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-105 overflow-hidden"
            >
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4">
                <Link to={`/product/${product._id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {product.manufacturer}
                  </p>
                </Link>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-green-700 font-bold text-lg">
                    ₹{product.discount_price}
                  </span>
                  <span className="text-gray-500 line-through text-lg">
                    ₹{product.price}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-sm text-red-500 font-semibold">
                      {product.discount}% off
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {product.stock} in stock
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
