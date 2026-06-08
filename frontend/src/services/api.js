import axios from 'axios';

const api = axios.create({ baseURL: '/api/v1' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('access');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authService = {
  login: (data) => api.post('/auth/login/', data),
  register: (data) => api.post('/auth/register/', data),
  profile: () => api.get('/auth/profile/'),
  logout: (refresh) => api.post('/auth/logout/', { refresh }),
};

export const taskService = {
  list: (params) => api.get('/tasks/', { params }),
  create: (data) => api.post('/tasks/', data),
  update: (id, data) => api.patch(`/tasks/${id}/`, data),
  remove: (id) => api.delete(`/tasks/${id}/`),
};

export default api;
