import logger from '../utils/logger.js';

/**
 * Middleware para loggear todas las requests HTTP
 * Registra método, URL, IP, duración y status code
 */
export const requestLogger = (req, res, next) => {
  // Registrar tiempo de inicio
  const start = Date.now();

  // Capturar el método res.json original
  const originalJson = res.json.bind(res);

  // Sobrescribir res.json para capturar la respuesta
  res.json = function (body) {
    // Calcular duración
    const duration = Date.now() - start;

    // Log de la request
    logger.info('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id || 'anonymous',
    });

    // Llamar al json original
    return originalJson(body);
  };

  next();
};

export default requestLogger;
