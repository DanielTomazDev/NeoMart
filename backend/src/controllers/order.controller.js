import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Criar pedido
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, shippingCost, discount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum item no pedido',
      });
    }

    // Calcular subtotal e validar estoque
    let subtotal = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Produto ${item.product} não encontrado`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Estoque insuficiente para ${product.title}`,
        });
      }

      item.price = product.price;
      item.subtotal = product.price * item.quantity;
      item.title = product.title;
      item.image = product.images[0]?.url;
      item.seller = product.seller;
      subtotal += item.subtotal;
    }

    const total = subtotal + (shippingCost || 0) - (discount || 0);

    const order = await Order.create({
      buyer: req.user.id,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost: shippingCost || 0,
      discount: discount || 0,
      total,
    });

    // Atualizar estoque e vendas dos produtos
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, sales: item.quantity },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter pedidos do usuário
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const orders = await Order.find({ buyer: req.user.id })
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Order.countDocuments({ buyer: req.user.id });

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter pedido por ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email')
      .populate('items.product')
      .populate('items.seller', 'name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado',
      });
    }

    // Verificar se usuário tem permissão para ver o pedido
    const isAuthorized =
      order.buyer._id.toString() === req.user.id ||
      order.items.some(item => item.seller._id.toString() === req.user.id) ||
      req.user.role === 'admin';

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Não autorizado a visualizar este pedido',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter vendas do vendedor
// @route   GET /api/orders/my-sales
// @access  Private (Seller)
export const getMySales = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const orders = await Order.find({
      'items.seller': req.user.id,
    })
      .populate('buyer', 'name email')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Order.countDocuments({
      'items.seller': req.user.id,
    });

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Atualizar status do pedido
// @route   PUT /api/orders/:id/status
// @access  Private (Seller)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, note } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado',
      });
    }

    // Verificar permissão
    const isSeller = order.items.some(item => item.seller.toString() === req.user.id);
    const isAdmin = req.user.role === 'admin';

    if (!isSeller && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Não autorizado a atualizar este pedido',
      });
    }

    order.orderStatus = orderStatus;
    if (note) {
      order.statusHistory[order.statusHistory.length - 1].note = note;
    }

    await order.save();

    res.json({
      success: true,
      message: 'Status do pedido atualizado com sucesso',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancelar pedido
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado',
      });
    }

    // Verificar se é o comprador ou admin
    if (order.buyer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Não autorizado a cancelar este pedido',
      });
    }

    // Não permitir cancelamento de pedidos já enviados
    if (['shipped', 'delivered'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Não é possível cancelar pedidos já enviados',
      });
    }

    order.orderStatus = 'cancelled';
    order.cancelReason = reason;

    // Devolver itens ao estoque
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, sales: -item.quantity },
      });
    }

    await order.save();

    res.json({
      success: true,
      message: 'Pedido cancelado com sucesso',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

