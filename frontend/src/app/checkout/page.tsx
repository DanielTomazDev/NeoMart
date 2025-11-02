'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  CreditCard,
  MapPin,
  Package,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import toast from 'react-hot-toast'
import api from '@/lib/api'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)

  const [formData, setFormData] = useState({
    // Address
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    // Payment
    paymentMethod: 'credit_card',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
  })

  const subtotal = getTotal()
  const shipping = subtotal > 99 ? 0 : 15
  const total = subtotal + shipping

  if (!isAuthenticated) {
    router.push('/login')
    return null
  }

  if (items.length === 0) {
    router.push('/carrinho')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step < 3) {
      setStep(step + 1)
      return
    }

    setIsProcessing(true)

    try {
      // Create order
      const orderData = {
        items: items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shippingAddress: {
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        paymentMethod: formData.paymentMethod,
        subtotal,
        shippingCost: shipping,
        total,
      }

      await api.post('/orders', orderData)

      clearCart()
      toast.success('Pedido realizado com sucesso!')
      router.push('/pedidos')
    } catch (error) {
      toast.error('Erro ao processar pedido')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <Link
          href="/carrinho"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar ao Carrinho
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Finalizar Compra
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {/* Steps */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                      step >= s
                        ? 'bg-primary-500 text-gray-900'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step > s ? <CheckCircle className="w-6 h-6" /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-colors ${
                        step > s ? 'bg-primary-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Address */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card p-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-6 h-6 text-primary-500" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      Endereço de Entrega
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="label">CEP</label>
                      <input
                        type="text"
                        required
                        value={formData.zipCode}
                        onChange={(e) =>
                          setFormData({ ...formData, zipCode: e.target.value })
                        }
                        className="input"
                        placeholder="00000-000"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="label">Rua</label>
                      <input
                        type="text"
                        required
                        value={formData.street}
                        onChange={(e) =>
                          setFormData({ ...formData, street: e.target.value })
                        }
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Número</label>
                      <input
                        type="text"
                        required
                        value={formData.number}
                        onChange={(e) =>
                          setFormData({ ...formData, number: e.target.value })
                        }
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Complemento</label>
                      <input
                        type="text"
                        value={formData.complement}
                        onChange={(e) =>
                          setFormData({ ...formData, complement: e.target.value })
                        }
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Bairro</label>
                      <input
                        type="text"
                        required
                        value={formData.neighborhood}
                        onChange={(e) =>
                          setFormData({ ...formData, neighborhood: e.target.value })
                        }
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Cidade</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className="input"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="label">Estado</label>
                      <select
                        required
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        className="input"
                      >
                        <option value="">Selecione</option>
                        <option value="SP">São Paulo</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="MG">Minas Gerais</option>
                        {/* Add more states */}
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary w-full mt-6">
                    Continuar para Pagamento
                  </button>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card p-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="w-6 h-6 text-primary-500" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      Forma de Pagamento
                    </h2>
                  </div>

                  <div className="space-y-4 mb-6">
                    <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="credit_card"
                        checked={formData.paymentMethod === 'credit_card'}
                        onChange={(e) =>
                          setFormData({ ...formData, paymentMethod: e.target.value })
                        }
                        className="w-4 h-4"
                      />
                      <span className="font-medium">Cartão de Crédito</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="pix"
                        checked={formData.paymentMethod === 'pix'}
                        onChange={(e) =>
                          setFormData({ ...formData, paymentMethod: e.target.value })
                        }
                        className="w-4 h-4"
                      />
                      <span className="font-medium">PIX</span>
                    </label>
                  </div>

                  {formData.paymentMethod === 'credit_card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="label">Número do Cartão</label>
                        <input
                          type="text"
                          required
                          value={formData.cardNumber}
                          onChange={(e) =>
                            setFormData({ ...formData, cardNumber: e.target.value })
                          }
                          className="input"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div>
                        <label className="label">Nome no Cartão</label>
                        <input
                          type="text"
                          required
                          value={formData.cardName}
                          onChange={(e) =>
                            setFormData({ ...formData, cardName: e.target.value })
                          }
                          className="input"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="label">Validade</label>
                          <input
                            type="text"
                            required
                            value={formData.cardExpiry}
                            onChange={(e) =>
                              setFormData({ ...formData, cardExpiry: e.target.value })
                            }
                            className="input"
                            placeholder="MM/AA"
                          />
                        </div>
                        <div>
                          <label className="label">CVV</label>
                          <input
                            type="text"
                            required
                            value={formData.cardCvv}
                            onChange={(e) =>
                              setFormData({ ...formData, cardCvv: e.target.value })
                            }
                            className="input"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn-outline flex-1"
                    >
                      Voltar
                    </button>
                    <button type="submit" className="btn-primary flex-1">
                      Revisar Pedido
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card p-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Package className="w-6 h-6 text-primary-500" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      Revisar Pedido
                    </h2>
                  </div>

                  {/* Review sections */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">
                        Endereço de Entrega
                      </h3>
                      <p className="text-gray-600">
                        {formData.street}, {formData.number}
                        {formData.complement && `, ${formData.complement}`}
                        <br />
                        {formData.neighborhood}, {formData.city} - {formData.state}
                        <br />
                        CEP: {formData.zipCode}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">
                        Forma de Pagamento
                      </h3>
                      <p className="text-gray-600">
                        {formData.paymentMethod === 'credit_card'
                          ? 'Cartão de Crédito'
                          : 'PIX'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn-outline flex-1"
                      disabled={isProcessing}
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      className="btn-primary flex-1"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mr-2" />
                          Processando...
                        </>
                      ) : (
                        'Finalizar Compra'
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          </div>

          {/* Summary */}
          <div>
            <div className="card p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Resumo
              </h3>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.product._id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.images?.[0] ? (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          📦
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.product.title}
                      </p>
                      <p className="text-xs text-gray-600">
                        Qtd: {item.quantity}
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frete</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Grátis</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

