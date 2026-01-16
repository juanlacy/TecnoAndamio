/**
 * Constantes de la aplicación
 */

// Estados de EDP
export const EDP_ESTADOS = {
  BORRADOR: 'Borrador',
  ABIERTO: 'Abierto',
  CERRADO: 'Cerrado',
  VALIDADO: 'Validado',
  FACTURADO: 'Facturado',
  COBRADO: 'Cobrado',
};

// Transiciones válidas de estado de EDP
export const EDP_TRANSICIONES_VALIDAS = {
  [EDP_ESTADOS.BORRADOR]: [EDP_ESTADOS.ABIERTO],
  [EDP_ESTADOS.ABIERTO]: [EDP_ESTADOS.CERRADO, EDP_ESTADOS.BORRADOR],
  [EDP_ESTADOS.CERRADO]: [EDP_ESTADOS.VALIDADO, EDP_ESTADOS.ABIERTO],
  [EDP_ESTADOS.VALIDADO]: [EDP_ESTADOS.FACTURADO],
  [EDP_ESTADOS.FACTURADO]: [EDP_ESTADOS.COBRADO],
  [EDP_ESTADOS.COBRADO]: [],
};

// Roles del sistema
export const ROLES = {
  ADMIN: 'Admin',
  OPERADOR: 'Operador',
  SUPERVISOR: 'Supervisor',
};

// Permisos por rol
export const PERMISOS_POR_ROL = {
  [ROLES.ADMIN]: {
    usuarios: ['create', 'read', 'update', 'delete'],
    clientes: ['create', 'read', 'update', 'delete'],
    obras: ['create', 'read', 'update', 'delete'],
    equipos: ['create', 'read', 'update', 'delete'],
    edp: ['create', 'read', 'update', 'delete', 'change_status'],
    categorias: ['create', 'read', 'update', 'delete'],
  },
  [ROLES.SUPERVISOR]: {
    usuarios: ['read'],
    clientes: ['create', 'read', 'update'],
    obras: ['create', 'read', 'update'],
    equipos: ['read'],
    edp: ['create', 'read', 'update', 'change_status'],
    categorias: ['read'],
  },
  [ROLES.OPERADOR]: {
    usuarios: [],
    clientes: ['read'],
    obras: ['read'],
    equipos: ['read'],
    edp: ['create', 'read'],
    categorias: ['read'],
  },
};

// Tipos de contacto
export const TIPOS_CONTACTO = {
  OBRA: 'Obra',
  EMPRESA: 'Empresa',
  FACTURACION: 'Facturación',
};

// Tipos de movimiento de caja chica
export const TIPOS_MOVIMIENTO_CAJA = {
  INGRESO: 'Ingreso',
  EGRESO: 'Egreso',
  COMPROBANTE: 'Comprobante',
};

// Tipos de comprobante
export const TIPOS_COMPROBANTE = {
  BOLETA: 'Boleta',
  FACTURA: 'Factura',
  NO_APLICA: 'No aplica',
};

// Unidades de alquiler
export const UNIDADES_ALQUILER = {
  UF: 'Valor UF',
  PESOS: 'Pesos',
};

// Estados de inventario de equipos
export const ESTADOS_INVENTARIO = {
  DISPONIBLE: 'Disponible',
  ALQUILADO: 'Alquilado',
  MANTENIMIENTO: 'Mantenimiento',
  BAJA: 'Baja',
};

// Paginación por defecto
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Tamaños de archivo
export const FILE_SIZE = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
};

// Formatos de archivo permitidos
export const ALLOWED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/jpg'],
  DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

export default {
  EDP_ESTADOS,
  EDP_TRANSICIONES_VALIDAS,
  ROLES,
  PERMISOS_POR_ROL,
  TIPOS_CONTACTO,
  TIPOS_MOVIMIENTO_CAJA,
  TIPOS_COMPROBANTE,
  UNIDADES_ALQUILER,
  ESTADOS_INVENTARIO,
  PAGINATION,
  FILE_SIZE,
  ALLOWED_FILE_TYPES,
};
