import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('prompt_library_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect if checking auth or on login/signup pages
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/signup') {
        const hadToken = localStorage.getItem('prompt_library_token');
        if (hadToken && error.config.url !== '/auth/me') {
          localStorage.removeItem('prompt_library_token');
          // Dispatch custom event for auth change
          window.dispatchEvent(new Event('auth-token-expired'));
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
