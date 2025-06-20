import React, { useState, useEffect } from "react";
import {
  User,
  Camera,
  Mail,
  Phone,
  Edit3,
  Trash2,
  Save,
  Shield,
  Lock,
  Smartphone,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import Address from "../components/Address";

export default function MyAccount() {
  const [profileImage, setProfileImage] = useState(null);
  const [placeholders, setPlaceholders] = useState({
    phone: false,
    dob: false,
  });
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    image: "",
  });

  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: false,
    trustedDevices: 0,
  });
  const [preview, setPreview] = useState(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // to track uploaded file
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [imageUploaded, setImageUploaded] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [refreshTrigger]);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const fetchUserData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/me", {
        credentials: "include",
      });
      const data = await res.json();

      if (data) {
        const isoDob = data.dob
          ? new Date(data.dob).toISOString().split("T")[0]
          : "";
        setUserData({
          fullName: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          image: data.image || "",
          dob: isoDob || "",
        });
        setPlaceholders({
          phone: !data.phone,
          dob: !data.dob,
        });

        setPreview(data.image || "");
        setProfileImage(data.image || "");
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      toast.error(err);
    }
  };

  const handleChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field, value) => {
    setSecuritySettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await fetch("http://localhost:5000/api/user/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: userData.fullName,
          phone: userData.phone,
          dob: userData.dob,
          email: userData.email,
        }),
      });
      triggerRefresh();
      toast.success("Profile updated successfully!");
      
    } catch (error) {
      toast.error("error updating profile", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImageUploaded(false);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSetProfilePhoto = async () => {
    if (!selectedImage) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/JPG"];
    if (!allowedTypes.includes(selectedImage.type)) {
      toast.error("Only JPG or PNG images are allowed");
      return;
    }

    if (selectedImage.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);
    try {
      const res = await fetch(
        "http://localhost:5000/api/user/upload-profile-photo",
        {
          method: "POST",
          body: formData,
          credentials: "include", // if you're using cookies for auth
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to upload");

      setProfileImage(data.imageUrl);
      setImageUploaded(true);
      toast.success("Profile photo updated!");
      triggerRefresh();
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.message);
    }
  };

  const handleDeletePhoto = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/user/delete-profile-photo",
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete image");

      setPreview(null);
      setSelectedImage(null);
      triggerRefresh();
      toast.success("Profile photo Deleted!");
    } catch (err) {
      console.log("Upload error:", err);
      toast.error(err.message);
    }
  };

  const handlePasswordChange = async () => {
    const { currentPassword, newPassword, confirmPassword } = securitySettings;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error("Please fill all password fields.");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("New password and confirmation do not match.");
    }
     if (currentPassword == confirmPassword) {
      return toast.error("New password cannot be old password.");
    }
    try {
      const res = await fetch(
        "http://localhost:5000/api/user/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            oldPassword: currentPassword,
            newPassword: newPassword,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Password update failed");

      toast.success(data.message);
      setSecuritySettings({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        twoFactorAuth: false,
        trustedDevices: 0,
      });
      triggerRefresh();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Personal Information Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 ">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <User className="text-green-600" size={24} />
            <h2 className="text-2xl font-semibold text-gray-800 ">
              Personal Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Image Section */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mt-2">
                Only JPG or PNG images under 5MB are allowed.
              </p>
              <div className="relative inline-block">
                <div className="w-32 h-32 mt-20 rounded-full overflow-hidden border-4 border-green-200 bg-green-50  flex items-center justify-center">
                  {preview || profileImage ? (
                    <img
                      src={preview || profileImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={48} className="text-green-600" />
                  )}
                </div>

                {!profileImage && (
                  <label
                    htmlFor="profile-upload"
                    className="absolute bottom-0 right-0 bg-green-600 p-2 rounded-full cursor-pointer hover:bg-green-700"
                  >
                    <Camera size={16} className="text-white" />
                    <input
                      type="file"
                      id="profile-upload"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
                <>
                  {selectedImage && !imageUploaded && (
                    <button
                      onClick={handleSetProfilePhoto}
                      className="absolute bottom-[-4rem] right-0 bg-blue-600 px-3 py-1 text-sm text-white rounded-lg hover:bg-blue-700"
                    >
                      Set as Profile Photo
                    </button>
                  )}

                  {(preview || profileImage) && (
                    <button
                      onClick={handleDeletePhoto}
                      className="absolute top-7 right-0 bg-red-600 mt-12 p-2 rounded-full text-white hover:bg-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </>
              </div>
            </div>

            {/* Personal Info Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 ">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-3 text-gray-400 "
                    size={18}
                  />
                  <input
                    type="text"
                    value={userData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 ">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-3 text-gray-400 "
                    size={18}
                  />
                  <input
                    type="email"
                    value={userData.email}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-gray-300  bg-gray-100 cursor-not-allowed rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 ">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-3 text-gray-400 "
                    size={18}
                  />
                  <input
                    type="tel"
                    value={userData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder={
                      placeholders.phone ? "Add your mobile number" : ""
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300  rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 ">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={userData.dob}
                  onChange={(e) => handleChange("dob", e.target.value)}
                  placeholder={placeholders.dob ? "Add your date of birth" : ""}
                  className="w-full px-4 py-3 border border-gray-300  rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-8 py-4">
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
      </div>


      {/* Address Information Section */}
      <Address />


      {/* Security Settings Section */}
      <div className="bg-white  rounded-lg shadow-sm border border-gray-200 ">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="text-green-600" size={24} />
            <h2 className="text-2xl font-semibold text-gray-800 ">
              Security Settings
            </h2>
          </div>

          {/* Password Settings */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800  mb-4">
              Change Password
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700  mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-3 text-gray-400 "
                    size={18}
                  />
                  <input
                    type={showCurrent ? "text" : "password"}
                    autoComplete="new-password"
                    name="current-password-unique"
                    value={securitySettings.currentPassword}
                    onChange={(e) =>
                      handleSecurityChange("currentPassword", e.target.value)
                    }
                    className="w-full pl-10 pr-12 py-3 border border-gray-300  rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-3 text-gray-400 "
                      size={18}
                    />
                    <input
                      type={showNew ? "text" : "password"}
                      value={securitySettings.newPassword}
                      onChange={(e) =>
                        handleSecurityChange("newPassword", e.target.value)
                      }
                      className="w-full pl-10 pr-12 py-3 border border-gray-300  rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-3 text-gray-400 "
                      size={18}
                    />
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={securitySettings.confirmPassword}
                      onChange={(e) =>
                        handleSecurityChange("confirmPassword", e.target.value)
                      }
                      className="w-full pl-10 pr-12 py-3 border border-gray-300  rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800  mb-4">
              Two-Factor Authentication
            </h3>
            <div className="bg-green-50 rounded-lg p-6 border border-green-200 ">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Smartphone className="text-green-600" size={20} />
                  <div>
                    <p className="font-medium text-green-800 ">
                      Two-Factor Authentication
                    </p>
                    <p className="text-sm text-green-600 ">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={securitySettings.twoFactorAuth}
                    onChange={(e) =>
                      handleSecurityChange("twoFactorAuth", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200  peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
              {securitySettings.twoFactorAuth && (
                <div className="text-sm text-green-700 ">
                  <p>✓ Two-factor authentication is enabled</p>
                  <p className="mt-1">
                    Trusted devices: {securitySettings.trustedDevices}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200  px-8 py-4">
          <div className="flex justify-end">
            <button
              onClick={handlePasswordChange}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
