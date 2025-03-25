const API_URL = 'http://localhost:5000/api/admin';

// Admin login
// Update the login function with better error handling
const login = async (credentials) => {
    console.log('Attempting admin login with:', credentials);
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('Admin login failed:', data);
            throw new Error(data.message || 'Failed to login');
        }

        console.log('Admin login successful:', data);
        localStorage.setItem('admin', JSON.stringify(data));
        return data;
    } catch (error) {
        console.error('Admin login error:', error);
        throw error;
    }
};

// Admin logout
const logout = () => {
    localStorage.removeItem('admin');
};

// Get all users
const getUsers = async (token) => {
    const response = await fetch(`${API_URL}/users`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get users');
    }

    return await response.json();
};

// Delete user
const deleteUser = async (userId, token) => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
    }

    return await response.json();
};

const adminService = {
    login,
    logout,
    getUsers,
    deleteUser
};

export default adminService;