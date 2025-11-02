import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Neomart - E-commerce Moderno',
  description: 'Plataforma completa de e-commerce com recursos premium',
  keywords: ['ecommerce', 'compras', 'vendas', 'marketplace'],
  authors: [{ name: 'Neomart Team' }],
  openGraph: {
    title: 'Neomart - E-commerce Moderno',
    description: 'Plataforma completa de e-commerce com recursos premium',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#333',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
              },
              success: {
                iconTheme: {
                  primary: '#FFD93D',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}

