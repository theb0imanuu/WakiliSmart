import api from './api';

export const login = async (username: string, pass: string) => {
  const response = await api.post('/auth/login', { username, password: pass });
  return response.data;
};

export const logout = () => {
  // Optional: Call backend to invalidate token if needed
};

export const getCurrentUser = () => {
  // Could fetch from /auth/profile if implemented
  return null;
};
