'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, TrendingUp, ShieldCheck, Zap } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-200 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full mb-6">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Lançamento Especial</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Compre e venda
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">
                {' '}com inteligência
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-xl">
              A plataforma de e-commerce moderna que conecta compradores e vendedores 
              com tecnologia de ponta e experiência premium.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/produtos"
                className="btn-primary text-center text-lg px-8 py-4"
              >
                Explorar Produtos
              </Link>
              <Link
                href="/vender"
                className="btn-outline text-center text-lg px-8 py-4"
              >
                Quero Vender
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-2 text-primary-600 mb-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-2xl font-bold">10k+</span>
                </div>
                <p className="text-sm text-gray-600">Produtos</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-accent-600 mb-2">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-2xl font-bold">5k+</span>
                </div>
                <p className="text-sm text-gray-600">Vendedores</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <Search className="w-5 h-5" />
                  <span className="text-2xl font-bold">50k+</span>
                </div>
                <p className="text-sm text-gray-600">Usuários</p>
              </div>
            </div>
          </motion.div>

          {/* Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10">
              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-10 -left-4 w-48 h-32 bg-white rounded-2xl shadow-hard p-4"
              >
                <div className="w-full h-16 bg-gradient-to-br from-primary-200 to-primary-300 rounded-xl mb-2" />
                <div className="h-2 bg-gray-200 rounded w-3/4" />
                <div className="h-2 bg-gray-200 rounded w-1/2 mt-2" />
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute top-40 right-0 w-48 h-32 bg-white rounded-2xl shadow-hard p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full" />
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded w-full mb-1" />
                    <div className="h-2 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
                <div className="h-3 bg-primary-400 rounded w-1/2" />
              </motion.div>

              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute bottom-10 left-8 w-48 h-32 bg-white rounded-2xl shadow-hard p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-xs font-bold">
                    ✓
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded w-full" />
                  <div className="h-2 bg-gray-200 rounded w-3/4" />
                </div>
              </motion.div>

              {/* Main illustration placeholder */}
              <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-400 to-accent-500 rounded-3xl flex items-center justify-center mb-4">
                    <span className="text-6xl">🛍️</span>
                  </div>
                  <p className="text-gray-500 font-medium">E-commerce Moderno</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

