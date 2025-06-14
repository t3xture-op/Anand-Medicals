import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BannerAdd = () => {
  const [name, setName] = useState('');
  const [description,setdescription] = useState('')
  const [link, setLink] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!name || !image) {
      alert('Please provide both banner name and image');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);
    if (link) formData.append('link', link);
    if(description) formData.append('description',description);

    try {
      const res = await fetch('http://localhost:5000/api/banner/add', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        alert('Banner added successfully');
        navigate('/banner');
      } else {
        alert(result.message || 'Failed to add banner');
      }
    } catch (err) {
      console.error('Add banner failed:', err);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center gap-2 mb-6">
        <ArrowLeft
          className="cursor-pointer text-gray-600 hover:text-gray-900"
          size={24}
          onClick={() => navigate('/banner')}
        />
        <h2 className="text-2xl font-bold">Add New Banner</h2>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Banner Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />

        <input
          type="text"
          placeholder="Banner description"
          value={description}
          onChange={(e) => setdescription(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <input
          type="text"
          placeholder="Banner Link (optional)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-600"
        />

        {preview && (
          <div className="border p-4 bg-gray-50 rounded relative">
            <h3 className="font-semibold mb-2 text-gray-700">Preview:</h3>
            <div className="space-y-2">
              <p><strong>Name:</strong> {name}</p>
              <p><strong>Description:</strong> {description}</p>
              {link && (
                <p>
                  <strong>Link:</strong>{' '}
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {link}
                  </a>
                </p>
              )}
              <img
                src={preview}
                alt="Preview"
                className="h-48 object-contain rounded border"
              />
            </div>
            </div>
            
        )}
         <div className="mt-4 flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"
              >
                Submit Banner
              </button>
            </div>
      </div>
    </div>
  );
};

export default BannerAdd;
