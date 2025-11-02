'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  Star,
  Minus,
  Plus,
  MessageCircle,
} from 'lucide-react'
import api from '@/lib/api'
import { Product } from '@/types'
import { formatPrice, formatRelativeTime } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function ProductPage() {
  const params = useParams()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const { addItem } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', params.id],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: Product }>(
        `/products/${params.id}`
      )
      return response.data.data
    },
  })

  const handleAddToCart = () => {
    if (!product) return
    addItem(product, quantity)
    toast.success('Produto adicionado ao carrinho!')
  }

  const handleBuyNow = () => {
    if (!product) return
    addItem(product, quantity)
    window.location.href = '/carrinho'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Produto não encontrado</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-primary-600">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/categorias/${product.category && typeof product.category === 'object' ? product.category.slug : ''}`}
            className="hover:text-primary-600"
          >
            {product.category && typeof product.category === 'object' ? product.category.name : 'Categoria'}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.title}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card overflow-hidden mb-4"
            >
              <div className="aspect-square bg-gray-100">
                {product.images && product.images[selectedImage] ? (
                  <img
                    src={product.images[selectedImage].url}
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-9xl">📦</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-primary-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="card p-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.condition === 'new' && (
                  <span className="badge badge-success">Novo</span>
                )}
                {product.shipping?.freeShipping && (
                  <span className="badge bg-green-100 text-green-800">Frete Grátis</span>
                )}
                {product.stock < 10 && product.stock > 0 && (
                  <span className="badge badge-warning">Últimas unidades!</span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>

              {/* Rating */}
              {product.rating && product.rating.count > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(product.rating.average)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {product.rating.average.toFixed(1)} ({product.rating.count} avaliações)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mb-6">
                {product.discount > 0 && (
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-gray-500 line-through text-xl">
                      {formatPrice(product.originalPrice || 0)}
                    </span>
                    <span className="badge bg-red-500 text-white">
                      -{product.discount}%
                    </span>
                  </div>
                )}
                <p className="text-4xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </p>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <p className="label mb-2">Quantidade</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-3 hover:bg-gray-50 transition-colors"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-gray-600">
                    {product.stock} disponíveis
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={handleBuyNow}
                  className="btn-primary flex-1"
                  disabled={product.stock === 0}
                >
                  Comprar Agora
                </button>
                <button
                  onClick={handleAddToCart}
                  className="btn-accent flex-1 flex items-center justify-center gap-2"
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Adicionar ao Carrinho
                </button>
                <button className="btn-outline p-3">
                  <Heart className="w-6 h-6" />
                </button>
              </div>

              {/* Benefits */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Frete Grátis</p>
                    <p className="text-sm text-gray-600">Chegará grátis entre segunda e quinta</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Compra Garantida</p>
                    <p className="text-sm text-gray-600">
                      Receba o produto ou devolvemos seu dinheiro
                    </p>
                  </div>
                </div>

                {isAuthenticated && (
                  <Link
                    href={`/chat/${product.seller._id}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium">Tirar Dúvidas</p>
                      <p className="text-sm text-gray-600">Fale com o vendedor</p>
                    </div>
                  </Link>
                )}
              </div>
            </div>

            {/* Seller Info */}
            <div className="card p-6 mt-4">
              <h3 className="font-bold text-gray-900 mb-4">Vendedor</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {product.seller.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{product.seller.name}</p>
                  <p className="text-sm text-gray-600">{product.sales} vendas realizadas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Specs */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Descrição do Produto
              </h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                {product.description}
              </div>
            </div>

            {product.specifications && product.specifications.length > 0 && (
              <div className="card p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Especificações Técnicas
                </h2>
                <div className="space-y-3">
                  {product.specifications.map((spec, index) => (
                    <div
                      key={index}
                      className="flex justify-between py-3 border-b border-gray-200 last:border-0"
                    >
                      <span className="font-medium text-gray-700">{spec.key}</span>
                      <span className="text-gray-600">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="card p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Informações</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Marca</p>
                  <p className="font-medium text-gray-900">
                    {product.brand || 'Não informada'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Condição</p>
                  <p className="font-medium text-gray-900">
                    {product.condition === 'new' ? 'Novo' : 'Usado'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Visualizações</p>
                  <p className="font-medium text-gray-900">{product.views}</p>
                </div>
                <div>
                  <p className="text-gray-600">Vendidos</p>
                  <p className="font-medium text-gray-900">{product.sales}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

