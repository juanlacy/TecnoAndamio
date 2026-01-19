import Joi from 'joi';

/**
 * Schemas de validación para Contactos
 */

/**
 * Schema para crear contacto
 */
export const createContactoSchema = Joi.object({
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
    .max(100)
    .required()
    .messages({
      'string.min': 'Nombre debe tener al menos 3 caracteres',
      'string.max': 'Nombre no puede exceder 100 caracteres',
      'any.required': 'Nombre es requerido',
    }),
  telefono: Joi.string()
    .max(20)
    .optional()
    .allow(''),
  correo: Joi.string()
    .email()
    .optional()
    .allow('')
    .messages({
      'string.email': 'Correo debe ser válido',
    }),
  tipo: Joi.string()
    .valid('Gerente', 'Supervisor', 'Administrativo', 'Técnico', 'Otro')
    .optional()
    .default('Otro')
    .messages({
      'any.only': 'Tipo debe ser: Gerente, Supervisor, Administrativo, Técnico u Otro',
    }),
  principal: Joi.boolean()
    .optional()
    .default(false),
});

/**
 * Schema para actualizar contacto
 */
export const updateContactoSchema = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(100)
    .optional(),
  telefono: Joi.string()
    .max(20)
    .optional()
    .allow(''),
  correo: Joi.string()
    .email()
    .optional()
    .allow(''),
  tipo: Joi.string()
    .valid('Gerente', 'Supervisor', 'Administrativo', 'Técnico', 'Otro')
    .optional(),
  principal: Joi.boolean()
    .optional(),
});

export default {
  createContactoSchema,
  updateContactoSchema,
};
