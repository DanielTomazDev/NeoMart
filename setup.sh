#!/bin/bash

# Script de configuração inicial do Neomart
# Execute com: bash setup.sh

echo "🚀 Iniciando configuração do Neomart..."
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js 18+ primeiro."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js versão 18+ é necessária. Versão atual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Verificar MongoDB
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB não encontrado localmente."
    echo "   Você pode:"
    echo "   1. Instalar MongoDB localmente"
    echo "   2. Usar MongoDB Atlas (cloud)"
    read -p "   Continuar sem MongoDB local? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ MongoDB detectado"
fi

echo ""
echo "📦 Instalando dependências..."
echo ""

# Instalar dependências do backend
echo "→ Backend..."
cd backend
if [ ! -f ".env" ]; then
    cp .env.development .env
    echo "  ✓ Arquivo .env criado (configure-o antes de iniciar!)"
fi
npm install
cd ..

# Instalar dependências do frontend
echo "→ Frontend..."
cd frontend
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    echo "  ✓ Arquivo .env.local criado"
fi
npm install
cd ..

# Instalar dependências da raiz
echo "→ Raiz..."
npm install

echo ""
echo "✅ Instalação concluída!"
echo ""
echo "📝 Próximos passos:"
echo ""
echo "1. Configure o arquivo backend/.env com suas credenciais"
echo "   - MONGODB_URI (connection string do MongoDB)"
echo "   - JWT_SECRET (chave secreta para tokens)"
echo ""
echo "2. Inicie o MongoDB (se local):"
echo "   mongod"
echo ""
echo "3. Inicie a aplicação:"
echo "   npm run dev"
echo ""
echo "4. Acesse:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000/api"
echo ""
echo "📖 Para mais informações, veja INSTALACAO.md"
echo ""
echo "🎉 Bom desenvolvimento!"

