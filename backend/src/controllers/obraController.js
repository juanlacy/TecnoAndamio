import * as obraService from '../services/obraService.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import logger from '../utils/logger.js';

/**
 * Controlador de Obras
 * Maneja las peticiones HTTP para el CRUD de obras
 */

/**
 * GET /api/v1/obras
 * Listar obras con paginación y filtros
 */
export const getObras = async (req, res, next) => {
  try {
    const { cliente_id, activa, search, page = 1, limit = 10 } = req.query;

    const result = await obraService.listObras({
      cliente_id: cliente_id ? parseInt(cliente_id) : undefined,
      activa: activa === 'true' ? true : activa === 'false' ? false : null,
      search,
      page: parseInt(page),
      limit: parseInt(limit),
    });

    const { obras, total } = result;

    return paginatedResponse(
      res,
      obras,
      parseInt(page),
      parseInt(limit),
      total,
      'Obras obtenidas exitosamente'
    );
  } catch (error) {
    logger.error('Error en getObras controller:', error);
    next(error);
  }
};

/**
 * GET /api/v1/obras/:id
 * Obtener obra por ID con relaciones
 */
export const getObraById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const obra = await obraService.getObraById(id);

    return successResponse(
      res,
      { obra },
      'Obra obtenida exitosamente'
    );
  } catch (error) {
    logger.error('Error en getObraById controller:', error);
    next(error);
  }
};

/**
 * POST /api/v1/obras
 * Crear nueva obra
 */
export const createObra = async (req, res, next) => {
  try {
    const obraData = req.body;

    const obra = await obraService.createObra(obraData);

    return successResponse(
      res,
      { obra },
      'Obra creada exitosamente',
      201
    );
  } catch (error) {
    logger.error('Error en createObra controller:', error);
    next(error);
  }
};

/**
 * PUT /api/v1/obras/:id
 * Actualizar obra
 */
export const updateObra = async (req, res, next) => {
  try {
    const { id } = req.params;
    const obraData = req.body;

    const obra = await obraService.updateObra(id, obraData);

    return successResponse(
      res,
      { obra },
      'Obra actualizada exitosamente'
    );
  } catch (error) {
    logger.error('Error en updateObra controller:', error);
    next(error);
  }
};

/**
 * DELETE /api/v1/obras/:id
 * Eliminar obra (soft delete)
 */
export const deleteObra = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await obraService.deleteObra(id);

    return successResponse(
      res,
      result,
      'Obra eliminada exitosamente'
    );
  } catch (error) {
    logger.error('Error en deleteObra controller:', error);
    next(error);
  }
};

export default {
  getObras,
  getObraById,
  createObra,
  updateObra,
  deleteObra,
};
