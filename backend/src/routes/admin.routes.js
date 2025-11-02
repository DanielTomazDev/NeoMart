import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllOrders,
  updateProductAdmin,
} from '../controllers/admin.controller.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Todas as rotas são protegidas e apenas para admin
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Gestão de usuários
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Gestão de pedidos
router.get('/orders', getAllOrders);

// Gestão de produtos
router.put('/products/:id', updateProductAdmin);

export default router;

