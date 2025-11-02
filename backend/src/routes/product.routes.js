import express from 'express';
import { body } from 'express-validator';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  getFeaturedProducts,
} from '../controllers/product.controller.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Validações
const productValidation = [
  body('title').trim().notEmpty().withMessage('Título é obrigatório'),
  body('description').trim().notEmpty().withMessage('Descrição é obrigatória'),
  body('price').isNumeric().withMessage('Preço deve ser um número'),
  body('category').notEmpty().withMessage('Categoria é obrigatória'),
  body('stock').isNumeric().withMessage('Estoque deve ser um número'),
];

// Rotas públicas
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/seller/:sellerId', getSellerProducts);
router.get('/:id', getProductById);

// Rotas protegidas (seller)
router.post('/', protect, authorize('seller', 'admin'), productValidation, createProduct);
router.put('/:id', protect, authorize('seller', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('seller', 'admin'), deleteProduct);

export default router;

