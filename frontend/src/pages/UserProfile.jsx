import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function UserProfile() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(user?.profileImage || null);
    const [name, setName] = useState(user?.name || '');
    const [isEditing, setIsEditing] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Using the same constants as in the OLX clone project
    const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dxbn6tmy7/image/upload";
    const UPLOAD_PRESET = "olx-clone";

    const uploadImageToCloudinary = async () => {
        if (!imageFile) return user?.profileImage || null;

        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", UPLOAD_PRESET);
        formData.append("cloud_name", "dxbn6tmy7");

        try {
            console.log("Uploading to Cloudinary...");
            const response = await fetch(CLOUDINARY_URL, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (!data.secure_url) {
                toast.error("Image upload failed. Please try again.");
                return user?.profileImage || null;
            }

            console.log('Cloudinary upload successful:', data);
            return data.secure_url;
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            toast.error("Failed to upload image.");
            return user?.profileImage || null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const imageUrl = await uploadImageToCloudinary();
            
            // Create updated user data
            const updatedUserData = {
                userId: user._id,
                name: name,
                profileImage: imageUrl
            };
            
            // Send the updated data to your backend
            const token = user.token;
            const response = await fetch('http://localhost:5000/api/users/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedUserData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }
            
            const data = await response.json();
            
            // Update local storage with new user data
            const updatedUser = { ...user, name: name, profileImage: imageUrl };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            // TODO: Update Redux state with new user data
            // dispatch(updateUserInState(updatedUser));
            
            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Failed to update profile');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-blue-700 p-4 text-white">
                    <h2 className="text-2xl font-bold text-center">User Profile</h2>
                </div>
                
                <div className="p-6">
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative mb-4">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Profile"
                                    className="w-32 h-32 object-cover rounded-full border-4 border-blue-500"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center border-4 border-blue-500">
                                    <span className="text-4xl text-gray-600">
                                        {user?.name?.charAt(0)?.toUpperCase() || '?'}
                                    </span>
                                </div>
                            )}
                            
                            {isEditing && (
                                <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                    </svg>
                                    <input
                                        id="profile-image"
                                        type="file"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                        
                        <h3 className="text-xl font-semibold">{user?.name}</h3>
                        <p className="text-gray-600">{user?.email}</p>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            
                            <div className="flex space-x-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setName(user?.name || '');
                                        setImagePreview(user?.profileImage || null);
                                        setImageFile(null);
                                    }}
                                    className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="border-t border-gray-200 pt-4">
                                <h4 className="font-medium text-gray-700 mb-2">Account Information</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-gray-600">Name:</div>
                                    <div>{user?.name}</div>
                                    <div className="text-gray-600">Email:</div>
                                    <div>{user?.email}</div>
                                </div>
                            </div>
                            
                            <button
                                onClick={() => setIsEditing(true)}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                            >
                                Edit Profile
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserProfile;