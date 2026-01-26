import api from './api';

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const addUser = async (userData: any) => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const deleteUser = async (id: string) => {
  return api.delete(`/users/${id}`);
};

export const getRevenueData = async () => {
    // Placeholder: Fetch real data from finance module if available aggregated
    // or fetch invoices and calculate on frontend
    const response = await api.get('/finance/invoices');
    return response.data;
};
