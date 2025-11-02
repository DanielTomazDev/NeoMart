'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, Youtube, Mail } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">N</span>
              </div>
              Neomart
            </h3>
            <p className="text-gray-300 mb-4">
              Sua plataforma de e-commerce moderna e completa. Compre e venda com segurança e confiança.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-primary-500 rounded-lg transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-primary-500 rounded-lg transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-primary-500 rounded-lg transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-primary-500 rounded-lg transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="font-bold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/sobre" className="hover:text-primary-400 transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/como-funciona" className="hover:text-primary-400 transition-colors">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="hover:text-primary-400 transition-colors">
                  Categorias
                </Link>
              </li>
              <li>
                <Link href="/ofertas" className="hover:text-primary-400 transition-colors">
                  Ofertas
                </Link>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h4 className="font-bold mb-4">Suporte</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/ajuda" className="hover:text-primary-400 transition-colors">
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link href="/devolucoes" className="hover:text-primary-400 transition-colors">
                  Devoluções
                </Link>
              </li>
              <li>
                <Link href="/rastreamento" className="hover:text-primary-400 transition-colors">
                  Rastrear Pedido
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-primary-400 transition-colors">
                  Fale Conosco
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold mb-4">Newsletter</h4>
            <p className="text-gray-300 mb-4">
              Receba ofertas exclusivas e novidades!
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary-500 text-white"
              />
              <button className="p-2 bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors">
                <Mail className="w-5 h-5 text-gray-900" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} Neomart. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/termos" className="hover:text-primary-400 transition-colors">
                Termos de Uso
              </Link>
              <Link href="/privacidade" className="hover:text-primary-400 transition-colors">
                Privacidade
              </Link>
              <Link href="/cookies" className="hover:text-primary-400 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

