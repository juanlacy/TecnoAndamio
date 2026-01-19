import Joi from 'joi';

/**
 * Schemas de validación para Categorías de Equipos
 */

/**
 * Schema para crear categoría
 */
export const createCategoriaSchema = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'Nombre debe tener al menos 3 caracteres',
      'string.max': 'Nombre no puede exceder 100 caracteres',
      'any.required': 'Nombre es requerido',
    }),
  descripcion: Joi.string()
    .optional()
    .allow(''),
});

/**
 * Schema para actualizar categoría
 */
export const updateCategoriaSchema = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(100)
    .optional(),
  descripcion: Joi.string()
    .optional()
    .allow(''),
  activo: Joi.boolean()
    .optional(),
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
  createCategoriaSchema,
  updateCategoriaSchema,
  idSchema,
};
