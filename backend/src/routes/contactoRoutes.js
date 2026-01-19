import express from 'express';
import * as contactoController from '../controllers/contactoController.js';
import { verifyToken } from '../middlewares/auth.js';
import { validateBody, validateParams } from '../middlewares/validator.js';
import { updateContactoSchema } from '../validators/contactoValidator.js';
import { idSchema } from '../validators/clienteValidator.js';

const router = express.Router();

/**
 * Rutas de Contactos
 * Base: /api/v1/contactos
 * Todas requieren autenticación
 */

/**
 * PUT /api/v1/contactos/:id
 * Actualizar contacto
 */
router.put(
  '/:id',
  verifyToken,
  validateParams(idSchema),
  validateBody(updateContactoSchema),
  contactoController.updateContacto
);

/**
 * DELETE /api/v1/contactos/:id
 * Eliminar contacto (soft delete)
 */
router.delete(
  '/:id',
  verifyToken,
  validateParams(idSchema),
  contactoController.deleteContacto
);

export default router;
