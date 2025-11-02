'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Smartphone,
  Laptop,
  Watch,
  Headphones,
  Home,
  Shirt,
  BookOpen,
  Dumbbell,
} from 'lucide-react'

const categories = [
  { name: 'Eletrônicos', icon: Smartphone, color: 'from-blue-400 to-blue-600', slug: 'eletronicos' },
  { name: 'Computadores', icon: Laptop, color: 'from-purple-400 to-purple-600', slug: 'computadores' },
  { name: 'Acessórios', icon: Watch, color: 'from-pink-400 to-pink-600', slug: 'acessorios' },
  { name: 'Audio', icon: Headphones, color: 'from-green-400 to-green-600', slug: 'audio' },
  { name: 'Casa', icon: Home, color: 'from-yellow-400 to-yellow-600', slug: 'casa' },
  { name: 'Moda', icon: Shirt, color: 'from-red-400 to-red-600', slug: 'moda' },
  { name: 'Livros', icon: BookOpen, color: 'from-indigo-400 to-indigo-600', slug: 'livros' },
  { name: 'Esportes', icon: Dumbbell, color: 'from-orange-400 to-orange-600', slug: 'esportes' },
]

export function CategorySection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Explore por Categoria
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encontre exatamente o que você procura navegando por nossas categorias
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={`/categorias/${category.slug}`}
                  className="group block"
                >
                  <div className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-center font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/categorias"
            className="inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
          >
            Ver todas as categorias
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

