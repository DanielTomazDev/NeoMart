import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Título é obrigatório'],
      trim: true,
      maxlength: [200, 'Título não pode exceder 200 caracteres'],
    },
    description: {
      type: String,
      required: [true, 'Descrição é obrigatória'],
      maxlength: [5000, 'Descrição não pode exceder 5000 caracteres'],
    },
    price: {
      type: Number,
      required: [true, 'Preço é obrigatório'],
      min: [0, 'Preço não pode ser negativo'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Preço original não pode ser negativo'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Desconto não pode ser negativo'],
      max: [100, 'Desconto não pode exceder 100%'],
    },
    images: [
      {
        url: String,
        alt: String,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Categoria é obrigatória'],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Vendedor é obrigatório'],
    },
    stock: {
      type: Number,
      required: [true, 'Estoque é obrigatório'],
      min: [0, 'Estoque não pode ser negativo'],
      default: 0,
    },
    condition: {
      type: String,
      enum: ['new', 'used', 'refurbished'],
      default: 'new',
    },
    brand: {
      type: String,
      trim: true,
    },
    specifications: [
      {
        key: String,
        value: String,
      },
    ],
    shipping: {
      freeShipping: {
        type: Boolean,
        default: false,
      },
      weight: Number, // em gramas
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    views: {
      type: Number,
      default: 0,
    },
    sales: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// Índices para busca e performance
productSchema.index({ title: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ sales: -1 });
productSchema.index({ createdAt: -1 });

// Calcular desconto antes de salvar
productSchema.pre('save', function (next) {
  if (this.originalPrice && this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  next();
});

// Virtual para preço com desconto
productSchema.virtual('discountedPrice').get(function () {
  if (this.discount > 0 && this.originalPrice) {
    return this.originalPrice - (this.originalPrice * this.discount) / 100;
  }
  return this.price;
});

export default mongoose.model('Product', productSchema);

