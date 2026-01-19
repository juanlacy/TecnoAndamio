import Joi from 'joi';

/**
 * Schemas de validación para Componentes de Equipo
 */

/**
 * Schema para crear componente
 */
export const createComponenteSchema = Joi.object({
  equipo_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'ID de equipo es requerido',
      'number.positive': 'ID de equipo debe ser positivo',
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
  unidad: Joi.string()
    .max(20)
    .required()
    .messages({
      'string.max': 'Unidad no puede exceder 20 caracteres',
      'any.required': 'Unidad es requerida',
    }),
  precio_unitario_uf: Joi.number()
    .positive()
    .precision(4)
    .required()
    .messages({
      'number.positive': 'Precio unitario debe ser positivo',
      'any.required': 'Precio unitario es requerido',
    }),
  descripcion: Joi.string()
    .optional()
    .allow(''),
  activo: Joi.boolean()
    .optional()
    .default(true),
});

/**
 * Schema para actualizar componente
 */
export const updateComponenteSchema = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(150)
    .optional(),
  unidad: Joi.string()
    .max(20)
    .optional(),
  precio_unitario_uf: Joi.number()
    .positive()
    .precision(4)
    .optional(),
  descripcion: Joi.string()
    .optional()
    .allow(''),
  activo: Joi.boolean()
    .optional(),
});

export default {
  createComponenteSchema,
  updateComponenteSchema,
};
