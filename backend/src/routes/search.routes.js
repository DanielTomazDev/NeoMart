import express from 'express';
import {
  searchProducts,
  searchAutocomplete,
  getTrendingSearches,
  getSearchHistory,
  clearSearchHistory,
} from '../controllers/search.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Rotas públicas
router.get('/', searchProducts);
router.get('/autocomplete', searchAutocomplete);
router.get('/trending', getTrendingSearches);

// Rotas protegidas
router.get('/history', protect, getSearchHistory);
router.delete('/history', protect, clearSearchHistory);

export default router;

