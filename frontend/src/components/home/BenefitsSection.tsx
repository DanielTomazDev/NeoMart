'use client'

import { motion } from 'framer-motion'
import { Truck, Shield, CreditCard, Headphones } from 'lucide-react'

const benefits = [
  {
    icon: Truck,
    title: 'Frete Grátis',
    description: 'Em compras acima de R$ 99 para todo o Brasil',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: Shield,
    title: 'Compra Segura',
    description: 'Seus dados protegidos com criptografia de ponta',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: CreditCard,
    title: 'Múltiplas Formas de Pagamento',
    description: 'Cartão, boleto, Pix e parcelamento sem juros',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: Headphones,
    title: 'Suporte 24/7',
    description: 'Atendimento sempre disponível para te ajudar',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
]

export function BenefitsSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="text-center"
              >
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${benefit.bg} flex items-center justify-center`}
                >
                  <Icon className={`w-8 h-8 ${benefit.color}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

