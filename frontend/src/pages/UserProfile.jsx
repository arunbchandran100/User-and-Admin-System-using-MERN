import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

function UserProfile() {
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

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

    const uploadImageToCloudinary = async () => {
        if (!imageFile) return;

        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', 'user_images');

        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/dlsahcczi/image/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const imageUrl = await uploadImageToCloudinary();
        if (imageUrl) {
            // TODO: Add action to update user profile image
            console.log('Image uploaded successfully:', imageUrl);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">User Profile</h2>
                
                <div className="mb-6">
                    <h3 className="font-semibold mb-2">Profile Information</h3>
                    <p>Name: {user?.name}</p>
                    <p>Email: {user?.email}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">Profile Image</label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                            className="w-full"
                        />
                    </div>

                    {imagePreview && (
                        <div className="mb-4">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-full mx-auto"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Update Profile Image
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UserProfile;