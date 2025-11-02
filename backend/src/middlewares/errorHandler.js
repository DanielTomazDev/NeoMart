export const errorHandler = (err, req, res, next) => {
  // Log detalhado do erro
  console.error('❌ Erro capturado:', {
    message: err.message,
    stack: err.stack,
    name: err.name,
    code: err.code,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  try {
    // Erro de validação do Mongoose
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Erro de validação',
        errors,
      });
    }

    // Erro de cast (ID inválido)
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID inválido',
      });
    }

    // Erro de duplicação (chave única)
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || 'campo';
      return res.status(400).json({
        success: false,
        message: `${field} já está em uso`,
      });
    }

    // Erro de JWT
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
      });
    }

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado',
      });
    }

    // Erro de conexão MongoDB
    if (err.name === 'MongoServerError' || err.name === 'MongooseError') {
      return res.status(503).json({
        success: false,
        message: 'Erro na conexão com o banco de dados',
        ...(process.env.NODE_ENV === 'development' && { error: err.message }),
      });
    }

    // Erro genérico
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Erro interno do servidor';

    res.status(statusCode).json({
      success: false,
      message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        error: err.toString(),
      }),
    });
  } catch (handlerError) {
    // Se o próprio error handler falhar, retorna erro genérico
    console.error('❌ Erro crítico no error handler:', handlerError);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
};

