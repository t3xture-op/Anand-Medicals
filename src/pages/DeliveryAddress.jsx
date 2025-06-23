import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { toast } from "sonner";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function DeliveryAddress() {
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    latitude: undefined,
    longitude: undefined,
  });

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationShared, setLocationShared] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/address`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setAddresses(data.addresses || []);
        const defaultAddr = data.addresses?.find((addr) => addr.isDefault);
        if (defaultAddr) setSelectedAddressId(defaultAddr._id);
      } else {
        console.error("Fetch error:", data.message);
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationShare = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setAddress((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setLocationShared(true);
        setLoading(false);
      },
      (error) => {
        toast.error("Location error: " + error.message);
        setLoading(false);
      }
    );
  };

  const setDefaultAddress = async (id) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/address/edit-default/${id}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) toast.error(data.message || "Default update failed");
      setAddresses((prev) =>
        prev.map((addr) => ({ ...addr, isDefault: addr._id === id }))
      );
      setSelectedAddressId(id);
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/address/add`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(address),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Address added");
      setShowForm(false);
      await fetchAddresses();
      setSelectedAddressId(data.address._id);
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleProceed = () => {
    if (!selectedAddressId) {
      toast.warning("Please select or add an address.");
      return;
    }
    navigate("/cart/payment", { state: { addressId: selectedAddressId } });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Delivery Address
          </h1>

          {addresses.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Saved Addresses</h2>
              <ul className="space-y-4">
                {addresses.map((addr) => (
                  <li
                    key={addr._id}
                    className={`border p-4 rounded-md cursor-pointer ${
                      selectedAddressId === addr._id
                        ? "border-green-600 bg-green-50"
                        : ""
                    }`}
                    onClick={() => setSelectedAddressId(addr._id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {addr.fullName}, {addr.phoneNumber}
                        </p>
                        <p>
                          {addr.addressLine1}, {addr.addressLine2}
                        </p>
                        <p>
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                      </div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          checked={addr.isDefault}
                          onChange={() => setDefaultAddress(addr._id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="ml-2 text-sm">Default</span>
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mb-6 px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              + Add New Address
            </button>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Full Name"
                  name="fullName"
                  value={address.fullName}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Phone Number"
                  name="phoneNumber"
                  value={address.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              <InputField
                label="Address Line 1"
                name="addressLine1"
                value={address.addressLine1}
                onChange={handleInputChange}
              />
              <InputField
                label="Address Line 2"
                name="addressLine2"
                value={address.addressLine2}
                onChange={handleInputChange}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField
                  label="City"
                  name="city"
                  value={address.city}
                  onChange={handleInputChange}
                />
                <InputField
                  label="State"
                  name="state"
                  value={address.state}
                  onChange={handleInputChange}
                />
                <InputField
                  label="PIN Code"
                  name="pincode"
                  value={address.pincode}
                  onChange={handleInputChange}
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-md space-y-4">
                {/* Share Current Location button - compact width */}
                <button
                  type="button"
                  onClick={handleLocationShare}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <MapPin className="w-5 h-5 mr-2 text-green-600" />
                  {loading ? "Getting Location..." : "Share Location"}
                </button>
                {locationShared && (
                  <p className="text-sm text-green-600">Location shared!</p>
                )}
              </div>

              {/* Save/Continue button */}
              <div className="flex justify-start mt-4">
                <button
                  type="submit"
                  className="px-6 py-2  rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold transition"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => navigate("/cart")}
              className="px-4 py-2 border border-gray-300 rounded text-sm"
            >
              Back to Cart
            </button>
            <button
              onClick={handleProceed}
              className="px-4 py-2 bg-green-600 text-white rounded text-sm"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        required={name !== "addressLine2"}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
      />
    </div>
  );
}
