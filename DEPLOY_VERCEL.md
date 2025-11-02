# 🚀 Deploy no Vercel - Neomart Frontend

## ✅ Correções Aplicadas

### **1. ESLint Configurado**
- ✅ Arquivo `.eslintrc.json` criado em `frontend/`
- ✅ Configuração do Next.js aplicada

### **2. Next.js Config Atualizado**
- ✅ Domínios de imagens adicionados
- ✅ ESLint e TypeScript configurados

---

## 🚀 Como Fazer Deploy no Vercel

### **Opção 1: Via GitHub (Recomendado)**

#### **Passo 1: Commitar as Correções**
```bash
git add .
git commit -m "fix: configurar ESLint para deploy no Vercel"
git push origin main
```

#### **Passo 2: Conectar ao Vercel**
1. Acesse: [https://vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique em **"New Project"**
4. Selecione o repositório: **NeoMart**
5. Clique em **"Import"**

#### **Passo 3: Configurar o Projeto**

**Framework Preset:** Next.js (detectado automaticamente)

**Root Directory:** Clique em **"Edit"** e selecione `frontend`

**Build Settings:**
```
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

**Environment Variables:**
```
NEXT_PUBLIC_API_URL = https://seu-backend-url.herokuapp.com/api
NEXT_PUBLIC_SOCKET_URL = https://seu-backend-url.herokuapp.com
```

#### **Passo 4: Deploy**
Clique em **"Deploy"**

Aguarde 2-3 minutos... ⏳

✅ **Deploy Concluído!** 

Você receberá um link: `https://neomart-xxx.vercel.app`

---

### **Opção 2: Via Vercel CLI**

#### **1. Instalar Vercel CLI**
```bash
npm install -g vercel
```

#### **2. Fazer Login**
```bash
vercel login
```

#### **3. Deploy**
```bash
cd frontend
vercel --prod
```

Siga as instruções no terminal.

---

## 🐛 Solução de Problemas

### **Erro: "ESLint Plugin Not Detected"**

✅ **RESOLVIDO!** Arquivo `.eslintrc.json` criado.

---

### **Erro: "Module not found"**

**Solução:**
Certifique-se que todas as dependências estão no `package.json`:
```bash
cd frontend
npm install
```

---

### **Erro: "Image Optimization"**

**Solução:**
Já configurado no `next.config.js`:
```javascript
images: {
  domains: ['localhost', 'res.cloudinary.com', 'via.placeholder.com'],
}
```

---

### **Erro: "Environment Variables"**

**Solução:**
1. No Vercel Dashboard
2. Vá em **Settings → Environment Variables**
3. Adicione:
   ```
   NEXT_PUBLIC_API_URL = URL do seu backend
   NEXT_PUBLIC_SOCKET_URL = URL do seu backend
   ```
4. Clique em **Redeploy**

---

## 🔗 Deploy do Backend

O frontend precisa do backend funcionando!

### **Opção 1: Heroku**

```bash
cd backend
heroku login
heroku create neomart-api
git push heroku main
```

**Configurar variáveis:**
```bash
heroku config:set MONGODB_URI="sua_connection_string"
heroku config:set JWT_SECRET="seu_secret"
heroku config:set FRONTEND_URL="https://neomart-xxx.vercel.app"
```

---

### **Opção 2: Render**

1. Acesse: [https://render.com](https://render.com)
2. Crie novo **Web Service**
3. Conecte seu repositório GitHub
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Adicione Environment Variables
6. Deploy!

---

### **Opção 3: Railway**

1. Acesse: [https://railway.app](https://railway.app)
2. **New Project → Deploy from GitHub repo**
3. Selecione NeoMart
4. Adicione serviço MongoDB
5. Configure variáveis
6. Deploy!

---

## 📊 Checklist de Deploy

### **Frontend (Vercel):**
- [ ] Código commitado no GitHub
- [ ] `.eslintrc.json` no frontend
- [ ] Root directory configurado para `frontend`
- [ ] Environment variables configuradas
- [ ] Deploy iniciado
- [ ] URL funcionando

### **Backend (Heroku/Render):**
- [ ] Código no GitHub
- [ ] MongoDB Atlas configurado
- [ ] Environment variables configuradas
- [ ] Deploy iniciado
- [ ] API respondendo

### **Integração:**
- [ ] Frontend aponta para backend em produção
- [ ] CORS configurado no backend
- [ ] Testes realizados

---

## 🎯 URLs Finais

Após deploy completo:

- **Frontend:** `https://neomart-xxx.vercel.app`
- **Backend:** `https://neomart-api-xxx.herokuapp.com`
- **API:** `https://neomart-api-xxx.herokuapp.com/api/health`

---

## 🔄 Redeploy Automático

Cada vez que você fizer push para GitHub:
```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

✨ **Vercel redeploya automaticamente!**

---

## 💡 Dicas Pro

### **1. Preview Deployments**
Crie uma branch para testar:
```bash
git checkout -b feature/nova-funcionalidade
git push origin feature/nova-funcionalidade
```

Vercel cria preview deployment automaticamente!

### **2. Domínio Customizado**
No Vercel Dashboard:
1. **Settings → Domains**
2. Adicione seu domínio
3. Configure DNS

### **3. Analytics**
Ative no Vercel Dashboard:
- **Analytics** para métricas
- **Speed Insights** para performance

---

## 🎉 Pronto!

Seu Neomart estará disponível em:
**https://neomart-xxx.vercel.app**

Compartilhe com o mundo! 🌎

---

## 📞 Problemas?

Se o deploy falhar:

1. Veja os logs no Vercel Dashboard
2. Verifique se o build local funciona:
   ```bash
   cd frontend
   npm run build
   npm start
   ```
3. Teste em: `http://localhost:3000`

---

**🚀 Bom deploy!**

