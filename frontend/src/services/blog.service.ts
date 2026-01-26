import api from './api';

export const getBlogPosts = async () => {
  const response = await api.get('/blog');
  return response.data;
};

export const getBlogPost = async (id: string) => {
  const response = await api.get(`/blog/${id}`);
  return response.data;
};

export const createBlogPost = async (formData: FormData) => {
  const response = await api.post('/blog', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteBlogPost = async (id: string) => {
    return api.delete(`/blog/${id}`);
};
