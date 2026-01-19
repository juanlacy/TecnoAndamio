import express from 'express';
import * as componenteController from '../controllers/componenteController.js';
import { verifyToken } from '../middlewares/auth.js';
import { validateBody, validateParams } from '../middlewares/validator.js';
import { updateComponenteSchema } from '../validators/componenteValidator.js';
import { idSchema } from '../validators/equipoValidator.js';

const router = express.Router();

/**
 * Rutas de Componentes
 * Base: /api/v1/componentes
 * Todas requieren autenticación
 */

/**
 * PUT /api/v1/componentes/:id
 * Actualizar componente
 */
router.put(
  '/:id',
  verifyToken,
  validateParams(idSchema),
  validateBody(updateComponenteSchema),
  componenteController.updateComponente
);

/**
 * DELETE /api/v1/componentes/:id
 * Eliminar componente (soft delete)
 */
router.delete(
  '/:id',
  verifyToken,
  validateParams(idSchema),
  componenteController.deleteComponente
);

export default router;
