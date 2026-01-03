import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api', // This will be proxied by Vite to the NestJS backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
