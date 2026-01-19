import express from 'express';
import * as categoriaEquipoController from '../controllers/categoriaEquipoController.js';
import { verifyToken } from '../middlewares/auth.js';
import { requireAdmin } from '../middlewares/roleCheck.js';
import { validateBody, validateParams } from '../middlewares/validator.js';
import {
  createCategoriaSchema,
  updateCategoriaSchema,
  idSchema,
} from '../validators/categoriaEquipoValidator.js';

const router = express.Router();

/**
 * Rutas de Categorías de Equipos
 * Base: /api/v1/categorias-equipos
 * GET rutas requieren autenticación
 * POST/PUT/DELETE requieren autenticación + rol Admin
 */

/**
 * GET /api/v1/categorias-equipos
 * Listar todas las categorías activas (para dropdowns)
 */
router.get(
  '/',
  verifyToken,
  categoriaEquipoController.getCategorias
);

/**
 * GET /api/v1/categorias-equipos/:id
 * Obtener categoría por ID
 */
router.get(
  '/:id',
  verifyToken,
  validateParams(idSchema),
  categoriaEquipoController.getCategoriaById
);

/**
 * POST /api/v1/categorias-equipos
 * Crear nueva categoría (solo Admin)
 */
router.post(
  '/',
  verifyToken,
  requireAdmin,
  validateBody(createCategoriaSchema),
  categoriaEquipoController.createCategoria
);

/**
 * PUT /api/v1/categorias-equipos/:id
 * Actualizar categoría (solo Admin)
 */
router.put(
  '/:id',
  verifyToken,
  requireAdmin,
  validateParams(idSchema),
  validateBody(updateCategoriaSchema),
  categoriaEquipoController.updateCategoria
);

/**
 * DELETE /api/v1/categorias-equipos/:id
 * Eliminar categoría (solo Admin)
 */
router.delete(
  '/:id',
  verifyToken,
  requireAdmin,
  validateParams(idSchema),
  categoriaEquipoController.deleteCategoria
);

export default router;
