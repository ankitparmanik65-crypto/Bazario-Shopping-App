import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changeUserRole
} from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── Public routes ─────────────────────
router.post('/register', registerUser);
router.post('/login', loginUser);

// ─── Private routes (JWT required) ─────
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);

// ─── Admin-only routes ─────────────────
router.patch('/users/:id/role', protect, adminOnly, changeUserRole);

export default router;