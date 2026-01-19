import Joi from 'joi';

/**
 * Schemas de validación para Obras
 */

/**
 * Schema para crear obra
 */
export const createObraSchema = Joi.object({
  cliente_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'ID de cliente es requerido',
      'number.positive': 'ID de cliente debe ser positivo',
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
  direccion: Joi.string()
    .max(255)
    .required()
    .messages({
      'string.max': 'Dirección no puede exceder 255 caracteres',
      'any.required': 'Dirección es requerida',
    }),
  region: Joi.string()
    .max(50)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Región no puede exceder 50 caracteres',
    }),
  ciudad: Joi.string()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Ciudad no puede exceder 100 caracteres',
    }),
  descripcion: Joi.string()
    .optional()
    .allow(''),
  responsable_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.positive': 'ID de responsable debe ser positivo',
    }),
  fecha_inicio: Joi.date()
    .required()
    .messages({
      'any.required': 'Fecha de inicio es requerida',
      'date.base': 'Fecha de inicio debe ser una fecha válida',
    }),
  fecha_termino: Joi.date()
    .optional()
    .greater(Joi.ref('fecha_inicio'))
    .messages({
      'date.greater': 'Fecha de término debe ser posterior a fecha de inicio',
    }),
  activa: Joi.boolean()
    .optional()
    .default(true),
});

/**
 * Schema para actualizar obra
 */
export const updateObraSchema = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(150)
    .optional(),
  direccion: Joi.string()
    .max(255)
    .optional(),
  region: Joi.string()
    .max(50)
    .optional()
    .allow(''),
  ciudad: Joi.string()
    .max(100)
    .optional()
    .allow(''),
  descripcion: Joi.string()
    .optional()
    .allow(''),
  responsable_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .allow(null),
  fecha_inicio: Joi.date()
    .optional(),
  fecha_termino: Joi.date()
    .optional()
    .when('fecha_inicio', {
      is: Joi.exist(),
      then: Joi.date().greater(Joi.ref('fecha_inicio')),
    })
    .messages({
      'date.greater': 'Fecha de término debe ser posterior a fecha de inicio',
    }),
  activa: Joi.boolean()
    .optional(),
});

/**
 * Schema para query parameters al listar obras
 */
export const queryObrasSchema = Joi.object({
  cliente_id: Joi.number()
    .integer()
    .positive()
    .optional(),
  activa: Joi.string()
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

export default {
  createObraSchema,
  updateObraSchema,
  queryObrasSchema,
  idSchema,
};
