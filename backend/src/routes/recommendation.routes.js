import express from 'express';
import {
  getRecommendations,
  getRelatedProducts,
  getBoughtTogether,
  getTrendingProducts,
} from '../controllers/recommendation.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Rotas públicas (melhor experiência se autenticado)
router.get('/', protect, getRecommendations);
router.get('/related/:productId', getRelatedProducts);
router.get('/bought-together/:productId', getBoughtTogether);
router.get('/trending', getTrendingProducts);

export default router;

