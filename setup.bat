@echo off
REM Script de configuração inicial do Neomart para Windows
REM Execute com: setup.bat

echo.
echo 🚀 Iniciando configuração do Neomart...
echo.

REM Verificar Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js não encontrado. Por favor, instale Node.js 18+ primeiro.
    pause
    exit /b 1
)

echo ✅ Node.js detectado
node -v

REM Verificar MongoDB
where mongod >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  MongoDB não encontrado localmente.
    echo    Você pode usar MongoDB Atlas (cloud) como alternativa.
) else (
    echo ✅ MongoDB detectado
)

echo.
echo 📦 Instalando dependências...
echo.

REM Instalar dependências do backend
echo → Backend...
cd backend
if not exist ".env" (
    copy .env.development .env
    echo   ✓ Arquivo .env criado (configure-o antes de iniciar!)
)
call npm install
cd ..

REM Instalar dependências do frontend
echo → Frontend...
cd frontend
if not exist ".env.local" (
    copy .env.example .env.local
    echo   ✓ Arquivo .env.local criado
)
call npm install
cd ..

REM Instalar dependências da raiz
echo → Raiz...
call npm install

echo.
echo ✅ Instalação concluída!
echo.
echo 📝 Próximos passos:
echo.
echo 1. Configure o arquivo backend\.env com suas credenciais
echo    - MONGODB_URI (connection string do MongoDB)
echo    - JWT_SECRET (chave secreta para tokens)
echo.
echo 2. Inicie o MongoDB (se local):
echo    mongod
echo.
echo 3. Inicie a aplicação:
echo    npm run dev
echo.
echo 4. Acesse:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000/api
echo.
echo 📖 Para mais informações, veja INSTALACAO.md
echo.
echo 🎉 Bom desenvolvimento!
echo.
pause

