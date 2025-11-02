/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'via.placeholder.com'],
    formats: ['image/avif', 'image/webp'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000',
  },
  eslint: {
    // Aviso: Isso permite que o build de produção complete mesmo com erros de ESLint
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Aviso: Isso permite que o build de produção complete mesmo com erros de TypeScript
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig

