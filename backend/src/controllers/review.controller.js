import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Obter reviews de um produto
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ product: req.params.productId });

    res.json({
      success: true,
      data: {
        reviews,
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

// @desc    Criar review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    const { product, rating, title, comment, pros, cons, images } = req.body;

    // Verificar se produto existe
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado',
      });
    }

    // Verificar se usuário comprou o produto
    const order = await Order.findOne({
      buyer: req.user.id,
      'items.product': product,
      orderStatus: 'delivered',
    });

    const review = await Review.create({
      product,
      user: req.user.id,
      order: order?._id,
      rating,
      title,
      comment,
      pros,
      cons,
      images,
      verified: !!order,
    });

    res.status(201).json({
      success: true,
      message: 'Avaliação criada com sucesso',
      data: review,
    });
  } catch (error) {
    // Tratamento para review duplicado
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Você já avaliou este produto',
      });
    }
    next(error);
  }
};

// @desc    Atualizar review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Avaliação não encontrada',
      });
    }

    // Verificar se é o dono da review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Não autorizado a atualizar esta avaliação',
      });
    }

    const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Avaliação atualizada com sucesso',
      data: updatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deletar review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Avaliação não encontrada',
      });
    }

    // Verificar se é o dono da review ou admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Não autorizado a deletar esta avaliação',
      });
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: 'Avaliação deletada com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Marcar review como útil
// @route   POST /api/reviews/:id/helpful
// @access  Private
export const markReviewHelpful = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Avaliação não encontrada',
      });
    }

    // Verificar se já votou
    if (review.helpfulVotes.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Você já marcou esta avaliação como útil',
      });
    }

    review.helpfulVotes.push(req.user.id);
    review.helpful += 1;
    await review.save();

    res.json({
      success: true,
      message: 'Avaliação marcada como útil',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

