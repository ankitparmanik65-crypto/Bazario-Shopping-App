import express from 'express';
import {
  getAvailableCoupons,
  validateCoupon,
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus
} from '../controllers/couponController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── PUBLIC route (no auth needed) ───
router.get('/available', getAvailableCoupons);

// ─── User route ───
router.post('/validate', protect, validateCoupon);

// ─── Admin routes ───
router.get('/', protect, adminOnly, getAllCoupons);
router.get('/:id', protect, adminOnly, getCouponById);
router.post('/', protect, adminOnly, createCoupon);
router.put('/:id', protect, adminOnly, updateCoupon);
router.delete('/:id', protect, adminOnly, deleteCoupon);
router.patch('/:id/toggle', protect, adminOnly, toggleCouponStatus);

export default router;