import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getMySales,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/order.controller.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Todas as rotas são protegidas
router.use(protect);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/my-sales', authorize('seller', 'admin'), getMySales);
router.get('/:id', getOrderById);
router.put('/:id/status', authorize('seller', 'admin'), updateOrderStatus);
router.put('/:id/cancel', cancelOrder);

export default router;

