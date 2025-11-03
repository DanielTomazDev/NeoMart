'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Camera,
  HelpCircle,
  ChevronDown,
  Menu,
  X,
  ShoppingCart,
  User,
  Heart,
  Package,
  LogOut,
  LayoutDashboard,
  Globe,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import { cn } from '@/lib/utils'

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showCatalogDropdown, setShowCatalogDropdown] = useState(false)
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { user, isAuthenticated, logout } = useAuthStore()
  const { getItemCount } = useCartStore()
  const cartCount = getItemCount()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleLogout = async () => {
    await logout()
    setShowUserMenu(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/produtos?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300 bg-white border-b border-gray-200'
      )}
    >
      <div className="container-custom">
        {/* Main Header */}
        <div className="flex items-center justify-between py-4 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl lg:text-3xl font-bold text-teal-500">
              Neomart
            </span>
          </Link>

          {/* Search Bar - Centralized */}
          <form onSubmit={handleSearch} className="flex-grow max-w-2xl hidden md:flex">
            <div className="relative flex items-center bg-gray-100 rounded-lg overflow-hidden">
              {/* Catalog Dropdown */}
              <button
                type="button"
                onClick={() => setShowCatalogDropdown(!showCatalogDropdown)}
                className="flex items-center gap-1 px-4 py-3 border-r border-gray-300 hover:bg-gray-200 transition-colors text-sm font-medium text-gray-700"
              >
                Catálogo
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Search Input */}
              <div className="flex items-center flex-1 px-4">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar artigos"
                  className="flex-1 bg-transparent border-0 outline-none text-gray-900 placeholder-gray-400 text-sm"
                />
              </div>

              {/* Camera Icon */}
              <button
                type="button"
                className="p-3 hover:bg-gray-200 transition-colors"
                title="Busca por imagem"
              >
                <Camera className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Catalog Dropdown Menu */}
            <AnimatePresence>
              {showCatalogDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowCatalogDropdown(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                  >
                    <div className="py-2">
                      <Link
                        href="/categorias"
                        className="block px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                        onClick={() => setShowCatalogDropdown(false)}
                      >
                        Ver todas as categorias
                      </Link>
                      <Link
                        href="/produtos"
                        className="block px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                        onClick={() => setShowCatalogDropdown(false)}
                      >
                        Todos os produtos
                      </Link>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Auth Buttons */}
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  Criar conta | Iniciar sessão
                </Link>
                <Link
                  href="/cadastro?vendedor=true"
                  className="px-4 py-2 text-sm font-semibold text-white bg-teal-500 hover:bg-teal-600 rounded-lg transition-colors whitespace-nowrap"
                >
                  Vender agora
                </Link>
              </>
            ) : (
              <>
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
                      className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-medium">
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowUserMenu(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
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
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}

            {/* Help Icon */}
            <Link
              href="/ajuda"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Ajuda"
            >
              <HelpCircle className="w-5 h-5 text-gray-600" />
            </Link>

            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium text-gray-700"
              >
                PT
              </button>

              <AnimatePresence>
                {showLangDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowLangDropdown(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                    >
                      <div className="py-2">
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">
                          Português
                        </button>
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">
                          English
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
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
          <form onSubmit={handleSearch} className="relative">
            <div className="relative flex items-center bg-gray-100 rounded-lg">
              <Search className="w-5 h-5 text-gray-400 ml-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar artigos"
                className="flex-1 px-4 py-3 bg-transparent border-0 outline-none text-gray-900 placeholder-gray-400 text-sm"
              />
              <button
                type="button"
                className="p-3 hover:bg-gray-200 transition-colors"
              >
                <Camera className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </form>
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
              {!isAuthenticated && (
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Iniciar sessão
                  </Link>
                  <Link
                    href="/cadastro"
                    className="block px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Criar conta
                  </Link>
                </>
              )}
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
