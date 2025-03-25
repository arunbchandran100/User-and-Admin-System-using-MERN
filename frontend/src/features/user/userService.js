// User service for API calls related to user profile management

const API_URL = 'http://localhost:5000/api/users';

// Update user profile
const updateProfile = async (userData, token) => {
    console.log('Updating profile with data:', userData);
    
    const response = await fetch(`${API_URL}/update-profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
    }

    const data = await response.json();
    console.log('Response from server:', data);

    // Update user in localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('Current user in localStorage:', user);
    
    const updatedUser = {
        ...user,
        name: userData.name,
        profileImage: userData.profileImage
    };
    console.log('Updated user object:', updatedUser);
    
    localStorage.setItem('user', JSON.stringify(updatedUser));

    return updatedUser;
};

const userService = {
    updateProfile
};

export default userService;