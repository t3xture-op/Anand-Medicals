import React, { useEffect, useState, useRef } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const [user, setUser] = useState({ name: '', email: '' });
  const [addresses, setAddresses] = useState([]);
  const [defaultAddressId, setDefaultAddressId] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const fileInputRef = useRef();

  useEffect(() => {
    // Fetch user info
    fetch('/api/user/profile', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setUser({ name: data.name, email: data.email });
        setPhotoPreview(data.profilePhoto);
      });

    // Fetch addresses
    fetch('/api/address', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setAddresses(data);
        const defaultAddr = data.find(addr => addr.isDefault);
        if (defaultAddr) setDefaultAddressId(defaultAddr._id);
      });
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);

    fetch('/api/user/upload-photo', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setPhotoPreview(data.url);
      });
  };

  const handlePhotoDelete = () => {
    fetch('/api/user/delete-photo', { method: 'DELETE', credentials: 'include' })
      .then(() => setPhotoPreview(null));
  };

  const handleSaveProfile = () => {
    fetch('/api/user/update-profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(user)
    });
  };

  const handleDefaultChange = (id) => {
    fetch(`/api/address/edit-default/${id}`, { method: 'PUT', credentials: 'include' })
      .then(() => setDefaultAddressId(id));
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    fetch('/api/user/change-password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ oldPassword, newPassword })
    })
      .then(res => {
        if (res.ok) {
          alert('Password changed successfully');
        } else {
          alert('Incorrect old password');
          window.location.reload();
        }
      });
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 p-4 border-r bg-white space-y-4 sticky top-0 h-screen">
        <button onClick={() => document.getElementById('profile').scrollIntoView()} className="block w-full text-left">Profile</button>
        <button onClick={() => document.getElementById('addresses').scrollIntoView()} className="block w-full text-left">Addresses</button>
        <button onClick={() => document.getElementById('password').scrollIntoView()} className="block w-full text-left">Change Password</button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-12">
        {/* Profile Section */}
        <section id="profile" className="space-y-4">
          <h2 className="text-xl font-semibold">Profile</h2>
          {photoPreview && <img src={photoPreview} alt="Profile" className="h-24 w-24 rounded-full" />}
          <div className="flex gap-2 items-center">
            <button onClick={() => fileInputRef.current.click()} className="btn btn-primary flex items-center"><Pencil size={16} className="mr-1" /> Upload</button>
            <button onClick={handlePhotoDelete} className="btn btn-danger flex items-center"><Trash2 size={16} className="mr-1" /> Delete</button>
            <input type="file" ref={fileInputRef} hidden onChange={handlePhotoUpload} />
          </div>
          <input type="text" value={user.name} onChange={e => setUser({ ...user, name: e.target.value })} className="input" />
          <input type="email" value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} className="input" />
          <button onClick={handleSaveProfile} className="btn btn-primary">Save Changes</button>
        </section>

        {/* Address Section */}
        <section id="addresses" className="space-y-4">
          <h2 className="text-xl font-semibold">Addresses</h2>
          {addresses.map(addr => (
            <div key={addr._id} className="border p-3 rounded-md flex justify-between">
              <div>{addr.street}, {addr.city}, {addr.state}, {addr.zip}</div>
              <button onClick={() => handleDefaultChange(addr._id)} className={`btn ${defaultAddressId === addr._id ? 'btn-secondary' : 'btn-outline'}`}>Set as Default</button>
            </div>
          ))}
          <Link to="/add-address" className="text-blue-600 hover:underline">Add New Address</Link>
        </section>

        {/* Password Section */}
        <section id="password" className="space-y-4">
          <h2 className="text-xl font-semibold">Change Password</h2>
          <input type="password" placeholder="Old Password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="input" />
          <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input" />
          <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="input" />
          <button onClick={handlePasswordChange} className="btn btn-primary">Update Password</button>
          <Link to="/forgot-password" className="text-blue-600 hover:underline">Forgot Password?</Link>
        </section>
      </div>
    </div>
  );
}
