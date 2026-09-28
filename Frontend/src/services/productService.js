import api from '../api/axios';

const productService = {
  // Public methods
  getProducts: async (params = {}) => {
    const { data } = await api.get('/products', { params });
    return data;
  },

  getProductById: async (id) => {
    const { data } = await api.get(`/products/${id}`);
    return data.data;
  },

  getCategories: async () => {
    const { data } = await api.get('/products/categories');
    return data.data;
  },

  getRelatedProducts: async (id) => {
    const { data } = await api.get(`/products/${id}/related`);
    return data.data;
  },

  // 🔐 Admin methods
  createProduct: async (productData) => {
    const { data } = await api.post('/products', productData);
    return data.data;
  },

  updateProduct: async (id, productData) => {
    const { data } = await api.put(`/products/${id}`, productData);
    return data.data;
  },

  deleteProduct: async (id) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },
};

export default productService;