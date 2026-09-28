import api from '../api/axios';

const authService = {
  // Register
  register: async ({ name, email, password, role }) => {
    const { data } = await api.post('/auth/register', {
      name,
      email,
      password,
      role
    });
    return data.data;  // { _id, name, email, role, token }
  },

  // Login
  login: async ({ email, password }) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data.data;
  },

  // Get current user
  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data.data;
  },

  // Update profile
  updateProfile: async (updates) => {
    const { data } = await api.put('/auth/me', updates);
    return data.data;
  }
};

export default authService;