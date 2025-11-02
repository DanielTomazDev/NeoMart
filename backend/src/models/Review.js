import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    rating: {
      type: Number,
      required: [true, 'Avaliação é obrigatória'],
      min: [1, 'Avaliação mínima é 1'],
      max: [5, 'Avaliação máxima é 5'],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'Título não pode exceder 100 caracteres'],
    },
    comment: {
      type: String,
      required: [true, 'Comentário é obrigatório'],
      trim: true,
      maxlength: [1000, 'Comentário não pode exceder 1000 caracteres'],
    },
    images: [String],
    pros: [String],
    cons: [String],
    helpful: {
      type: Number,
      default: 0,
    },
    helpfulVotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    verified: {
      type: Boolean,
      default: false,
    },
    response: {
      text: String,
      date: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevenir múltiplas avaliações do mesmo usuário para o mesmo produto
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Índices adicionais
reviewSchema.index({ product: 1, rating: -1 });
reviewSchema.index({ user: 1 });

// Atualizar rating do produto após salvar avaliação
reviewSchema.post('save', async function () {
  const Product = mongoose.model('Product');
  
  const stats = await this.constructor.aggregate([
    { $match: { product: this.product } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        numRatings: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(this.product, {
      'rating.average': Math.round(stats[0].avgRating * 10) / 10,
      'rating.count': stats[0].numRatings,
    });
  }
});

export default mongoose.model('Review', reviewSchema);

