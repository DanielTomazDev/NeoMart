import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';

// @desc    Dashboard - Estatísticas gerais
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
export const getDashboardStats = async (req, res, next) => {
  try {
    // Contagens gerais
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalReviews = await Review.countDocuments();

    // Vendas totais
    const salesData = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'approved',
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' },
        },
      },
    ]);

    // Vendas por mês (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          paymentStatus: 'approved',
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Produtos mais vendidos
    const topProducts = await Product.find()
      .sort('-sales')
      .limit(10)
      .select('title sales price images');

    // Categorias mais populares
    const topCategories = await Product.aggregate([
      {
        $match: { isActive: true },
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalSales: { $sum: '$sales' },
        },
      },
      {
        $sort: { totalSales: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
    ]);

    // Novos usuários (última semana)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const newUsers = await User.countDocuments({
      createdAt: { $gte: lastWeek },
    });

    // Pedidos pendentes
    const pendingOrders = await Order.countDocuments({
      orderStatus: { $in: ['pending', 'confirmed', 'preparing'] },
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalReviews,
          newUsers,
          pendingOrders,
        },
        sales: {
          totalRevenue: salesData[0]?.totalRevenue || 0,
          averageOrderValue: salesData[0]?.averageOrderValue || 0,
          monthlySales,
        },
        topProducts,
        topCategories,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter todos os usuários
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
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

// @desc    Atualizar usuário
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deletar usuário
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    res.json({
      success: true,
      message: 'Usuário deletado com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter todos os pedidos
// @route   GET /api/admin/orders
// @access  Private (Admin)
export const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;

    const query = {};
    if (status) query.orderStatus = status;
    if (search) query.orderNumber = { $regex: search, $options: 'i' };

    const orders = await Order.find(query)
      .populate('buyer', 'name email')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

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

// @desc    Atualizar produto (admin)
// @route   PUT /api/admin/products/:id
// @access  Private (Admin)
export const updateProductAdmin = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado',
      });
    }

    res.json({
      success: true,
      message: 'Produto atualizado com sucesso',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

