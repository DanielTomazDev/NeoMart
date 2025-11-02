'use client'

import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore()

  const subtotal = getTotal()
  const shipping = subtotal > 99 ? 0 : 15
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Seu carrinho está vazio
          </h2>
          <p className="text-gray-600 mb-6">
            Adicione produtos e comece a comprar!
          </p>
          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Continuar Comprando
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Carrinho de Compras
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <Link
                    href={`/produtos/${item.product._id}`}
                    className="flex-shrink-0"
                  >
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                      {item.product.images && item.product.images[0] ? (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="text-4xl">📦</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-grow">
                    <Link
                      href={`/produtos/${item.product._id}`}
                      className="font-medium text-gray-900 hover:text-primary-600 transition-colors mb-1 block"
                    >
                      {item.product.title}
                    </Link>
                    <p className="text-sm text-gray-600 mb-3">
                      {item.product.category && typeof item.product.category === 'object'
                        ? item.product.category.name
                        : 'Categoria'}
                    </p>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-50 transition-colors"
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price & Remove */}
                      <div className="flex items-center gap-4">
                        <p className="text-2xl font-bold text-gray-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                        <button
                          onClick={() => removeItem(item.product._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 transition-colors text-sm font-medium"
            >
              Limpar Carrinho
            </button>
          </div>

          {/* Summary */}
          <div>
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Resumo do Pedido
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete</span>
                  <span className="font-medium text-gray-900">
                    {shipping === 0 ? (
                      <span className="text-green-600">Grátis</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {subtotal < 99 && (
                  <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    💡 Falta {formatPrice(99 - subtotal)} para frete grátis
                  </div>
                )}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                Finalizar Compra
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/"
                className="btn-outline w-full mt-3 text-center"
              >
                Continuar Comprando
              </Link>

              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-3 font-medium">
                  Compra 100% segura e protegida
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-700">
                    🔒 SSL
                  </div>
                  <div className="flex-1 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-700">
                    💳 PCI
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

