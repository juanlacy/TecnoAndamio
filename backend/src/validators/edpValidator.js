import Joi from 'joi';

/**
 * Schemas de validación para EDP (Estados de Pago)
 */

/**
 * Schema para crear EDP
 */
export const createEdpSchema = Joi.object({
  codigo: Joi.string()
    .max(50)
    .required()
    .messages({
      'string.max': 'Código no puede exceder 50 caracteres',
      'any.required': 'Código es requerido',
    }),
  cliente_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'ID de cliente es requerido',
      'number.positive': 'ID de cliente debe ser positivo',
    }),
  obra_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'ID de obra es requerido',
      'number.positive': 'ID de obra debe ser positivo',
    }),
  fecha_inicio: Joi.date()
    .required()
    .messages({
      'any.required': 'Fecha de inicio es requerida',
      'date.base': 'Fecha de inicio debe ser una fecha válida',
    }),
  fecha_termino: Joi.date()
    .required()
    .greater(Joi.ref('fecha_inicio'))
    .messages({
      'any.required': 'Fecha de término es requerida',
      'date.greater': 'Fecha de término debe ser posterior a fecha de inicio',
    }),
  observaciones: Joi.string()
    .optional()
    .allow(''),
  // Estado inicial siempre es "Borrador"
});

/**
 * Schema para actualizar EDP (solo si estado = Borrador)
 */
export const updateEdpSchema = Joi.object({
  codigo: Joi.string()
    .max(50)
    .optional(),
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
  observaciones: Joi.string()
    .optional()
    .allow(''),
});

/**
 * Schema para cambiar estado de EDP
 */
export const cambiarEstadoSchema = Joi.object({
  nuevo_estado: Joi.string()
    .valid('Borrador', 'Abierto', 'Cerrado', 'Validado', 'Facturado', 'Cobrado')
    .required()
    .messages({
      'any.required': 'Nuevo estado es requerido',
      'any.only': 'Estado debe ser: Borrador, Abierto, Cerrado, Validado, Facturado o Cobrado',
    }),
  comentario: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Comentario no puede exceder 500 caracteres',
    }),
});

/**
 * Schema para query parameters al listar EDPs
 */
export const queryEdpsSchema = Joi.object({
  estado: Joi.string()
    .valid('Borrador', 'Abierto', 'Cerrado', 'Validado', 'Facturado', 'Cobrado')
    .optional(),
  cliente_id: Joi.number()
    .integer()
    .positive()
    .optional(),
  obra_id: Joi.number()
    .integer()
    .positive()
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
 * Schema para agregar equipo a EDP
 */
export const addEquipoEdpSchema = Joi.object({
  equipo_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'ID de equipo es requerido',
      'number.positive': 'ID de equipo debe ser positivo',
    }),
  cantidad: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'Cantidad es requerida',
      'number.positive': 'Cantidad debe ser positiva',
    }),
  configuracion: Joi.object()
    .optional()
    .messages({
      'object.base': 'Configuración debe ser un objeto JSON válido',
    }),
});

/**
 * Schema para agregar servicio a equipo en EDP
 */
export const addServicioEdpSchema = Joi.object({
  tipo_servicio_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'ID de tipo de servicio es requerido',
      'number.positive': 'ID de tipo de servicio debe ser positivo',
    }),
  cantidad: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'any.required': 'Cantidad es requerida',
      'number.positive': 'Cantidad debe ser positiva',
    }),
  precio_unitario: Joi.number()
    .positive()
    .precision(4)
    .required()
    .messages({
      'any.required': 'Precio unitario es requerido',
      'number.positive': 'Precio unitario debe ser positivo',
    }),
  descripcion: Joi.string()
    .optional()
    .allow(''),
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
  createEdpSchema,
  updateEdpSchema,
  cambiarEstadoSchema,
  queryEdpsSchema,
  addEquipoEdpSchema,
  addServicioEdpSchema,
  idSchema,
};
