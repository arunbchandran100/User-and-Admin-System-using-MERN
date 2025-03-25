import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { getUsers, deleteUser, adminLogout } from '../features/admin/adminSlice';

function AdminDashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { admin, users, isLoading, isError, message } = useSelector(
        (state) => state.admin
    );

    useEffect(() => {
        if (!admin) {
            navigate('/admin/login');
            return;
        }

        if (isError) {
            toast.error(message);
        }

        dispatch(getUsers());
    }, [admin, isError, message, navigate, dispatch]);

    const handleDeleteUser = (userId, userName) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete ${userName}. This action cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteUser(userId))
                    .unwrap()
                    .then(() => {
                        Swal.fire(
                            'Deleted!',
                            'User has been deleted successfully.',
                            'success'
                        );
                    })
                    .catch((error) => {
                        Swal.fire(
                            'Error!',
                            error || 'Failed to delete user.',
                            'error'
                        );
                    });
            }
        });
    };

    const handleLogout = () => {
        dispatch(adminLogout());
        navigate('/admin/login');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl text-blue-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar */}
            <nav className="bg-blue-800 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-xl font-bold">Admin Dashboard</span>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4">{admin?.email}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-grow py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h2 className="text-lg leading-6 font-medium text-gray-900">User Management</h2>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">List of all registered users</p>
                        </div>
                        <div>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created At
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.length > 0 ? (
                                        users.map((user) => (
                                            <tr key={user._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {user.profileImage ? (
                                                            <img className="h-10 w-10 rounded-full mr-3" src={user.profileImage} alt="" />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                                <span className="text-lg text-blue-600">
                                                                    {user.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {new Date(user.createdAt).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => handleDeleteUser(user._id, user.name)}
                                                        className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition-colors duration-200"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                                No users found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;