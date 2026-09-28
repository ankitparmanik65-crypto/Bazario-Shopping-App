import express from 'express';
import {
  getProductReviews,
  createReview,
  deleteReview
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

// ─── Product-specific review routes ───
// Mount hoga: /api/products/:productId/reviews
export const productReviewRouter = express.Router({ mergeParams: true });

productReviewRouter
  .route('/')
  .get(getProductReviews)
  .post(protect, createReview);

// ─── Standalone review routes ───
// Mount hoga: /api/reviews/:id
export const reviewRouter = express.Router();

reviewRouter.delete('/:id', protect, deleteReview);