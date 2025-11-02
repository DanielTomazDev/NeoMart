import express from 'express';
import {
  getConversations,
  getConversationMessages,
  sendMessage,
  markMessageAsRead,
  getUnreadCount,
} from '../controllers/message.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Todas as rotas são protegidas
router.use(protect);

router.get('/conversations', getConversations);
router.get('/conversation/:conversationId', getConversationMessages);
router.post('/', sendMessage);
router.put('/:id/read', markMessageAsRead);
router.get('/unread-count', getUnreadCount);

export default router;

