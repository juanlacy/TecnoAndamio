import express from 'express';
import * as clienteController from '../controllers/clienteController.js';
import * as contactoController from '../controllers/contactoController.js';
import { verifyToken } from '../middlewares/auth.js';
import { validateBody, validateQuery, validateParams } from '../middlewares/validator.js';
import {
  createClienteSchema,
  updateClienteSchema,
  queryClientesSchema,
  idSchema,
  clienteIdSchema,
} from '../validators/clienteValidator.js';
import {
  createContactoSchema,
  updateContactoSchema,
} from '../validators/contactoValidator.js';

const router = express.Router();

/**
 * Rutas de Clientes
 * Base: /api/v1/clientes
 * Todas requieren autenticación
 */

/**
 * GET /api/v1/clientes
 * Listar clientes con paginación y filtros
 * Query: ?search=&rut=&activo=&page=1&limit=10
 */
router.get(
  '/',
  verifyToken,
  validateQuery(queryClientesSchema),
  clienteController.getClientes
);

/**
 * GET /api/v1/clientes/:id
 * Obtener cliente por ID con contactos y obras
 */
router.get(
  '/:id',
  verifyToken,
  validateParams(idSchema),
  clienteController.getClienteById
);

/**
 * POST /api/v1/clientes
 * Crear nuevo cliente
 */
router.post(
  '/',
  verifyToken,
  validateBody(createClienteSchema),
  clienteController.createCliente
);

/**
 * PUT /api/v1/clientes/:id
 * Actualizar cliente
 */
router.put(
  '/:id',
  verifyToken,
  validateParams(idSchema),
  validateBody(updateClienteSchema),
  clienteController.updateCliente
);

/**
 * DELETE /api/v1/clientes/:id
 * Eliminar cliente (soft delete)
 */
router.delete(
  '/:id',
  verifyToken,
  validateParams(idSchema),
  clienteController.deleteCliente
);

/**
 * GET /api/v1/clientes/:id/contactos
 * Obtener contactos de un cliente
 */
router.get(
  '/:id/contactos',
  verifyToken,
  validateParams(idSchema),
  clienteController.getContactosByCliente
);

/**
 * POST /api/v1/clientes/:clienteId/contactos
 * Crear contacto para un cliente
 */
router.post(
  '/:clienteId/contactos',
  verifyToken,
  validateParams(clienteIdSchema),
  validateBody(createContactoSchema),
  contactoController.createContacto
);

/**
 * GET /api/v1/clientes/:id/obras
 * Obtener obras de un cliente
 */
router.get(
  '/:id/obras',
  verifyToken,
  validateParams(idSchema),
  clienteController.getObrasByCliente
);

export default router;
