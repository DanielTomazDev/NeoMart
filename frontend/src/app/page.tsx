'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Camera, HelpCircle, Globe, Menu, X, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/auth'

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [showCatalogDropdown, setShowCatalogDropdown] = useState(false)
  const { isAuthenticated, user } = useAuthStore()

  const categories = [
    'Mulher',
    'Homem',
    'Peças de estilista',
    'Criança',
    'Casa',
    'Eletrónica',
    'Entretenimento',
    'Hobbies e Coleções',
    'Desporto',
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/produtos?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full Width */}
      <div className="relative w-full h-[calc(100vh-140px)] min-h-[600px] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Promotional Card - Left Side */}
        <div className="relative h-full container-custom flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md bg-white rounded-2xl shadow-2xl p-8 lg:p-10"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Pronto para organizar seu guarda-roupa?
            </h1>
            <Link
              href="/cadastro?vendedor=true"
              className="inline-block w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-colors text-center mb-4"
            >
              Vender agora
            </Link>
            <Link
              href="/como-funciona"
              className="block text-teal-600 hover:text-teal-700 font-medium transition-colors"
            >
              Descubra como funciona
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Categories Section - Below Hero */}
      <div className="bg-white border-b border-gray-200 sticky top-[140px] z-40">
        <div className="container-custom">
          <div className="flex items-center gap-6 overflow-x-auto py-4 hide-scrollbar">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/categorias?q=${encodeURIComponent(category.toLowerCase())}`}
                className="flex-shrink-0 text-sm font-medium text-gray-900 hover:text-teal-600 transition-colors whitespace-nowrap"
              >
                {category}
              </Link>
            ))}
            <Link
              href="/sobre"
              className="flex-shrink-0 text-sm font-medium text-gray-900 hover:text-teal-600 transition-colors whitespace-nowrap ml-4"
            >
              Sobre
            </Link>
            <Link
              href="/como-funciona"
              className="flex-shrink-0 text-sm font-medium text-gray-900 hover:text-teal-600 transition-colors whitespace-nowrap"
            >
              A nossa Plataforma
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
