import Joi from 'joi';

/**
 * Schemas de validación para autenticación
 */

/**
 * Schema para registro de usuario
 */
export const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email debe ser válido',
      'any.required': 'Email es requerido',
    }),
  nombre: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'Nombre debe tener al menos 3 caracteres',
      'string.max': 'Nombre no puede exceder 100 caracteres',
      'any.required': 'Nombre es requerido',
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password debe tener al menos 6 caracteres',
      'any.required': 'Password es requerido',
    }),
  roles: Joi.array()
    .items(Joi.string().valid('Admin', 'Supervisor', 'Operador'))
    .optional()
    .messages({
      'array.base': 'Roles debe ser un array',
      'any.only': 'Rol inválido. Opciones: Admin, Supervisor, Operador',
    }),
});

/**
 * Schema para login
 */
export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email debe ser válido',
      'any.required': 'Email es requerido',
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password es requerido',
    }),
});

/**
 * Schema para refresh token
 */
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'any.required': 'Refresh token es requerido',
    }),
});

export default {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
};
