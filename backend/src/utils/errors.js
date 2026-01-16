/**
 * Clase base para errores personalizados
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error de validación (400)
 */
export class ValidationError extends AppError {
  constructor(message = 'Error de validación', details = null) {
    super(message, 400);
    this.details = details;
  }
}

/**
 * Error de autenticación (401)
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'No autorizado') {
    super(message, 401);
  }
}

/**
 * Error de permisos (403)
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Acceso prohibido') {
    super(message, 403);
  }
}

/**
 * Error de recurso no encontrado (404)
 */
export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404);
  }
}

/**
 * Error de conflicto (409) - Ej: registro duplicado
 */
export class ConflictError extends AppError {
  constructor(message = 'Conflicto con recurso existente') {
    super(message, 409);
  }
}

/**
 * Error de negocio/lógica (422)
 */
export class BusinessError extends AppError {
  constructor(message = 'Error de lógica de negocio') {
    super(message, 422);
  }
}

export default {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  BusinessError,
};
