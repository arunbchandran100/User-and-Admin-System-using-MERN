import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users'; // Ensure this matches your backend port

const signup = async (userData) => {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
};

export default { signup };