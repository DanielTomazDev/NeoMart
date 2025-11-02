'use client'

import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { CategorySection } from '@/components/home/CategorySection'
import { BenefitsSection } from '@/components/home/BenefitsSection'
import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CategorySection />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <FeaturedProducts />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <BenefitsSection />
      </motion.div>
    </div>
  )
}

