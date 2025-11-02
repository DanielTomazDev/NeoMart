'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  Package,
  LogOut,
  LayoutDashboard,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import { cn } from '@/lib/utils'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const pathname = usePathname()

  const { user, isAuthenticated, logout } = useAuthStore()
  const { getItemCount } = useCartStore()
  const cartCount = getItemCount()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    setShowUserMenu(false)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white shadow-md'
          : 'bg-white/95 backdrop-blur-sm'
      )}
    >
      <div className="container-custom">
        {/* Top Bar */}
        <div className="hidden md:flex items-center justify-between py-2 text-sm border-b border-gray-100">
          <div className="flex items-center gap-4 text-gray-600">
            <span>📦 Frete grátis a partir de R$ 99</span>
            <span className="text-gray-300">|</span>
            <span>🔒 Compra 100% segura</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/ajuda"
              className="hover:text-primary-500 transition-colors"
            >
              Ajuda
            </Link>
            {isAuthenticated && user?.role === 'seller' && (
              <Link
                href="/vendedor"
                className="hover:text-primary-500 transition-colors font-medium"
              >
                Vender
              </Link>
            )}
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-4 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">N</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 hidden sm:block">
              Neomart
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-grow max-w-2xl hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar produtos, marcas e muito mais..."
                className="w-full pl-4 pr-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors">
                <Search className="w-5 h-5 text-gray-900" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Cart */}
            <Link
              href="/carrinho"
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-gray-900 rounded-full flex items-center justify-center text-xs font-bold"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-white font-medium">
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {user?.name.split(' ')[0]}
                    </span>
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-hard overflow-hidden"
                      >
                        <div className="p-4 border-b border-gray-100">
                          <p className="font-medium text-gray-900">{user?.name}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                        <div className="py-2">
                          <Link
                            href="/perfil"
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <User className="w-4 h-4" />
                            <span>Meu Perfil</span>
                          </Link>
                          <Link
                            href="/pedidos"
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Package className="w-4 h-4" />
                            <span>Meus Pedidos</span>
                          </Link>
                          <Link
                            href="/favoritos"
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Heart className="w-4 h-4" />
                            <span>Favoritos</span>
                          </Link>
                          {user?.role === 'seller' && (
                            <Link
                              href="/vendedor"
                              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <LayoutDashboard className="w-4 h-4" />
                              <span>Painel do Vendedor</span>
                            </Link>
                          )}
                          {user?.role === 'admin' && (
                            <Link
                              href="/admin"
                              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <LayoutDashboard className="w-4 h-4" />
                              <span>Admin</span>
                            </Link>
                          )}
                        </div>
                        <div className="border-t border-gray-100 py-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors w-full text-red-600"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sair</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-500 transition-colors"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/cadastro"
                    className="px-4 py-2 text-sm font-medium bg-primary-500 text-gray-900 rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="w-full pl-4 pr-12 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary-500 rounded-lg">
              <Search className="w-4 h-4 text-gray-900" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-gray-200 bg-white overflow-hidden"
          >
            <div className="container-custom py-4 space-y-2">
              <Link
                href="/categorias"
                className="block px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Categorias
              </Link>
              <Link
                href="/ofertas"
                className="block px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Ofertas
              </Link>
              <Link
                href="/ajuda"
                className="block px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Ajuda
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

