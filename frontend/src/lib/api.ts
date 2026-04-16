import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 5000,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Prevent infinite loop on refresh route or logout route
    const isAuthRoute = originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/logout');
    const isAlreadyOnLogin = window.location.pathname === '/' || window.location.pathname === '/login';

    if (error.response?.status === 401 && !isAuthRoute && !originalRequest._retry && !isAlreadyOnLogin) {
      originalRequest._retry = true;
      try {
        await api.post('/auth/refresh');
        return api(originalRequest);
      } catch (err) {
        // Refresh failed, session is truly dead
        localStorage.clear();
        window.location.href = '/'; 
        return Promise.reject(err);
      }
    }
    
    // If we're already failing on an auth route or on login, just clear and eject
    if (error.response?.status === 401 && (isAuthRoute || isAlreadyOnLogin)) {
      localStorage.clear();
    }

    return Promise.reject(error);
  }
);

export default api;
