# 🛍️ Neomart - Plataforma de E-commerce Moderna

Uma plataforma de e-commerce completa e moderna, inspirada no Mercado Livre, com identidade própria e recursos premium.

## 🎯 Visão Geral

Neomart é uma plataforma full-stack de e-commerce que oferece uma experiência premium para compradores e vendedores, com recursos avançados de busca, recomendações inteligentes, chat em tempo real e painel administrativo completo.

## ✨ Funcionalidades Principais

### 🛍️ Para Compradores
- **Catálogo Avançado**: Listagem dinâmica com paginação e filtros inteligentes
- **Busca Inteligente**: Autocomplete em tempo real com sugestões personalizadas
- **Carrinho Inteligente**: Persistência e cálculo automático de frete
- **Checkout Completo**: Processo em etapas com múltiplas formas de pagamento
- **Histórico de Pedidos**: Acompanhamento completo de compras
- **Sistema de Avaliações**: Avalie produtos e vendedores
- **Chat em Tempo Real**: Comunicação direta com vendedores

### 🏪 Para Vendedores
- **Painel de Gestão**: CRUD completo de produtos
- **Controle de Estoque**: Gerenciamento em tempo real
- **Gestão de Pedidos**: Acompanhamento e atualização de status
- **Análise de Vendas**: Gráficos e relatórios detalhados
- **Comunicação**: Chat integrado com compradores

### 👨‍💼 Para Administradores
- **Dashboard Completo**: Métricas de vendas, usuários e produtos
- **Gestão de Categorias**: CRUD de categorias e subcategorias
- **Controle de Usuários**: Moderação e gerenciamento
- **Relatórios**: Análises detalhadas de performance

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Framer Motion** - Animações suaves
- **Zustand** - Gerenciamento de estado
- **React Query** - Cache e sincronização de dados
- **Axios** - Cliente HTTP
- **Socket.io Client** - WebSocket para chat

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação via tokens
- **bcrypt** - Hash de senhas
- **Socket.io** - WebSocket para comunicação real-time
- **Express Validator** - Validação de dados
- **Multer** - Upload de imagens

### DevOps & Tools
- **Docker** - Containerização
- **ESLint** - Linter
- **Prettier** - Formatação de código
- **Husky** - Git hooks
- **Jest** - Testes

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- **MongoDB** - Escolha uma opção:
  - 🌐 **MongoDB Atlas (Recomendado)** - Gratuito, na nuvem
    - 📖 [Guia Completo: MONGODB_ATLAS.md](MONGODB_ATLAS.md)
    - ⚡ [Quick Start: QUICK_START_ATLAS.md](QUICK_START_ATLAS.md)
  - 💻 **MongoDB Local** - Instalar na sua máquina
