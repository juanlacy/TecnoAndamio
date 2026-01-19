import logger from '../utils/logger.js';
import { errorResponse } from '../utils/response.js';

/**
 * Middleware global para manejo de errores
 * Debe ser el último middleware en la cadena
 */
export const errorHandler = (err, req, res, next) => {
  // Log del error
  logger.error('Error capturado por errorHandler:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  // Errores de Sequelize
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));

    return errorResponse(
      res,
      'Error de validación',
      400,
      errors
    );
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0]?.path || 'campo';
    return errorResponse(
      res,
      `El ${field} ya existe en el sistema`,
      409
    );
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return errorResponse(
      res,
      'No se puede realizar la operación: hay registros relacionados',
      409
    );
  }

  if (err.name === 'SequelizeDatabaseError') {
    return errorResponse(
      res,
      'Error en la base de datos',
      500
    );
  }

  // Errores de JWT
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(
      res,
      'Token inválido',
      401
    );
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(
      res,
      'Token expirado',
      401
    );
  }

  // Errores de validación de Joi
  if (err.isJoi) {
    const errors = err.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    return errorResponse(
      res,
      'Error de validación',
      400,
      errors
    );
  }

  // Errores personalizados con statusCode
  if (err.statusCode) {
    return errorResponse(
      res,
      err.message || 'Error en el servidor',
      err.statusCode,
      err.details
    );
  }

  // Error genérico
  return errorResponse(
    res,
    process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor'
      : err.message,
    500
  );
};

/**
 * Middleware para rutas no encontradas (404)
 */
export const notFoundHandler = (req, res) => {
  return errorResponse(
    res,
    `Ruta ${req.method} ${req.path} no encontrada`,
    404
  );
};

export default {
  errorHandler,
  notFoundHandler,
};
