import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Obter recomendações personalizadas
// @route   GET /api/recommendations
// @access  Public (melhor se autenticado)
export const getRecommendations = async (req, res, next) => {
  try {
    let recommendations = [];

    if (req.user) {
      // Usuário logado: baseado em histórico de compras
      const orders = await Order.find({ buyer: req.user.id }).populate('items.product');

      const purchasedCategories = [];
      orders.forEach(order => {
        order.items.forEach(item => {
          if (item.product && item.product.category) {
            purchasedCategories.push(item.product.category);
          }
        });
      });

      if (purchasedCategories.length > 0) {
        recommendations = await Product.find({
          category: { $in: purchasedCategories },
          isActive: true,
        })
          .populate('category', 'name')
          .populate('seller', 'name avatar')
          .sort('-rating.average -sales')
          .limit(10);
      }
    }

    // Fallback: produtos mais vendidos ou em destaque
    if (recommendations.length === 0) {
      recommendations = await Product.find({
        isActive: true,
        $or: [{ isFeatured: true }, { sales: { $gt: 0 } }],
      })
        .populate('category', 'name')
        .populate('seller', 'name avatar')
        .sort('-sales -rating.average')
        .limit(10);
    }

    res.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Produtos relacionados/similares
// @route   GET /api/recommendations/related/:productId
// @access  Public
export const getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado',
      });
    }

    // Buscar produtos da mesma categoria ou com tags similares
    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      $or: [
        { category: product.category },
        { tags: { $in: product.tags } },
        { brand: product.brand },
      ],
      isActive: true,
    })
      .populate('category', 'name')
      .populate('seller', 'name avatar')
      .sort('-rating.average -sales')
      .limit(8);

    res.json({
      success: true,
      data: relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Produtos frequentemente comprados juntos
// @route   GET /api/recommendations/bought-together/:productId
// @access  Public
export const getBoughtTogether = async (req, res, next) => {
  try {
    // Encontrar pedidos que contêm o produto
    const orders = await Order.find({
      'items.product': req.params.productId,
      orderStatus: 'delivered',
    });

    // Extrair produtos frequentemente comprados juntos
    const productIds = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const productId = item.product.toString();
        if (productId !== req.params.productId) {
          productIds[productId] = (productIds[productId] || 0) + 1;
        }
      });
    });

    // Ordenar por frequência
    const sortedProducts = Object.entries(productIds)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id]) => id);

    const products = await Product.find({
      _id: { $in: sortedProducts },
      isActive: true,
    })
      .populate('category', 'name')
      .populate('seller', 'name avatar');

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Produtos em alta (trending)
// @route   GET /api/recommendations/trending
// @access  Public
export const getTrendingProducts = async (req, res, next) => {
  try {
    // Produtos com mais visualizações e vendas recentes
    const products = await Product.find({
      isActive: true,
    })
      .populate('category', 'name')
      .populate('seller', 'name avatar')
      .sort('-views -sales')
      .limit(12);

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

