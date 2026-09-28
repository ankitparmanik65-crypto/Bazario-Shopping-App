import api from '../api/axios';

const reviewService = {
  getProductReviews: async (productId) => {
    const { data } = await api.get(`/products/${productId}/reviews`);
    return data.data;
  },

  createReview: async (productId, { rating, comment }) => {
    const { data } = await api.post(`/products/${productId}/reviews`, {
      rating,
      comment
    });
    return data.data;
  },

  deleteReview: async (reviewId) => {
    const { data } = await api.delete(`/reviews/${reviewId}`);
    return data;
  }
};

export default reviewService;