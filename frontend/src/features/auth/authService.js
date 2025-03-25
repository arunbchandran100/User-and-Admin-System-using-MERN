import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

const signup = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/signup`, userData);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Network error or server is not responding');
    }
};

const login = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, userData);
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Network error or server is not responding');
    }
};

export default { signup, login };