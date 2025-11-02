import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'
import api from '@/lib/api'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  updateUser: (data: Partial<User>) => void
  checkAuth: () => Promise<void>
}

interface RegisterData {
  name: string
  email: string
  password: string
  role?: 'buyer' | 'seller'
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true })
          const response = await api.post('/auth/login', { email, password })
          const { user, token, refreshToken } = response.data.data

          localStorage.setItem('token', token)
          localStorage.setItem('refreshToken', refreshToken)

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (data: RegisterData) => {
        try {
          set({ isLoading: true })
          const response = await api.post('/auth/register', data)
          const { user, token, refreshToken } = response.data.data

          localStorage.setItem('token', token)
          localStorage.setItem('refreshToken', refreshToken)

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout')
        } catch (error) {
          console.error('Erro ao fazer logout:', error)
        } finally {
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          })
        }
      },

      updateUser: (data: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...data } })
        }
      },

      checkAuth: async () => {
        try {
          const token = localStorage.getItem('token')
          if (!token) {
            set({ isAuthenticated: false, user: null })
            return
          }

          const response = await api.get('/auth/me')
          set({
            user: response.data.data,
            token,
            isAuthenticated: true,
          })
        } catch (error) {
          console.error('Erro ao verificar autenticação:', error)
          set({ isAuthenticated: false, user: null })
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

