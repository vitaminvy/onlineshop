import React, { useState } from 'react';

// Mock updateProfileApi for UI testing without backend
const updateProfileApi = async (data: unknown) => {
  console.log('Mock updateProfileApi called with:', data);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, user: data };
};

const Profile: React.FC = () => {
  // Input: User's current profile data (could be fetched from an API or state)
  const [avatar, setAvatar] = useState<string | ArrayBuffer | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Process: Handle avatar file selection and form input changes
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Output: Updated profile data ready to be sent to backend or state management
    const updatedProfile = {
      avatar,
      name,
      phone,
      address,
    };
    try {
      const result = await updateProfileApi(updatedProfile);
      console.log('Update result:', result);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Update failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Update Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
            {avatar ? (
              <img
                src={avatar as string}
                alt="Avatar Preview"
                className="w-24 h-24 object-cover rounded-full border-2 border-gray-200 mb-2"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full mb-2 flex items-center justify-center text-gray-400 text-3xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 7v-6m0 0l9-5-9-5-9 5 9 5z" /></svg>
              </div>
            )}
            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
              className="mt-2 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
              "
            />
          </div>

          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              placeholder="Your name"
            />
          </div>

          {/* Phone Input */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              placeholder="Your phone number"
            />
          </div>

          {/* Address Input */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={e => setAddress(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              placeholder="Your address"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
