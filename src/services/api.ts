import axios from 'axios';

// Create an Axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Important for Laravel to recognize AJAX requests
  },
  withCredentials: false, // Set to false since we're using token-based auth, not cookie-based
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    // If we have a token, add it to the request headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // For debugging purposes
    console.error('API Error:', error);

    // Network errors (CORS, server down, etc.)
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Check if the API server is running and CORS is configured correctly');
      // You could show a toast notification here
    }

    const originalRequest = error.config;

    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // If you have a router instance available, you could redirect here
      window.location.href = '/auth/login';
    }

    return Promise.reject(error);
  }
);

export default api;
