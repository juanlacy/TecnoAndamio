import express from 'express';
import * as edpController from '../controllers/edpController.js';
import { verifyToken } from '../middlewares/auth.js';
import { validateBody, validateQuery, validateParams } from '../middlewares/validator.js';
import {
  createEdpSchema,
  updateEdpSchema,
  cambiarEstadoSchema,
  queryEdpsSchema,
  idSchema,
} from '../validators/edpValidator.js';

const router = express.Router();

/**
 * Rutas de EDP (Estados de Pago)
 * Base: /api/v1/edp
 * Todas requieren autenticación
 */

/**
 * GET /api/v1/edp
 * Listar EDPs con paginación y filtros
 * Query: ?estado=&cliente_id=&obra_id=&search=&page=1&limit=10
 */
router.get(
  '/',
  verifyToken,
  validateQuery(queryEdpsSchema),
  edpController.getEdps
);

/**
 * GET /api/v1/edp/:id
 * Obtener EDP por ID con todas las relaciones
 */
router.get(
  '/:id',
  verifyToken,
  validateParams(idSchema),
  edpController.getEdpById
);

/**
 * POST /api/v1/edp
 * Crear nuevo EDP (estado inicial: Borrador)
 */
router.post(
  '/',
  verifyToken,
  validateBody(createEdpSchema),
  edpController.createEdp
);

/**
 * PUT /api/v1/edp/:id
 * Actualizar EDP (solo si estado = Borrador)
 */
router.put(
  '/:id',
  verifyToken,
  validateParams(idSchema),
  validateBody(updateEdpSchema),
  edpController.updateEdp
);

/**
 * DELETE /api/v1/edp/:id
 * Eliminar EDP (solo si estado = Borrador)
 */
router.delete(
  '/:id',
  verifyToken,
  validateParams(idSchema),
  edpController.deleteEdp
);

/**
 * PATCH /api/v1/edp/:id/estado
 * Cambiar estado de EDP con validación de transiciones
 */
router.patch(
  '/:id/estado',
  verifyToken,
  validateParams(idSchema),
  validateBody(cambiarEstadoSchema),
  edpController.cambiarEstado
);

/**
 * GET /api/v1/edp/:id/historial
 * Obtener historial de cambios de estado
 */
router.get(
  '/:id/historial',
  verifyToken,
  validateParams(idSchema),
  edpController.getHistorial
);

export default router;
