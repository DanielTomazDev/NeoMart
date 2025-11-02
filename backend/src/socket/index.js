import jwt from 'jsonwebtoken';
import Message from '../models/Message.js';
import User from '../models/User.js';

// Armazenar usuários online
const onlineUsers = new Map();

export const setupSocketHandlers = (io) => {
  // Middleware de autenticação
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Autenticação necessária'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new Error('Usuário não encontrado'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Token inválido'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ Usuário conectado: ${socket.user.name} (${socket.userId})`);

    // Adicionar usuário aos online
    onlineUsers.set(socket.userId, {
      socketId: socket.id,
      userId: socket.userId,
      name: socket.user.name,
      avatar: socket.user.avatar,
    });

    // Notificar todos sobre usuário online
    io.emit('user:online', {
      userId: socket.userId,
      name: socket.user.name,
      avatar: socket.user.avatar,
    });

    // Entrar em sala de conversa
    socket.on('conversation:join', (conversationId) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`👤 ${socket.user.name} entrou na conversa ${conversationId}`);
    });

    // Sair de sala de conversa
    socket.on('conversation:leave', (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`👤 ${socket.user.name} saiu da conversa ${conversationId}`);
    });

    // Enviar mensagem
    socket.on('message:send', async (data) => {
      try {
        const { conversationId, recipientId, content, productId } = data;

        // Criar mensagem no banco
        const message = await Message.create({
          sender: socket.userId,
          recipient: recipientId,
          content,
          conversationId,
          product: productId,
        });

        // Popular dados do remetente
        await message.populate('sender', 'name avatar');

        // Emitir para todos na conversa
        io.to(`conversation:${conversationId}`).emit('message:received', {
          message,
        });

        // Se destinatário está online mas não na sala, notificar
        const recipient = onlineUsers.get(recipientId);
        if (recipient && !io.sockets.adapter.rooms.has(`conversation:${conversationId}`)) {
          io.to(recipient.socketId).emit('message:notification', {
            conversationId,
            sender: {
              id: socket.userId,
              name: socket.user.name,
              avatar: socket.user.avatar,
            },
            preview: content.substring(0, 50),
          });
        }
      } catch (error) {
        console.error('❌ Erro ao enviar mensagem:', error);
        socket.emit('message:error', { message: 'Erro ao enviar mensagem' });
      }
    });

    // Marcar mensagem como lida
    socket.on('message:read', async (data) => {
      try {
        const { messageId } = data;

        await Message.findByIdAndUpdate(messageId, {
          isRead: true,
          readAt: new Date(),
        });

        // Notificar remetente
        const message = await Message.findById(messageId);
        const sender = onlineUsers.get(message.sender.toString());
        
        if (sender) {
          io.to(sender.socketId).emit('message:read:confirm', {
            messageId,
            readBy: socket.userId,
          });
        }
      } catch (error) {
        console.error('❌ Erro ao marcar mensagem como lida:', error);
      }
    });

    // Usuário está digitando
    socket.on('typing:start', (data) => {
      const { conversationId } = data;
      socket.to(`conversation:${conversationId}`).emit('typing:user', {
        userId: socket.userId,
        name: socket.user.name,
        isTyping: true,
      });
    });

    // Usuário parou de digitar
    socket.on('typing:stop', (data) => {
      const { conversationId } = data;
      socket.to(`conversation:${conversationId}`).emit('typing:user', {
        userId: socket.userId,
        name: socket.user.name,
        isTyping: false,
      });
    });

    // Desconexão
    socket.on('disconnect', () => {
      console.log(`❌ Usuário desconectado: ${socket.user.name}`);
      
      // Remover dos usuários online
      onlineUsers.delete(socket.userId);

      // Notificar todos sobre usuário offline
      io.emit('user:offline', {
        userId: socket.userId,
      });
    });
  });

  // Retornar funções úteis
  return {
    getOnlineUsers: () => Array.from(onlineUsers.values()),
    isUserOnline: (userId) => onlineUsers.has(userId),
    sendToUser: (userId, event, data) => {
      const user = onlineUsers.get(userId);
      if (user) {
        io.to(user.socketId).emit(event, data);
      }
    },
  };
};

