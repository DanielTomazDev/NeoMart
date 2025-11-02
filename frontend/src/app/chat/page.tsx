'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send, MessageCircle } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { socketService } from '@/lib/socket'
import { formatRelativeTime } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface Message {
  _id: string
  sender: {
    _id: string
    name: string
    avatar?: string
  }
  content: string
  createdAt: string
}

export default function ChatPage() {
  const router = useRouter()
  const { user, isAuthenticated, token } = useAuthStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (!token) return

    // Connect to socket
    const socket = socketService.connect(token)
    setIsConnected(socket.connected)

    // Listen for messages
    socketService.on('message:received', ({ message }) => {
      setMessages((prev) => [...prev, message])
    })

    socketService.on('connect', () => {
      setIsConnected(true)
    })

    socketService.on('disconnect', () => {
      setIsConnected(false)
    })

    return () => {
      socketService.off('message:received')
      socketService.off('connect')
      socketService.off('disconnect')
    }
  }, [isAuthenticated, token, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || !user) return

    // Emit message via socket
    socketService.emit('message:send', {
      conversationId: 'demo-conversation',
      recipientId: 'demo-recipient',
      content: inputMessage,
    })

    // Add to local state (optimistic update)
    setMessages((prev) => [
      ...prev,
      {
        _id: Date.now().toString(),
        sender: {
          _id: user._id,
          name: user.name,
          avatar: user.avatar,
        },
        content: inputMessage,
        createdAt: new Date().toISOString(),
      },
    ])

    setInputMessage('')
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          <div className="card overflow-hidden h-[calc(100vh-12rem)]">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-white font-bold">
                    V
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Chat de Suporte</h2>
                    <p className="text-sm text-gray-600">
                      {isConnected ? (
                        <span className="text-green-600">● Online</span>
                      ) : (
                        <span className="text-gray-400">● Offline</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma mensagem ainda
                  </h3>
                  <p className="text-gray-600">
                    Envie uma mensagem para começar a conversa
                  </p>
                </div>
              ) : (
                messages.map((message) => {
                  const isOwn = message.sender._id === user?._id
                  return (
                    <motion.div
                      key={message._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md ${
                          isOwn
                            ? 'bg-primary-500 text-gray-900'
                            : 'bg-white text-gray-900'
                        } rounded-2xl p-4 shadow-sm`}
                      >
                        {!isOwn && (
                          <p className="text-xs font-medium mb-1">
                            {message.sender.name}
                          </p>
                        )}
                        <p className="break-words">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isOwn ? 'text-gray-700' : 'text-gray-500'
                          }`}
                        >
                          {formatRelativeTime(message.createdAt)}
                        </p>
                      </div>
                    </motion.div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="input flex-1"
                  disabled={!isConnected}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || !isConnected}
                  className="btn-primary px-6"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
              {!isConnected && (
                <p className="text-xs text-red-600 mt-2">
                  ⚠️ Desconectado. Tentando reconectar...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

