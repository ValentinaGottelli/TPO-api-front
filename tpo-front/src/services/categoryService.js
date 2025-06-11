import axios from 'axios';

// Use proxy in development, direct URL in production
const API_BASE_URL = import.meta.env.DEV ? '/api' : 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
  withCredentials: true, // Important for CORS with cookies
});

const categoryService = {
    getAllCategories: async () => {
        try {
            const response = await api.get(`/category`);
            return response.data.categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    }
};

export default categoryService; 