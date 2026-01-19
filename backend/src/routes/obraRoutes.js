import express from 'express';
import * as obraController from '../controllers/obraController.js';
import { verifyToken } from '../middlewares/auth.js';
import { validateBody, validateQuery, validateParams } from '../middlewares/validator.js';
import {
  createObraSchema,
  updateObraSchema,
  queryObrasSchema,
  idSchema,
} from '../validators/obraValidator.js';

const router = express.Router();

/**
 * Rutas de Obras
 * Base: /api/v1/obras
 * Todas requieren autenticación
 */

/**
 * GET /api/v1/obras
 * Listar obras con paginación y filtros
 * Query: ?cliente_id=&activa=&search=&page=1&limit=10
 */
router.get(
  '/',
  verifyToken,
  validateQuery(queryObrasSchema),
  obraController.getObras
);

/**
 * GET /api/v1/obras/:id
 * Obtener obra por ID con relaciones
 */
router.get(
  '/:id',
  verifyToken,
  validateParams(idSchema),
  obraController.getObraById
);

/**
 * POST /api/v1/obras
 * Crear nueva obra
 */
router.post(
  '/',
  verifyToken,
  validateBody(createObraSchema),
  obraController.createObra
);

/**
 * PUT /api/v1/obras/:id
 * Actualizar obra
 */
router.put(
  '/:id',
  verifyToken,
  validateParams(idSchema),
  validateBody(updateObraSchema),
  obraController.updateObra
);

/**
 * DELETE /api/v1/obras/:id
 * Eliminar obra (soft delete)
 */
router.delete(
  '/:id',
  verifyToken,
  validateParams(idSchema),
  obraController.deleteObra
);

export default router;
