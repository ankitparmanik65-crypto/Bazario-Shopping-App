import api from '../api/axios';

const couponService = {
  // ⭐ PUBLIC: Get available coupons (no auth)
  getAvailableCoupons: async () => {
    const { data } = await api.get('/coupons/available');
    return data.data;
  },

  // User: Validate coupon
  validateCoupon: async (code, subtotal) => {
    const { data } = await api.post('/coupons/validate', {
      code,
      subtotal
    });
    return data.data;
  },

  // Admin: Get all coupons
  getAllCoupons: async () => {
    const { data } = await api.get('/coupons');
    return data.data;
  },

  // Admin: Create coupon
  createCoupon: async (couponData) => {
    const { data } = await api.post('/coupons', couponData);
    return data.data;
  },

  // Admin: Update coupon
  updateCoupon: async (id, couponData) => {
    const { data } = await api.put(`/coupons/${id}`, couponData);
    return data.data;
  },

  // Admin: Delete coupon
  deleteCoupon: async (id) => {
    const { data } = await api.delete(`/coupons/${id}`);
    return data;
  },

  // Admin: Toggle status
  toggleCouponStatus: async (id) => {
    const { data } = await api.patch(`/coupons/${id}/toggle`);
    return data.data;
  }
};

export default couponService;