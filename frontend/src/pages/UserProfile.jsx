import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updateProfile } from '../features/user/userSlice';

function UserProfile() {
    const { user } = useSelector((state) => state.auth);
    const { isLoading } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(user?.profileImage || null);
    const [name, setName] = useState(user?.name || '');
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

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

    // Using environment variables for Cloudinary configuration with fallbacks
    const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL ;
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ;
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ;

    // Log to verify environment variables are loaded
    useEffect(() => {
        console.log("Cloudinary config loaded:", {
            url: CLOUDINARY_URL ? "✓" : "✗",
            preset: UPLOAD_PRESET ? "✓" : "✗",
            cloud: CLOUD_NAME ? "✓" : "✗"
        });
    }, []);

    const uploadImageToCloudinary = async () => {
        if (!imageFile) return user?.profileImage || null;

        setIsUploading(true);
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
        } finally {
            setIsUploading(false);
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
            
            // Dispatch the updateProfile action
            const resultAction = await dispatch(updateProfile(updatedUserData));
            
            // Check if the action was fulfilled
            if (updateProfile.fulfilled.match(resultAction)) {
                toast.success('Profile updated successfully');
                setIsEditing(false);
                
                // Directly update component state with the new values
                setName(resultAction.payload.name);
                setImagePreview(resultAction.payload.profileImage);
            }
            else {
                // If the action was rejected, the error will be handled by the slice
                // and displayed in the UI if needed
                toast.error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Failed to update profile');
        }
    };

    // Update the Save Changes button to show loading state
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
                                    disabled={isLoading || isUploading}
                                />
                            </div>
                            
                            <div className="flex space-x-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center"
                                    disabled={isLoading || isUploading}
                                >
                                    {(isLoading || isUploading) ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {isUploading ? 'Uploading...' : 'Saving...'}
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
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
                                    disabled={isLoading || isUploading}
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