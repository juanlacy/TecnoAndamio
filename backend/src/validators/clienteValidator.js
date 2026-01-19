import Joi from 'joi';
import { validarRut } from '../utils/rutValidator.js';

/**
 * Validador personalizado de RUT para Joi
 */
const rutValidator = (value, helpers) => {
  if (!validarRut(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

/**
 * Schemas de validación para Clientes
 */

/**
 * Schema para crear cliente
 */
export const createClienteSchema = Joi.object({
  empresa: Joi.string()
    .min(3)
    .max(150)
    .required()
    .messages({
      'string.min': 'Nombre de empresa debe tener al menos 3 caracteres',
      'string.max': 'Nombre de empresa no puede exceder 150 caracteres',
      'any.required': 'Nombre de empresa es requerido',
    }),
  rut: Joi.string()
    .required()
    .custom(rutValidator, 'validación RUT')
    .messages({
      'any.required': 'RUT es requerido',
      'any.invalid': 'RUT inválido',
    }),
  direccion: Joi.string()
    .max(200)
    .optional()
    .allow(''),
  rubro: Joi.string()
    .max(100)
    .optional()
    .allow(''),
  correo_empresa: Joi.string()
    .email()
    .optional()
    .allow('')
    .messages({
      'string.email': 'Correo de empresa debe ser válido',
    }),
  usuario_responsable_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .allow(null),
  activo: Joi.boolean()
    .optional()
    .default(true),
});

/**
 * Schema para actualizar cliente
 */
export const updateClienteSchema = Joi.object({
  empresa: Joi.string()
    .min(3)
    .max(150)
    .optional(),
  rut: Joi.string()
    .optional()
    .custom(rutValidator, 'validación RUT')
    .messages({
      'any.invalid': 'RUT inválido',
    }),
  direccion: Joi.string()
    .max(200)
    .optional()
    .allow(''),
  rubro: Joi.string()
    .max(100)
    .optional()
    .allow(''),
  correo_empresa: Joi.string()
    .email()
    .optional()
    .allow('')
    .messages({
      'string.email': 'Correo de empresa debe ser válido',
    }),
  usuario_responsable_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .allow(null),
  activo: Joi.boolean()
    .optional(),
});

/**
 * Schema para query params de listado
 */
export const queryClientesSchema = Joi.object({
  search: Joi.string()
    .optional()
    .allow('')
    .max(100),
  rut: Joi.string()
    .optional()
    .allow(''),
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
 * Schema para clienteId en rutas anidadas
 */
export const clienteIdSchema = Joi.object({
  clienteId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'ID de cliente es requerido',
      'number.positive': 'ID de cliente debe ser positivo',
    }),
});

export default {
  createClienteSchema,
  updateClienteSchema,
  queryClientesSchema,
  idSchema,
  clienteIdSchema,
};