- NPM ou Yarn

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd neomart
```

2. **Configure o MongoDB**

   **Opção A: MongoDB Atlas (Recomendado para começar)**
   
   Siga o guia rápido: [QUICK_START_ATLAS.md](QUICK_START_ATLAS.md)
   
   Resumo:
   - Crie conta grátis em [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Crie um cluster M0 (FREE)
   - Copie a connection string
   - Cole no arquivo `.env`

   **Opção B: MongoDB Local**
   ```bash
   # Instale e inicie o MongoDB na sua máquina
   mongod
   ```

3. **Configure o Backend**
```bash
cd backend
npm install
cp .env.development .env
# Edite o arquivo .env com suas credenciais MongoDB
npm run dev
```

4. **Configure o Frontend**
```bash
cd frontend
npm install
cp .env.example .env.local
# Configure as variáveis de ambiente no arquivo .env.local
npm run dev
```

5. **Acesse a aplicação**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Instalação Rápida (Scripts Automáticos)

**Windows:**
```bash
setup.bat
```

**Linux/macOS:**
```bash
chmod +x setup.sh
./setup.sh
```

### Com Docker

```bash
docker-compose up -d
```

> ⚠️ **Nota:** O Docker usa MongoDB local. Para usar Atlas, edite o `docker-compose.yml`

## 📁 Estrutura do Projeto

```
neomart/
├── frontend/                # Aplicação Next.js
│   ├── src/
│   │   ├── app/            # Pages (App Router)
│   │   ├── components/     # Componentes React
│   │   ├── lib/            # Utilitários e configurações
│   │   ├── hooks/          # Custom hooks
│   │   ├── store/          # Zustand stores
│   │   ├── types/          # TypeScript types
│   │   └── styles/         # Estilos globais
│   └── public/             # Arquivos estáticos
│
├── backend/                # API Node.js
│   ├── src/
│   │   ├── config/         # Configurações
│   │   ├── controllers/    # Controllers
│   │   ├── models/         # Modelos Mongoose
│   │   ├── routes/         # Rotas da API
│   │   ├── middleware/     # Middlewares
│   │   ├── services/       # Lógica de negócio
│   │   ├── utils/          # Utilitários
│   │   └── types/          # TypeScript types
│   └── uploads/            # Uploads de imagens
│
└── docker-compose.yml      # Configuração Docker
```

## 🎨 Design System

### Paleta de Cores
- **Primary**: Amarelo suave (#FFD93D)
- **Secondary**: Azul acinzentado (#6C7A89)
- **Accent**: Azul vibrante (#4169E1)
- **Background**: Branco puro (#FFFFFF)
- **Text**: Cinza escuro (#2C3E50)

### Tipografia
- **Headings**: Inter Bold
- **Body**: Inter Regular
- **Monospace**: JetBrains Mono

## 🔐 Segurança

- Senhas hash com bcrypt (salt rounds: 10)
- Autenticação JWT com refresh tokens
- Validação de dados no backend
- Proteção contra XSS e CSRF
- CORS configurado corretamente
- Rate limiting em rotas sensíveis
- Sanitização de inputs

## 📊 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

### Produtos
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Detalhes do produto
- `POST /api/products` - Criar produto (vendedor)
- `PUT /api/products/:id` - Atualizar produto (vendedor)
- `DELETE /api/products/:id` - Deletar produto (vendedor)

### Pedidos
- `GET /api/orders` - Listar pedidos do usuário
- `GET /api/orders/:id` - Detalhes do pedido
- `POST /api/orders` - Criar pedido
- `PUT /api/orders/:id` - Atualizar status (vendedor)

### Usuários
- `GET /api/users/profile` - Perfil do usuário
- `PUT /api/users/profile` - Atualizar perfil
- `GET /api/users/:id` - Perfil público

### Chat
- `GET /api/messages/:conversationId` - Mensagens da conversa
- `POST /api/messages` - Enviar mensagem
- `WebSocket /socket.io` - Comunicação em tempo real

## 📚 Documentação Adicional

- 📖 **[INSTALACAO.md](INSTALACAO.md)** - Guia detalhado de instalação
- 🍃 **[MONGODB_ATLAS.md](MONGODB_ATLAS.md)** - Configurar MongoDB Atlas (cloud)
- ⚡ **[QUICK_START_ATLAS.md](QUICK_START_ATLAS.md)** - MongoDB Atlas em 5 minutos
- 💻 **[COMANDOS.md](COMANDOS.md)** - Comandos úteis para desenvolvimento
- 📋 **[RESUMO.md](RESUMO.md)** - Resumo técnico do projeto
- 📦 **[ENTREGA.md](ENTREGA.md)** - Documento de entrega completo

## 🧪 Testes

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📦 Deploy

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Render/Heroku)
```bash
cd backend
git push heroku main
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com 💛 para demonstrar habilidades full-stack modernas.

## 🙏 Agradecimentos

- Inspiração: Mercado Livre
- Icons: Heroicons
- Illustrations: undraw.co

---

**Neomart** - E-commerce do futuro, disponível hoje. 🚀
