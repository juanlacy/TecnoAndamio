import express from 'express';
import * as usuarioController from '../controllers/usuarioController.js';
import { verifyToken } from '../middlewares/auth.js';
import { requireAdmin } from '../middlewares/roleCheck.js';
import { validateBody, validateQuery, validateParams } from '../middlewares/validator.js';
import {
  createUsuarioSchema,
  updateUsuarioSchema,
  queryUsuariosSchema,
  idSchema,
} from '../validators/usuarioValidator.js';

const router = express.Router();

/**
 * Rutas de Usuarios
 * Base: /api/v1/usuarios
 * Todas requieren autenticación y rol Admin
 */

/**
 * GET /api/v1/usuarios
 * Listar usuarios con paginación
 * Query: ?search=&activo=&page=1&limit=10
 */
router.get(
  '/',
  verifyToken,
  requireAdmin,
  validateQuery(queryUsuariosSchema),
  usuarioController.getUsuarios
);

/**
 * GET /api/v1/usuarios/:id
 * Obtener usuario por ID
 */
router.get(
  '/:id',
  verifyToken,
  requireAdmin,
  validateParams(idSchema),
  usuarioController.getUsuarioById
);

/**
 * POST /api/v1/usuarios
 * Crear nuevo usuario
 */
router.post(
  '/',
  verifyToken,
  requireAdmin,
  validateBody(createUsuarioSchema),
  usuarioController.createUsuario
);

/**
 * PUT /api/v1/usuarios/:id
 * Actualizar usuario
 */
router.put(
  '/:id',
  verifyToken,
  requireAdmin,
  validateParams(idSchema),
  validateBody(updateUsuarioSchema),
  usuarioController.updateUsuario
);

/**
 * DELETE /api/v1/usuarios/:id
 * Eliminar usuario (soft delete)
 */
router.delete(
  '/:id',
  verifyToken,
  requireAdmin,
  validateParams(idSchema),
  usuarioController.deleteUsuario
);

export default router;
