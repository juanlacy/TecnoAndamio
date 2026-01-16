/**
 * Helper para respuestas exitosas de la API
 * @param {Object} res - Response object de Express
 * @param {Object} data - Datos a enviar
 * @param {String} message - Mensaje opcional
 * @param {Number} statusCode - Código HTTP (default 200)
 */
export const successResponse = (res, data = null, message = 'Operación exitosa', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Helper para respuestas de error de la API
 * @param {Object} res - Response object de Express
 * @param {String} message - Mensaje de error
 * @param {Number} statusCode - Código HTTP (default 500)
 * @param {Object} details - Detalles adicionales del error
 */
export const errorResponse = (res, message = 'Error en el servidor', statusCode = 500, details = null) => {
  const response = {
    success: false,
    error: {
      message,
      code: getErrorCode(statusCode),
    },
  };

  if (details) {
    response.error.details = details;
  }

  return res.status(statusCode).json(response);
};

/**
 * Helper para respuestas paginadas
 * @param {Object} res - Response object de Express
 * @param {Array} data - Datos paginados
 * @param {Number} page - Página actual
 * @param {Number} limit - Límite por página
 * @param {Number} total - Total de registros
 */
export const paginatedResponse = (res, data, page, limit, total) => {
  const totalPages = Math.ceil(total / limit);

  return res.status(200).json({
    success: true,
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
};

/**
 * Obtener código de error basado en el status HTTP
 */
const getErrorCode = (statusCode) => {
  const errorCodes = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    422: 'VALIDATION_ERROR',
    500: 'INTERNAL_SERVER_ERROR',
  };

  return errorCodes[statusCode] || 'UNKNOWN_ERROR';
};

export default {
  successResponse,
  errorResponse,
  paginatedResponse,
};
