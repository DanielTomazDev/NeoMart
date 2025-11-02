'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Filter, SlidersHorizontal } from 'lucide-react'
import api from '@/lib/api'
import { Product } from '@/types'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton'

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    freeShipping: false,
    sort: '-createdAt',
  })

  const { data, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.category) params.append('category', filters.category)
      if (filters.minPrice) params.append('minPrice', filters.minPrice)
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
      if (filters.condition) params.append('condition', filters.condition)
      if (filters.freeShipping) params.append('freeShipping', 'true')
      params.append('sort', filters.sort)

      const response = await api.get(`/products?${params.toString()}`)
      return response.data.data
    },
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Todos os Produtos
            </h1>
            <p className="text-gray-600">
              {data?.pagination.total || 0} produtos encontrados
            </p>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="input"
            >
              <option value="-createdAt">Mais Recentes</option>
              <option value="price">Menor Preço</option>
              <option value="-price">Maior Preço</option>
              <option value="-sales">Mais Vendidos</option>
              <option value="-rating.average">Melhor Avaliação</option>
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5 text-primary-600" />
                <h2 className="font-bold text-gray-900">Filtros</h2>
              </div>

              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <label className="label">Faixa de Preço</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) =>
                        setFilters({ ...filters, minPrice: e.target.value })
                      }
                      className="input"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        setFilters({ ...filters, maxPrice: e.target.value })
                      }
                      className="input"
                    />
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <label className="label">Condição</label>
                  <select
                    value={filters.condition}
                    onChange={(e) =>
                      setFilters({ ...filters, condition: e.target.value })
                    }
                    className="input"
                  >
                    <option value="">Todas</option>
                    <option value="new">Novo</option>
                    <option value="used">Usado</option>
                    <option value="refurbished">Recondicionado</option>
                  </select>
                </div>

                {/* Free Shipping */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.freeShipping}
                      onChange={(e) =>
                        setFilters({ ...filters, freeShipping: e.target.checked })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Frete Grátis
                    </span>
                  </label>
                </div>

                <button
                  onClick={() =>
                    setFilters({
                      category: '',
                      minPrice: '',
                      maxPrice: '',
                      condition: '',
                      freeShipping: false,
                      sort: '-createdAt',
                    })
                  }
                  className="btn-outline w-full"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : data?.products && data.products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.products.map((product: Product, index: number) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-600 mb-4">
                  Tente ajustar os filtros ou buscar por algo diferente
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


