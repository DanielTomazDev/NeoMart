import express from 'express';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markReviewHelpful,
} from '../controllers/review.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Rotas públicas
router.get('/product/:productId', getProductReviews);

// Rotas protegidas
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/helpful', protect, markReviewHelpful);

export default router;

