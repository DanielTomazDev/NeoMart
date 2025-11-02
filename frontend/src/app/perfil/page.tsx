'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { User, Mail, MapPin, Phone, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Meu Perfil</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-900">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === 'seller'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {user.role === 'seller' ? 'Vendedor' : 'Comprador'}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Membro desde {formatDate(user.createdAt)}</span>
                </div>
                {user.isVerified && (
                  <div className="flex items-center gap-2 text-green-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Conta Verificada</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <div className="card p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Informações Pessoais
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Nome Completo</label>
                  <div className="input bg-gray-50 flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-400" />
                    <span>{user.name}</span>
                  </div>
                </div>

                <div>
                  <label className="label">E-mail</label>
                  <div className="input bg-gray-50 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span>{user.email}</span>
                  </div>
                </div>

                {user.phone && (
                  <div>
                    <label className="label">Telefone</label>
                    <div className="input bg-gray-50 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span>{user.phone}</span>
                    </div>
                  </div>
                )}
              </div>

              <button className="btn-primary mt-6">Editar Perfil</button>
            </div>

            {/* Addresses */}
            <div className="card p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Endereços</h3>

              {user.addresses && user.addresses.length > 0 ? (
                <div className="space-y-4">
                  {user.addresses.map((address, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg flex items-start gap-3"
                    >
                      <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {address.street}, {address.number}
                        </p>
                        {address.complement && (
                          <p className="text-sm text-gray-600">{address.complement}</p>
                        )}
                        <p className="text-sm text-gray-600">
                          {address.neighborhood}, {address.city} - {address.state}
                        </p>
                        <p className="text-sm text-gray-600">CEP: {address.zipCode}</p>
                        {address.isDefault && (
                          <span className="inline-block mt-2 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded">
                            Endereço Padrão
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">Nenhum endereço cadastrado</p>
                  <button className="btn-primary">Adicionar Endereço</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


