import express from 'express';
import * as tipoServicioController from '../controllers/tipoServicioController.js';
import { verifyToken } from '../middlewares/auth.js';
import { validateParams } from '../middlewares/validator.js';
import { idSchema } from '../validators/categoriaEquipoValidator.js';

const router = express.Router();

/**
 * Rutas de Tipos de Servicio
 * Base: /api/v1/tipos-servicio
 * Solo lectura para el MVP
 */

/**
 * GET /api/v1/tipos-servicio
 * Listar todos los tipos de servicio activos (para dropdowns)
 */
router.get(
  '/',
  verifyToken,
  tipoServicioController.getTiposServicio
);

/**
 * GET /api/v1/tipos-servicio/:id
 * Obtener tipo de servicio por ID
 */
router.get(
  '/:id',
  verifyToken,
  validateParams(idSchema),
  tipoServicioController.getTipoServicioById
);

export default router;
