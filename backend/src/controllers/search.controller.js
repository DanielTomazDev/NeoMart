import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Busca inteligente de produtos
// @route   GET /api/search
// @access  Public
export const searchProducts = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Query de busca é obrigatória',
      });
    }

    // Busca usando índice de texto
    const products = await Product.find(
      {
        $text: { $search: q },
        isActive: true,
      },
      { score: { $meta: 'textScore' } }
    )
      .populate('category', 'name slug')
      .populate('seller', 'name avatar')
      .sort({ score: { $meta: 'textScore' } })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Product.countDocuments({
      $text: { $search: q },
      isActive: true,
    });

    // Salvar no histórico do usuário se estiver logado
    if (req.user) {
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          searchHistory: {
            $each: [{ query: q }],
            $slice: -20, // Manter apenas últimas 20 buscas
          },
        },
      });
    }

    res.json({
      success: true,
      data: {
        products,
        query: q,
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

// @desc    Autocomplete de busca
// @route   GET /api/search/autocomplete
// @access  Public
export const searchAutocomplete = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.json({ success: true, data: [] });
    }

    // Buscar produtos que começam com a query
    const products = await Product.find({
      title: { $regex: new RegExp('^' + q, 'i') },
      isActive: true,
    })
      .select('title')
      .limit(5);

    const suggestions = products.map(p => p.title);

    res.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Produtos mais buscados/populares
// @route   GET /api/search/trending
// @access  Public
export const getTrendingSearches = async (req, res, next) => {
  try {
    // Produtos mais visualizados nas últimas 24h
    const products = await Product.find({ isActive: true })
      .sort('-views -sales')
      .select('title')
      .limit(10);

    res.json({
      success: true,
      data: products.map(p => p.title),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Histórico de busca do usuário
// @route   GET /api/search/history
// @access  Private
export const getSearchHistory = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('searchHistory');

    const history = user.searchHistory
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10)
      .map(h => h.query);

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Limpar histórico de busca
// @route   DELETE /api/search/history
// @access  Private
export const clearSearchHistory = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      searchHistory: [],
    });

    res.json({
      success: true,
      message: 'Histórico de busca limpo com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

