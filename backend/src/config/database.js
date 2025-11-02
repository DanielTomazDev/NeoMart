import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI não definida nas variáveis de ambiente');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Erro ao conectar MongoDB:`, {
      message: error.message,
      name: error.name,
      code: error.code,
    });
    
    // Em produção, não encerrar o processo imediatamente
    if (process.env.NODE_ENV === 'production') {
      console.error('⚠️ Tentando reconectar em 5 segundos...');
      setTimeout(() => connectDB(), 5000);
    } else {
      process.exit(1);
    }
  }
};

// Event listeners
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB desconectado');
  // Tentar reconectar
  if (process.env.MONGODB_URI) {
    console.log('🔄 Tentando reconectar...');
    setTimeout(() => connectDB(), 5000);
  }
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ Erro no MongoDB:`, {
    message: err.message,
    name: err.name,
    code: err.code,
  });
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconectado');
});

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB conectado com sucesso');
});

