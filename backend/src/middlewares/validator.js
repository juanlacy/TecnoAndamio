import { errorResponse } from '../utils/response.js';
import logger from '../utils/logger.js';

/**
 * Middleware genérico para validar datos con schemas de Joi
 *
 * @param {object} schema - Schema de Joi para validar
 * @param {string} source - Fuente de los datos ('body', 'query', 'params')
 * @returns {Function} Middleware function
 *
 * @example
 * router.post('/usuarios', validate(usuarioSchema, 'body'), controller);
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      // Obtener los datos según la fuente
      const dataToValidate = req[source];

      // Validar datos
      const { error, value } = schema.validate(dataToValidate, {
        abortEarly: false, // Retornar todos los errores, no solo el primero
        stripUnknown: true, // Eliminar campos no definidos en el schema
      });

      if (error) {
        // Formatear errores de Joi
        const errors = error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message.replace(/['"]/g, ''),
        }));

        logger.debug('Error de validación:', errors);

        return errorResponse(
          res,
          'Error de validación',
          400,
          errors
        );
      }

      // Reemplazar los datos originales con los validados
      req[source] = value;

      next();
    } catch (err) {
      logger.error('Error en middleware de validación:', err);
      return errorResponse(
        res,
        'Error al validar datos',
        500
      );
    }
  };
};

/**
 * Middleware para validar el body de la request
 *
 * @param {object} schema - Schema de Joi
 * @returns {Function} Middleware function
 *
 * @example
 * router.post('/usuarios', validateBody(usuarioSchema), controller);
 */
export const validateBody = (schema) => validate(schema, 'body');

/**
 * Middleware para validar los query params de la request
 *
 * @param {object} schema - Schema de Joi
 * @returns {Function} Middleware function
 *
 * @example
 * router.get('/usuarios', validateQuery(querySchema), controller);
 */
export const validateQuery = (schema) => validate(schema, 'query');

/**
 * Middleware para validar los params de la request
 *
 * @param {object} schema - Schema de Joi
 * @returns {Function} Middleware function
 *
 * @example
 * router.get('/usuarios/:id', validateParams(idSchema), controller);
 */
export const validateParams = (schema) => validate(schema, 'params');

export default {
  validate,
  validateBody,
  validateQuery,
  validateParams,
};
