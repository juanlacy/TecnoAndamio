import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';
import logger from './utils/logger.js';

const app = express();

// ======================
// MIDDLEWARES DE SEGURIDAD
// ======================

// Helmet - Headers de seguridad HTTP
app.use(helmet());

// CORS - Permitir requests desde el frontend
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate Limiting - Protección contra DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 requests por ventana
  message: 'Demasiadas solicitudes desde esta IP, por favor intente más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ======================
// MIDDLEWARES DE PARSING
// ======================

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Morgan - HTTP request logger (solo en desarrollo)
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// ======================
// RUTAS
// ======================

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TecnoAndamios API funcionando correctamente',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenido a TecnoAndamios API',
    version: '1.0.0',
    documentation: '/api/v1/docs',
  });
});

// TODO: Importar y usar rutas de la API
// import routes from './routes/index.js';
// app.use('/api/v1', routes);

// ======================
// MANEJO DE ERRORES
// ======================

// Ruta no encontrada (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Ruta ${req.method} ${req.path} no encontrada`,
    },
  });
});

// Error handler global
// TODO: Importar y usar errorHandler middleware
// app.use(errorHandler);

// ======================
// INICIAR SERVIDOR
// ======================

const PORT = config.port;

const startServer = async () => {
  try {
    // TODO: Verificar conexión a la base de datos
    // await sequelize.authenticate();
    // logger.info('✅ Conexión a MySQL establecida correctamente');

    app.listen(PORT, () => {
      logger.info(`🚀 Servidor corriendo en puerto ${PORT}`);
      logger.info(`📝 Ambiente: ${config.nodeEnv}`);
      logger.info(`🌐 Frontend URL: ${config.frontendUrl}`);
      logger.info(`💾 Base de datos: ${config.db.name}@${config.db.host}:${config.db.port}`);
    });
  } catch (error) {
    logger.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  logger.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Iniciar servidor
startServer();

export default app;
