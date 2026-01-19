import Joi from 'joi';

/**
 * Schemas de validación para Equipos
 */

/**
 * Schema para crear equipo
 */
export const createEquipoSchema = Joi.object({
  categoria_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'ID de categoría es requerido',
      'number.positive': 'ID de categoría debe ser positivo',
    }),
  nombre: Joi.string()
    .min(3)
    .max(150)
    .required()
    .messages({
      'string.min': 'Nombre debe tener al menos 3 caracteres',
      'string.max': 'Nombre no puede exceder 150 caracteres',
      'any.required': 'Nombre es requerido',
    }),
  codigo: Joi.string()
    .max(50)
    .required()
    .messages({
      'string.max': 'Código no puede exceder 50 caracteres',
      'any.required': 'Código es requerido',
    }),
  descripcion: Joi.string()
    .optional()
    .allow(''),
  especificaciones: Joi.object()
    .optional()
    .messages({
      'object.base': 'Especificaciones debe ser un objeto JSON válido',
    }),
  disponible: Joi.boolean()
    .optional()
    .default(true),
  activo: Joi.boolean()
    .optional()
    .default(true),
});

/**
 * Schema para actualizar equipo
 */
export const updateEquipoSchema = Joi.object({
  categoria_id: Joi.number()
    .integer()
    .positive()
    .optional(),
  nombre: Joi.string()
    .min(3)
    .max(150)
    .optional(),
  codigo: Joi.string()
    .max(50)
    .optional(),
  descripcion: Joi.string()
    .optional()
    .allow(''),
  especificaciones: Joi.object()
    .optional(),
  disponible: Joi.boolean()
    .optional(),
  activo: Joi.boolean()
    .optional(),
});

/**
 * Schema para query parameters al listar equipos
 */
export const queryEquiposSchema = Joi.object({
  categoria_id: Joi.number()
    .integer()
    .positive()
    .optional(),
  disponible: Joi.string()
    .valid('true', 'false')
    .optional(),
  activo: Joi.string()
    .valid('true', 'false')
    .optional(),
  search: Joi.string()
    .optional()
    .allow(''),
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10),
});

/**
 * Schema para validar ID
 */
export const idSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'ID es requerido',
      'number.positive': 'ID debe ser positivo',
    }),
});

/**
 * Schema para equipoId en rutas anidadas
 */
export const equipoIdSchema = Joi.object({
  equipoId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'ID de equipo es requerido',
      'number.positive': 'ID de equipo debe ser positivo',
    }),
});

export default {
  createEquipoSchema,
  updateEquipoSchema,
  queryEquiposSchema,
  idSchema,
  equipoIdSchema,
};
