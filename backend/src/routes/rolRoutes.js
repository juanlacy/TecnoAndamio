import express from 'express';
import * as rolController from '../controllers/rolController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

/**
 * Rutas de Roles
 * Base: /api/v1/roles
 * Solo lectura para el MVP
 */

/**
 * GET /api/v1/roles
 * Listar todos los roles activos
 */
router.get(
  '/',
  verifyToken,
  rolController.getRoles
);

/**
 * GET /api/v1/roles/:id
 * Obtener un rol por ID
 */
router.get(
  '/:id',
  verifyToken,
  rolController.getRolById
);

export default router;
