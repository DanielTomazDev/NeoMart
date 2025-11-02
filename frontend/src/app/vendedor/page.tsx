'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react'
import api from '@/lib/api'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function SellerDashboard() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [activeTab, setActiveTab] = useState('products')

  // Check auth and role
  if (!isAuthenticated || user?.role !== 'seller') {
    router.push('/')
    return null
  }

  // Fetch seller products
  const { data: products, isLoading } = useQuery({
    queryKey: ['seller-products'],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: { products: Product[] } }>(
        `/products?seller=${user._id}`
      )
      return response.data.data.products
    },
  })

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return

    try {
      await api.delete(`/products/${id}`)
      toast.success('Produto excluído com sucesso!')
      // Refetch products
      window.location.reload()
    } catch (error) {
      toast.error('Erro ao excluir produto')
    }
  }

  // Mock stats
  const stats = [
    {
      label: 'Total de Vendas',
      value: 'R$ 12.450,00',
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      label: 'Produtos Ativos',
      value: products?.length || 0,
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      label: 'Pedidos',
      value: '45',
      icon: ShoppingBag,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      label: 'Crescimento',
      value: '+23%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Painel do Vendedor
            </h1>
            <p className="text-gray-600">
              Gerencie seus produtos e vendas
            </p>
          </div>
          <Link
            href="/vendedor/novo-produto"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Novo Produto
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="card overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'products'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Meus Produtos
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'orders'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Pedidos
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'products' && (
              <div>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : products && products.length > 0 ? (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div
                        key={product._id}
                        className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {/* Image */}
                        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0].url}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl">
                              📦
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-grow">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {product.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Estoque: {product.stock}</span>
                            <span>Vendas: {product.sales}</span>
                            <span className={`badge ${product.isActive ? 'badge-success' : 'badge-error'}`}>
                              {product.isActive ? 'Ativo' : 'Inativo'}
                            </span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">
                            {formatPrice(product.price)}
                          </p>
                          {product.discount > 0 && (
                            <p className="text-sm text-gray-500 line-through">
                              {formatPrice(product.originalPrice || 0)}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/vendedor/editar/${product._id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Você ainda não tem produtos cadastrados
                    </p>
                    <Link href="/vendedor/novo-produto" className="btn-primary">
                      Cadastrar Primeiro Produto
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">
                  Funcionalidade de pedidos em desenvolvimento
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

