import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://mern-ecommerce-2024-dym1.onrender.com';

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance; 