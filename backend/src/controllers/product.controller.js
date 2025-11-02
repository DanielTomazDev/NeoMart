import Product from '../models/Product.js';
import { validationResult } from 'express-validator';

// @desc    Obter todos os produtos com filtros
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      minPrice,
      maxPrice,
      condition,
      freeShipping,
      minRating,
      sort = '-createdAt',
      search,
    } = req.query;

    // Construir query
    const query = { isActive: true };

    if (category) query.category = category;
    if (condition) query.condition = condition;
    if (freeShipping === 'true') query['shipping.freeShipping'] = true;
    if (minRating) query['rating.average'] = { $gte: parseFloat(minRating) };

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Executar query
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('seller', 'name avatar')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        products,
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

// @desc    Obter produto por ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('seller', 'name avatar');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado',
      });
    }

    // Incrementar visualizações
    product.views += 1;
    await product.save();

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Criar produto
// @route   POST /api/products
// @access  Private (Seller)
export const createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Adicionar seller ao produto
    req.body.seller = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Atualizar produto
// @route   PUT /api/products/:id
// @access  Private (Seller - próprio produto)
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado',
      });
    }

    // Verificar se usuário é o dono do produto
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Não autorizado a atualizar este produto',
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Produto atualizado com sucesso',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deletar produto
// @route   DELETE /api/products/:id
// @access  Private (Seller - próprio produto)
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado',
      });
    }

    // Verificar se usuário é o dono do produto
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Não autorizado a deletar este produto',
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Produto deletado com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter produtos do vendedor
// @route   GET /api/products/seller/:sellerId
// @access  Public
export const getSellerProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const products = await Product.find({
      seller: req.params.sellerId,
      isActive: true,
    })
      .populate('category', 'name slug')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Product.countDocuments({
      seller: req.params.sellerId,
      isActive: true,
    });

    res.json({
      success: true,
      data: {
        products,
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

// @desc    Obter produtos em destaque
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      isFeatured: true,
      isActive: true,
    })
      .populate('category', 'name slug')
      .populate('seller', 'name avatar')
      .sort('-sales')
      .limit(10);

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

