import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleProfileClick = () => {
        navigate('/profile');
    };

    return (
        <nav className="bg-blue-800 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl font-bold">User Management</h1>
                    </div>
                    {user && (
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleProfileClick}
                                className="flex items-center space-x-2 hover:bg-blue-700 px-3 py-2 rounded-md"
                            >
                                <span className="text-lg">👤</span>
                                <span>{user.name}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;