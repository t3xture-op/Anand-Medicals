import React, { useEffect, useState } from 'react';

const StoreLocator = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => setError('Location access denied. Showing available stores.')
    );
  }, []);

  const stores = [
    {
      name: 'Anand Medicals - Main Branch',
      address: 'Shop No 1, Gurukrupa Apartment, Nehru Rd, Vile Parle East, Mumbai, MH 400057',
      phone: '+91 9605270081',
      lat: 19.095387,
      lng: 72.850079,
      mapsUrl: 'https://maps.app.goo.gl/izaZKuiMJSErzGfc8',
    },
    {
      name: 'Anand Medicals - Second Branch',
      address: 'Shop No 2, Shraddha Building, Nehru Rd, Vile Parle East, Mumbai, MH 400057',
      phone: '+91 9747830081',
      lat: 19.094900,
      lng: 72.850610,
      mapsUrl: 'https://maps.app.goo.gl/MqR1migf8EL7W1vRA',
    },
  ];

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Store Locator</h1>
        <p className="text-gray-700 mb-6">
          We currently operate two stores in Kottarakkara,Kollam. Use the map and links below to find and reach us easily.
        </p>

        {/* Google Map Embed */}
        <div className="mb-8">
          <iframe
            title="Anand Medicals Store Map"
            width="100%"
            height="350"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/search?q=Anand+Medicals+Vile+Parle+Mumbai&key=YOUR_GOOGLE_MAPS_API_KEY`}
          ></iframe>
        </div>

        {error && (
          <p className="text-red-600 mb-4">{error}</p>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {stores.map((store, index) => (
            <div key={index} className="border p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-green-800">{store.name}</h2>
              <p className="text-gray-700">{store.address}</p>
              <a href={`tel:${store.phone}`} className="text-blue-600 hover:underline block mt-1">
                📞 {store.phone}
              </a>
              <a
                href={store.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline block"
              >
                📍 View on Google Maps
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreLocator;