import express from 'express';
import * as equipoController from '../controllers/equipoController.js';
import * as componenteController from '../controllers/componenteController.js';
import { verifyToken } from '../middlewares/auth.js';
import { validateBody, validateQuery, validateParams } from '../middlewares/validator.js';
import {
  createEquipoSchema,
  updateEquipoSchema,
  queryEquiposSchema,
  idSchema,
  equipoIdSchema,
} from '../validators/equipoValidator.js';
import {
  createComponenteSchema,
  updateComponenteSchema,
} from '../validators/componenteValidator.js';

const router = express.Router();

/**
 * Rutas de Equipos
 * Base: /api/v1/equipos
 * Todas requieren autenticación
 */

/**
 * GET /api/v1/equipos
 * Listar equipos con paginación y filtros
 * Query: ?categoria_id=&disponible=&activo=&search=&page=1&limit=10
 */
router.get(
  '/',
  verifyToken,
  validateQuery(queryEquiposSchema),
  equipoController.getEquipos
);

/**
 * GET /api/v1/equipos/:id
 * Obtener equipo por ID con categoría y componentes
 */
router.get(
  '/:id',
  verifyToken,
  validateParams(idSchema),
  equipoController.getEquipoById
);

/**
 * POST /api/v1/equipos
 * Crear nuevo equipo
 */
router.post(
  '/',
  verifyToken,
  validateBody(createEquipoSchema),
  equipoController.createEquipo
);

/**
 * PUT /api/v1/equipos/:id
 * Actualizar equipo
 */
router.put(
  '/:id',
  verifyToken,
  validateParams(idSchema),
  validateBody(updateEquipoSchema),
  equipoController.updateEquipo
);

/**
 * DELETE /api/v1/equipos/:id
 * Eliminar equipo (soft delete)
 */
router.delete(
  '/:id',
  verifyToken,
  validateParams(idSchema),
  equipoController.deleteEquipo
);

/**
 * GET /api/v1/equipos/:id/componentes
 * Obtener componentes de un equipo
 */
router.get(
  '/:id/componentes',
  verifyToken,
  validateParams(idSchema),
  equipoController.getComponentesByEquipo
);

/**
 * POST /api/v1/equipos/:equipoId/componentes
 * Crear componente para un equipo
 */
router.post(
  '/:equipoId/componentes',
  verifyToken,
  validateParams(equipoIdSchema),
  validateBody(createComponenteSchema),
  componenteController.createComponente
);

export default router;
