import express from 'express';
import * as authController from '../controllers/authController.js';
import { verifyToken } from '../middlewares/auth.js';
import { validateBody } from '../middlewares/validator.js';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from '../validators/authValidator.js';

const router = express.Router();

/**
 * Rutas de Autenticación
 * Base: /api/v1/auth
 */

/**
 * POST /api/v1/auth/register
 * Registrar nuevo usuario
 * Body: { email, nombre, password, roles? }
 * Response: { usuario, token, refreshToken }
 */
router.post(
  '/register',
  validateBody(registerSchema),
  authController.register
);

/**
 * POST /api/v1/auth/login
 * Login de usuario
 * Body: { email, password }
 * Response: { usuario, token, refreshToken }
 */
router.post(
  '/login',
  validateBody(loginSchema),
  authController.login
);

/**
 * POST /api/v1/auth/refresh
 * Renovar token de acceso
 * Body: { refreshToken }
 * Response: { token, usuario }
 */
router.post(
  '/refresh',
  validateBody(refreshTokenSchema),
  authController.refresh
);

/**
 * GET /api/v1/auth/me
 * Obtener información del usuario actual
 * Headers: Authorization: Bearer <token>
 * Response: { usuario }
 */
router.get(
  '/me',
  verifyToken,
  authController.me
);

/**
 * POST /api/v1/auth/logout
 * Logout de usuario (opcional - en JWT el cliente elimina el token)
 * Headers: Authorization: Bearer <token>
 * Response: { message }
 */
router.post(
  '/logout',
  verifyToken,
  authController.logout
);

export default router;
