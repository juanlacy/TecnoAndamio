import express from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

/**
 * Rutas de Dashboard
 * Base: /api/v1/dashboard
 * Todas las rutas requieren autenticación
 */

/**
 * GET /api/v1/dashboard/stats
 * Obtener estadísticas generales del sistema
 */
router.get(
  '/stats',
  verifyToken,
  dashboardController.getStats
);

/**
 * GET /api/v1/dashboard/activity
 * Obtener actividad reciente
 * Query params: ?limit=10
 */
router.get(
  '/activity',
  verifyToken,
  dashboardController.getActivity
);

export default router;
