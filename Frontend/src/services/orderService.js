import api from '../api/axios';

const orderService = {
  createOrder: async (orderData) => {
    const { data } = await api.post('/orders', orderData);
    return data.data;
  },

  getMyOrders: async () => {
    const { data } = await api.get('/orders/myorders');
    return data.data;
  },

  getOrderById: async (id) => {
    const { data } = await api.get(`/orders/${id}`);
    return data.data;
  },

  cancelOrder: async (id) => {
    const { data } = await api.put(`/orders/${id}/cancel`);
    return data.data;
  },

  updateOrderStatus: async (id, status) => {
    const { data } = await api.put(`/orders/${id}/status`, { status });
    return data.data;
  },

  getAllOrders: async (params = {}) => {
    const { data } = await api.get('/orders', { params });
    return data;
  },

  getOrderStats: async () => {
    const { data } = await api.get('/orders/stats');
    return data.data;
  }
};

export default orderService;