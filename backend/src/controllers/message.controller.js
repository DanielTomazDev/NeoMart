import Message from '../models/Message.js';

// @desc    Obter conversas do usuário
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: req.user._id }, { receiver: req.user._id }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: '$conversation',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [{ $eq: ['$receiver', req.user._id] }, { $eq: ['$isRead', false] }],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: { 'lastMessage.createdAt': -1 },
      },
    ]);

    // Popular informações dos usuários
    await Message.populate(conversations, [
      { path: 'lastMessage.sender', select: 'name avatar' },
      { path: 'lastMessage.receiver', select: 'name avatar' },
      { path: 'lastMessage.product', select: 'title images' },
    ]);

    res.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter mensagens de uma conversa
// @route   GET /api/messages/conversation/:conversationId
// @access  Private
export const getConversationMessages = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const messages = await Message.find({
      conversation: req.params.conversationId,
    })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .populate('product', 'title images price')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Marcar mensagens como lidas
    await Message.updateMany(
      {
        conversation: req.params.conversationId,
        receiver: req.user.id,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    res.json({
      success: true,
      data: messages.reverse(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Enviar mensagem
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { receiver, product, message, type, attachments } = req.body;

    const conversationId = Message.generateConversationId(req.user.id, receiver);

    const newMessage = await Message.create({
      conversation: conversationId,
      sender: req.user.id,
      receiver,
      product,
      message,
      type: type || 'text',
      attachments,
    });

    await newMessage.populate([
      { path: 'sender', select: 'name avatar' },
      { path: 'receiver', select: 'name avatar' },
      { path: 'product', select: 'title images' },
    ]);

    // Aqui você pode emitir evento Socket.io
    // io.to(receiver).emit('new-message', newMessage);

    res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Marcar mensagem como lida
// @route   PUT /api/messages/:id/read
// @access  Private
export const markMessageAsRead = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      {
        isRead: true,
        readAt: new Date(),
      },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada',
      });
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter contagem de mensagens não lidas
// @route   GET /api/messages/unread-count
// @access  Private
export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user.id,
      isRead: false,
    });

    res.json({
      success: true,
      data: { count },
    });
  } catch (error) {
    next(error);
  }
};

