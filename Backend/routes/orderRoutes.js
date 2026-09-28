import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  updatePaymentStatus,
  getAllOrders,
  getOrderStats
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── User routes ──────────────────────
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);

// ─── Admin routes ─────────────────────
router.get('/', protect, adminOnly, getAllOrders);
router.get('/stats', protect, adminOnly, getOrderStats);

// ─── Generic routes (path params) ─────
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);
router.put('/:id/pay', protect, adminOnly, updatePaymentStatus);

export default router;