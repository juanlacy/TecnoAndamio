import * as dashboardService from '../services/dashboardService.js';
import { successResponse, errorResponse } from '../utils/response.js';
import logger from '../utils/logger.js';

/**
 * Controlador de Dashboard
 */

/**
 * GET /api/v1/dashboard/stats
 * Obtener estadísticas generales
 */
export const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getStats();

    return successResponse(
      res,
      stats,
      'Estadísticas obtenidas exitosamente'
    );
  } catch (error) {
    logger.error('Error en getStats controller:', error);
    next(error);
  }
};

/**
 * GET /api/v1/dashboard/activity
 * Obtener actividad reciente
 */
export const getActivity = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const activity = await dashboardService.getRecentActivity(limit);

    return successResponse(
      res,
      activity,
      'Actividad reciente obtenida exitosamente'
    );
  } catch (error) {
    logger.error('Error en getActivity controller:', error);
    next(error);
  }
};

export default {
  getStats,
  getActivity,
};
