import User from '../models/User.js';

// @desc    Obter perfil de usuário
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Atualizar perfil
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;

    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Adicionar endereço
// @route   POST /api/users/addresses
// @access  Private
export const addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    // Se for o primeiro endereço, torná-lo padrão
    const isDefault = user.addresses.length === 0 ? true : req.body.isDefault || false;

    // Se novo endereço for padrão, remover padrão dos outros
    if (isDefault) {
      user.addresses.forEach(addr => (addr.isDefault = false));
    }

    user.addresses.push({ ...req.body, isDefault });
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Endereço adicionado com sucesso',
      data: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Atualizar endereço
// @route   PUT /api/users/addresses/:addressId
// @access  Private
export const updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Endereço não encontrado',
      });
    }

    // Se endereço for definido como padrão, remover padrão dos outros
    if (req.body.isDefault) {
      user.addresses.forEach(addr => (addr.isDefault = false));
    }

    Object.assign(address, req.body);
    await user.save();

    res.json({
      success: true,
      message: 'Endereço atualizado com sucesso',
      data: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remover endereço
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
export const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    user.addresses = user.addresses.filter(
      addr => addr._id.toString() !== req.params.addressId
    );

    await user.save();

    res.json({
      success: true,
      message: 'Endereço removido com sucesso',
      data: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Adicionar produto aos favoritos
// @route   POST /api/users/favorites/:productId
// @access  Private
export const addToFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.favorites.includes(req.params.productId)) {
      return res.status(400).json({
        success: false,
        message: 'Produto já está nos favoritos',
      });
    }

    user.favorites.push(req.params.productId);
    await user.save();

    res.json({
      success: true,
      message: 'Produto adicionado aos favoritos',
      data: user.favorites,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remover produto dos favoritos
// @route   DELETE /api/users/favorites/:productId
// @access  Private
export const removeFromFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    user.favorites = user.favorites.filter(
      fav => fav.toString() !== req.params.productId
    );

    await user.save();

    res.json({
      success: true,
      message: 'Produto removido dos favoritos',
      data: user.favorites,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter favoritos
// @route   GET /api/users/favorites
// @access  Private
export const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');

    res.json({
      success: true,
      data: user.favorites,
    });
  } catch (error) {
    next(error);
  }
};

