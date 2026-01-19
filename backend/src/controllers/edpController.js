import * as edpService from '../services/edpService.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import logger from '../utils/logger.js';

/**
 * Controlador de EDP (Estados de Pago)
 * Maneja las peticiones HTTP para el CRUD de EDPs
 */

/**
 * GET /api/v1/edp
 * Listar EDPs con paginación y filtros
 */
export const getEdps = async (req, res, next) => {
  try {
    const { estado, cliente_id, obra_id, search, page = 1, limit = 10 } = req.query;

    const result = await edpService.listEdps({
      estado,
      cliente_id: cliente_id ? parseInt(cliente_id) : undefined,
      obra_id: obra_id ? parseInt(obra_id) : undefined,
      search,
      page: parseInt(page),
      limit: parseInt(limit),
    });

    const { edps, total } = result;

    return paginatedResponse(
      res,
      edps,
      parseInt(page),
      parseInt(limit),
      total,
      'EDPs obtenidos exitosamente'
    );
  } catch (error) {
    logger.error('Error en getEdps controller:', error);
    next(error);
  }
};

/**
 * GET /api/v1/edp/:id
 * Obtener EDP por ID con todas las relaciones
 */
export const getEdpById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const edp = await edpService.getEdpById(id);

    return successResponse(
      res,
      { edp },
      'EDP obtenido exitosamente'
    );
  } catch (error) {
    logger.error('Error en getEdpById controller:', error);
    next(error);
  }
};

/**
 * POST /api/v1/edp
 * Crear nuevo EDP
 */
export const createEdp = async (req, res, next) => {
  try {
    const edpData = req.body;
    const usuarioId = req.user.id; // Del middleware de autenticación

    const edp = await edpService.createEdp(edpData, usuarioId);

    return successResponse(
      res,
      { edp },
      'EDP creado exitosamente',
      201
    );
  } catch (error) {
    logger.error('Error en createEdp controller:', error);

    // Error de código duplicado
    if (error.statusCode === 409) {
      return errorResponse(res, error.message, 409);
    }

    next(error);
  }
};

/**
 * PUT /api/v1/edp/:id
 * Actualizar EDP (solo si estado = Borrador)
 */
export const updateEdp = async (req, res, next) => {
  try {
    const { id } = req.params;
    const edpData = req.body;

    const edp = await edpService.updateEdp(id, edpData);

    return successResponse(
      res,
      { edp },
      'EDP actualizado exitosamente'
    );
  } catch (error) {
    logger.error('Error en updateEdp controller:', error);

    // Error de código duplicado o estado no válido
    if (error.statusCode === 409 || error.statusCode === 400) {
      return errorResponse(res, error.message, error.statusCode);
    }

    next(error);
  }
};

/**
 * DELETE /api/v1/edp/:id
 * Eliminar EDP (solo si estado = Borrador)
 */
export const deleteEdp = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await edpService.deleteEdp(id);

    return successResponse(
      res,
      result,
      'EDP eliminado exitosamente'
    );
  } catch (error) {
    logger.error('Error en deleteEdp controller:', error);

    // Error de estado no válido
    if (error.statusCode === 400) {
      return errorResponse(res, error.message, 400);
    }

    next(error);
  }
};

/**
 * PATCH /api/v1/edp/:id/estado
 * Cambiar estado de EDP con validación de transiciones
 */
export const cambiarEstado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nuevo_estado, comentario } = req.body;
    const usuarioId = req.user.id;

    const edp = await edpService.cambiarEstado(id, nuevo_estado, comentario, usuarioId);

    return successResponse(
      res,
      { edp },
      `Estado cambiado exitosamente a ${nuevo_estado}`
    );
  } catch (error) {
    logger.error('Error en cambiarEstado controller:', error);

    // Error de transición no válida
    if (error.statusCode === 400) {
      return errorResponse(res, error.message, 400);
    }

    next(error);
  }
};

/**
 * GET /api/v1/edp/:id/historial
 * Obtener historial de cambios de estado
 */
export const getHistorial = async (req, res, next) => {
  try {
    const { id } = req.params;

    const historial = await edpService.getHistorial(id);

    return successResponse(
      res,
      { historial },
      'Historial obtenido exitosamente'
    );
  } catch (error) {
    logger.error('Error en getHistorial controller:', error);
    next(error);
  }
};

export default {
  getEdps,
  getEdpById,
  createEdp,
  updateEdp,
  deleteEdp,
  cambiarEstado,
  getHistorial,
};
