import Joi from 'joi';

/**
 * Schemas de validación para Usuarios
 */

/**
 * Schema para crear usuario
 */
export const createUsuarioSchema = Joi.object({
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
    .items(Joi.number().integer().positive())
    .min(1)
    .optional()
    .messages({
      'array.min': 'Debe asignar al menos un rol',
      'number.base': 'ID de rol debe ser un número',
    }),
  activo: Joi.boolean()
    .optional()
    .default(true),
});

/**
 * Schema para actualizar usuario
 */
export const updateUsuarioSchema = Joi.object({
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Email debe ser válido',
    }),
  nombre: Joi.string()
    .min(3)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Nombre debe tener al menos 3 caracteres',
      'string.max': 'Nombre no puede exceder 100 caracteres',
    }),
  password: Joi.string()
    .min(6)
    .optional()
    .messages({
      'string.min': 'Password debe tener al menos 6 caracteres',
    }),
  roles: Joi.array()
    .items(Joi.number().integer().positive())
    .min(1)
    .optional()
    .messages({
      'array.min': 'Debe asignar al menos un rol',
      'number.base': 'ID de rol debe ser un número',
    }),
  activo: Joi.boolean()
    .optional(),
});

/**
 * Schema para query params de listado
 */
export const queryUsuariosSchema = Joi.object({
  search: Joi.string()
    .optional()
    .allow('')
    .max(100),
  activo: Joi.boolean()
    .optional(),
  page: Joi.number()
    .integer()
    .min(1)
    .optional()
    .default(1),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .optional()
    .default(10),
});

/**
 * Schema para ID de usuario
 */
export const idSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'ID debe ser un número',
      'number.positive': 'ID debe ser positivo',
      'any.required': 'ID es requerido',
    }),
});

export default {
  createUsuarioSchema,
  updateUsuarioSchema,
  queryUsuariosSchema,
  idSchema,
};
