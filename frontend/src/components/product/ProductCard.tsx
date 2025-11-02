'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import toast from 'react-hot-toast'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const { addItem } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    toast.success('Produto adicionado ao carrinho!')
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Faça login para adicionar aos favoritos')
      return
    }
    setIsFavorite(!isFavorite)
    toast.success(isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos')
  }

  const hasDiscount = product.discount > 0

  return (
    <Link href={`/produtos/${product._id}`}>
      <motion.div
        whileHover={{ y: -5 }}
        className="card overflow-hidden h-full flex flex-col group"
      >
        {/* Image */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {product.images && product.images[0] ? (
            <img
              src={product.images[0].url}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-6xl">📦</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {hasDiscount && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                -{product.discount}%
              </span>
            )}
            {product.shipping?.freeShipping && (
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                FRETE GRÁTIS
              </span>
            )}
            {product.isFeatured && (
              <span className="px-2 py-1 bg-primary-500 text-gray-900 text-xs font-bold rounded">
                DESTAQUE
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleFavorite}
            className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
          </motion.button>

          {/* Add to Cart Button (hover) */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            onClick={handleAddToCart}
            className="absolute bottom-3 left-3 right-3 bg-primary-500 text-gray-900 font-medium py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 hover:bg-primary-600"
          >
            <ShoppingCart className="w-4 h-4" />
            Adicionar ao Carrinho
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-4 flex-grow flex flex-col">
          {/* Category */}
          {product.category && (
            <p className="text-xs text-gray-500 mb-1">
              {typeof product.category === 'object' ? product.category.name : product.category}
            </p>
          )}

          {/* Title */}
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.title}
          </h3>

          {/* Rating */}
          {product.rating && product.rating.count > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.round(product.rating.average)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                ({product.rating.count})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mt-auto">
            {hasDiscount && (
              <p className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice || 0)}
              </p>
            )}
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </p>
            </div>

            {/* Stock */}
            {product.stock < 10 && product.stock > 0 && (
              <p className="text-xs text-orange-600 mt-1">
                Apenas {product.stock} em estoque
              </p>
            )}
            {product.stock === 0 && (
              <p className="text-xs text-red-600 mt-1">Esgotado</p>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

