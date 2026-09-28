import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 🔐 Request interceptor: har request me token attach karo
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('bazario_user') || 'null');
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Response interceptor: 401 pe smart handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    // ⭐ Login/Register requests ke liye kuch mat karo
    // Frontend khud error handle karega (Login.jsx me catch block)
    const isAuthRequest =
      url.includes('/auth/login') ||
      url.includes('/auth/register');

    if (status === 401 && !isAuthRequest) {
      // 🎯 Sirf tab logout karo jab token expire ho gaya
      // (Login attempt nahi, baaki API calls)
      console.warn('🔐 Token invalid/expired — logging out');

      localStorage.removeItem('bazario_user');

      // Home page pe bhejo (reload nahi, warna loop ban jayega)
      // Agar tum Router use karte ho toh navigate('/login') karo
      if (window.location.pathname !== '/login') {
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);

export default api;