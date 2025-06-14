import React, { useEffect, useRef, useState } from 'react';
import { Pencil, Trash2, MapPin, Package, Lock, User, Plus, CheckCircle } from 'lucide-react';

const MyAccount = () => {
  const [user, setUser] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [profilePic, setProfilePic] = useState('');
  const [preview, setPreview] = useState(null);
  const [password, setPassword] = useState({ old: '', new: '', confirm: '' });

  const sections = {
    profile: useRef(null),
    orders: useRef(null),
    addresses: useRef(null),
    password: useRef(null),
  };

  useEffect(() => {
    // Load user data
    fetch('http://localhost:5000/api/user/get/:id', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setProfilePic(data.profilePic || '');
      });

    // Load user orders
    fetch('http://localhost:5000/api/orders/my')
      .then(res => res.json())
      .then(data => setOrders(data));

    // Load addresses
    fetch('http://localhost:5000/api/address', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setAddresses(data));
  }, []);

  const scrollTo = (section) => {
    sections[section].current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUpdateProfile = async () => {
    const res = await fetch('http://localhost:5000/api/user/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    const data = await res.json();
    alert(data.message || 'Profile updated');
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('http://localhost:5000/api/user/profile-photo', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (res.ok) setProfilePic(data.url);
  };

  const handlePhotoDelete = async () => {
    await fetch('http://localhost:5000/api/user/profile-photo', { method: 'DELETE' });
    setProfilePic('');
  };

  const handleAddAddress = async () => {
    const street = prompt('Enter new address');
    if (!street) return;
    const res = await fetch('http://localhost:5000/api/address/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ street }),
    });
    const data = await res.json();
    setAddresses(prev => [...prev, data]);
  };

  const handleSetDefault = async (id) => {
    await fetch(`http://localhost:5000/api/address/edit-default/${id}`, { method: 'PUT' });
    const updated = await fetch('http://localhost:5000/api/address').then(res => res.json());
    setAddresses(updated);
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    await fetch(`http://localhost:5000/api/address/delete/${id}`, { method: 'DELETE' });
    const updated = await fetch('http://localhost:5000/api/address').then(res => res.json());
    setAddresses(updated);
  };

  const handlePasswordChange = async () => {
    if (password.new !== password.confirm) return alert('Passwords do not match');
    const res = await fetch('http://localhost:5000/api/user/change-password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(password),
    });
    const data = await res.json();
    if (res.ok) alert('Password updated');
    else alert(data.message || 'Failed to update password');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 space-y-6 shadow-sm">
        <button className="w-full text-left" onClick={() => scrollTo('profile')}>
          👤 My Profile
        </button>
        <button className="w-full text-left" onClick={() => scrollTo('orders')}>
          📦 My Orders
        </button>
        <button className="w-full text-left" onClick={() => scrollTo('addresses')}>
          📍 My Addresses
        </button>
        <button className="w-full text-left" onClick={() => scrollTo('password')}>
          🔒 Change Password
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10 space-y-16">
        {/* Profile Section */}
        <section ref={sections.profile} className="bg-white p-6 rounded shadow space-y-4">
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={profilePic || '/placeholder-avatar.png'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border"
              />
              <label className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow cursor-pointer">
                <Pencil size={16} />
                <input type="file" hidden onChange={handlePhotoUpload} />
              </label>
              {profilePic && (
                <button
                  className="absolute top-1 right-1 bg-white p-1 rounded-full shadow text-red-500"
                  onClick={handlePhotoDelete}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <div className="mt-6 w-full max-w-md space-y-4">
              <input
                className="input"
                placeholder="Name"
                value={user.name || ''}
                onChange={e => setUser({ ...user, name: e.target.value })}
              />
              <input
                className="input"
                placeholder="Email"
                value={user.email || ''}
                onChange={e => setUser({ ...user, email: e.target.value })}
              />
              <input
                className="input"
                placeholder="Phone"
                value={user.phone || ''}
                onChange={e => setUser({ ...user, phone: e.target.value })}
              />
              <input
                className="input"
                placeholder="Gender"
                value={user.gender || ''}
                onChange={e => setUser({ ...user, gender: e.target.value })}
              />
              <input
                type="date"
                className="input"
                value={user.dob || ''}
                onChange={e => setUser({ ...user, dob: e.target.value })}
              />
              <button className="btn btn-primary w-full" onClick={handleUpdateProfile}>
                Save Changes
              </button>
            </div>
          </div>
        </section>

        {/* Orders Section */}
        <section ref={sections.orders} className="bg-white p-6 rounded shadow space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Package size={20} /> My Orders
          </h2>
          {orders.map(order => (
            <div key={order._id} className="border p-3 rounded flex justify-between items-center">
              <div>
                <div className="font-medium">Order ID: {order._id}</div>
                <div className="text-sm text-gray-500">Total: ₹{order.totalAmount}</div>
              </div>
              <div className="text-sm text-blue-600">{order.status}</div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-gray-500">No orders found.</p>}
        </section>

        {/* Address Section */}
        <section ref={sections.addresses} className="bg-white p-6 rounded shadow space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MapPin size={20} /> My Addresses
          </h2>
          <button onClick={handleAddAddress} className="btn btn-sm btn-outline flex items-center gap-1">
            <Plus size={16} /> Add Address
          </button>
          {addresses.map(addr => (
            <div key={addr._id} className="flex justify-between items-center border p-2 rounded">
              <div>{addr.street}</div>
              <div className="flex gap-2">
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr._id)} className="text-blue-600 text-sm">
                    Set Default
                  </button>
                )}
                <button onClick={() => handleDeleteAddress(addr._id)} className="text-red-600 text-sm">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Password Section */}
        <section ref={sections.password} className="bg-white p-6 rounded shadow space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Lock size={20} /> Change Password
          </h2>
          <div className="w-full max-w-md space-y-4">
            <input
              className="input"
              placeholder="Old Password"
              type="password"
              value={password.old}
              onChange={e => setPassword({ ...password, old: e.target.value })}
            />
            <input
              className="input"
              placeholder="New Password"
              type="password"
              value={password.new}
              onChange={e => setPassword({ ...password, new: e.target.value })}
            />
            <input
              className="input"
              placeholder="Confirm New Password"
              type="password"
              value={password.confirm}
              onChange={e => setPassword({ ...password, confirm: e.target.value })}
            />
            <button className="btn btn-primary w-full" onClick={handlePasswordChange}>
              Update Password
            </button>
            <a href="/forgot-password" className="text-sm text-blue-500 underline">
              Forgot password?
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MyAccount;
