import express from 'express';
import {
  getUserProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
} from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Rotas de perfil
router.get('/:id', getUserProfile);
router.put('/profile', protect, updateProfile);

// Rotas de endereços
router.post('/addresses', protect, addAddress);
router.put('/addresses/:addressId', protect, updateAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);

// Rotas de favoritos
router.get('/favorites', protect, getFavorites);
router.post('/favorites/:productId', protect, addToFavorites);
router.delete('/favorites/:productId', protect, removeFromFavorites);

export default router;

