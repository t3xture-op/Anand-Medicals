import React, { useState, useEffect } from "react";
import { MapPin, Edit3, Save, Plus, LocateFixed, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Address() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [newAddressMode, setNewAddressMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/address", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.addresses)) {
          setAddresses(data.addresses);
        }
      });
  }, []);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setFormData((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));
        toast.success("Location added successfully.");
      },
      () => {
        toast.warning("Unable to access location. Please allow location permission.");
        setFormData((prev) => ({
          ...prev,
          latitude: null,
          longitude: null,
        }));
      }
    );
  };

  const handleSave = async () => {
    const method = newAddressMode ? "POST" : "PUT";
    const url = newAddressMode
      ? "http://localhost:5000/api/address/add"
      : `http://localhost:5000/api/address/edit/${selectedAddressId}`;

    const sanitizedFormData = {
      ...formData,
      latitude: isNaN(formData.latitude) ? null : formData.latitude,
      longitude: isNaN(formData.longitude) ? null : formData.longitude,
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(sanitizedFormData),
    });

    const data = await res.json();
    if (res.ok && Array.isArray(data.addresses)) {
      setSelectedAddressId(null);
      setNewAddressMode(false);
      setFormData({
        fullName: "",
        phoneNumber: "",
        addressLine1: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        latitude: null,
        longitude: null,
      });
      setAddresses(data.addresses);
      toast.success("Address Added")
    } else {
      toast.error(data.message || "Save failed.");
    }
  };

  const handleEditClick = (addr) => {
    if (selectedAddressId === addr._id) {
      setSelectedAddressId(null);
    } else {
      setSelectedAddressId(addr._id);
      setNewAddressMode(false);
      setFormData({
        fullName: addr.fullName || "",
        phoneNumber: addr.phoneNumber || "",
        addressLine1: addr.addressLine1 || "",
        city: addr.city || "",
        state: addr.state || "",
        pincode: addr.pincode || "",
        country: addr.country || "India",
        latitude: addr.coordinates?.lat || null,
        longitude: addr.coordinates?.lng || null,
      });
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/address/edit-default/${id}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        const updated = await fetch("http://localhost:5000/api/address", {
          credentials: "include",
        });
        const newData = await updated.json();
        if (Array.isArray(newData.addresses)) {
          setAddresses(newData.addresses);
        }
      } else {
        toast.error("Failed to set default address");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this address?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/address/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.addresses)) {
        setAddresses(data.addresses);
        toast.success("Address deleted successfully.");
      } else {
        toast.error(data.message || "Failed to delete address");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleAddNew = () => {
    setSelectedAddressId(null);
    setNewAddressMode(true);
    setFormData({
      fullName: "",
      phoneNumber: "",
      addressLine1: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      latitude: null,
      longitude: null,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <MapPin className="text-green-600" size={24} />
            <h2 className="text-2xl font-semibold text-gray-800">
              Address Information
            </h2>
          </div>
          <button
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            onClick={handleAddNew}
          >
            <Plus size={16} />
            Add Address
          </button>
        </div>

        {newAddressMode && (
          <div className="border border-dashed border-green-400 rounded-lg p-4 mb-6">
            <AddressForm
              formData={formData}
              onChange={handleFieldChange}
              onSave={handleSave}
              getLocation={getLocation}
            />
          </div>
        )}

        <div className="space-y-6">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className="border border-gray-300 rounded-lg p-4 space-y-2"
            >
              <div className="flex justify-between items-center">
                <div
                  className="cursor-pointer"
                  onClick={() => handleEditClick(addr)}
                >
                  <p className="font-semibold">{addr.fullName}</p>
                  <p>
                    {addr.addressLine1}, {addr.city}, {addr.state} -{" "}
                    {addr.pincode}
                  </p>
                  <p>{addr.country || "India"}</p>
                  <p>📞 {addr.phoneNumber}</p>
                </div>
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="default"
                      checked={addr.isDefault}
                      onChange={() => handleSetDefault(addr._id)}
                    />
                    <span className="ml-2">Default</span>
                  </label>
                  <button
                    onClick={() => handleDelete(addr._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {selectedAddressId === addr._id && (
                <AddressForm
                  formData={formData}
                  onChange={handleFieldChange}
                  onSave={handleSave}
                  getLocation={getLocation}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AddressForm({ formData, onChange, onSave, getLocation }) {
  return (
    <div className="space-y-4 mt-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => onChange("phoneNumber", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Street Address
        </label>
        <input
          type="text"
          value={formData.addressLine1}
          onChange={(e) => onChange("addressLine1", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => onChange("city", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => onChange("state", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PIN Code
          </label>
          <input
            type="text"
            value={formData.pincode}
            onChange={(e) => onChange("pincode", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Country
        </label>
        <select
          value={formData.country}
          onChange={(e) => onChange("country", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
        >
          <option value="India">India</option>
          <option value="USA">United States</option>
          <option value="UK">United Kingdom</option>
          <option value="Canada">Canada</option>
          <option value="Australia">Australia</option>
        </select>
      </div>

      <div>
        <button
          type="button"
          onClick={getLocation}
          className="flex items-center gap-2 text-sm text-blue-600 mt-1 px-3 py-2 border border-blue-600 rounded hover:bg-blue-50"
        >
          <LocateFixed size={16} />
          Use My Current Location
        </button>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onSave}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </div>
  );
}
