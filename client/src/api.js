import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true,
});

// Request interceptor to add JWT token and route to correct microservice
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Route to correct microservice based on URL path
    if (config.url.startsWith('/traveler')) {
      config.baseURL = 'http://localhost:4001/api';
    } else if (config.url.startsWith('/owner')) {
      config.baseURL = 'http://localhost:4003/api';
    } else if (config.url.startsWith('/properties')) {
      config.baseURL = 'http://localhost:4002/api';
    } else if (config.url.startsWith('/bookings') || config.url.startsWith('/favorites')) {
      config.baseURL = 'http://localhost:4001/api';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/auth') {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

