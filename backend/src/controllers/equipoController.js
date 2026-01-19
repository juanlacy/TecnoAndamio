import * as equipoService from '../services/equipoService.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import logger from '../utils/logger.js';

/**
 * Controlador de Equipos
 * Maneja las peticiones HTTP para el CRUD de equipos
 */

/**
 * GET /api/v1/equipos
 * Listar equipos con paginación y filtros
 */
export const getEquipos = async (req, res, next) => {
  try {
    const { categoria_id, disponible, activo, search, page = 1, limit = 10 } = req.query;

    const result = await equipoService.listEquipos({
      categoria_id: categoria_id ? parseInt(categoria_id) : undefined,
      disponible: disponible === 'true' ? true : disponible === 'false' ? false : null,
      activo: activo === 'true' ? true : activo === 'false' ? false : null,
      search,
      page: parseInt(page),
      limit: parseInt(limit),
    });

    const { equipos, total } = result;

    return paginatedResponse(
      res,
      equipos,
      parseInt(page),
      parseInt(limit),
      total,
      'Equipos obtenidos exitosamente'
    );
  } catch (error) {
    logger.error('Error en getEquipos controller:', error);
    next(error);
  }
};

/**
 * GET /api/v1/equipos/:id
 * Obtener equipo por ID con categoría y componentes
 */
export const getEquipoById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const equipo = await equipoService.getEquipoById(id);

    return successResponse(
      res,
      { equipo },
      'Equipo obtenido exitosamente'
    );
  } catch (error) {
    logger.error('Error en getEquipoById controller:', error);
    next(error);
  }
};

/**
 * POST /api/v1/equipos
 * Crear nuevo equipo
 */
export const createEquipo = async (req, res, next) => {
  try {
    const equipoData = req.body;

    const equipo = await equipoService.createEquipo(equipoData);

    return successResponse(
      res,
      { equipo },
      'Equipo creado exitosamente',
      201
    );
  } catch (error) {
    logger.error('Error en createEquipo controller:', error);

    // Error de código duplicado
    if (error.statusCode === 409) {
      return errorResponse(res, error.message, 409);
    }

    next(error);
  }
};

/**
 * PUT /api/v1/equipos/:id
 * Actualizar equipo
 */
export const updateEquipo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const equipoData = req.body;

    const equipo = await equipoService.updateEquipo(id, equipoData);

    return successResponse(
      res,
      { equipo },
      'Equipo actualizado exitosamente'
    );
  } catch (error) {
    logger.error('Error en updateEquipo controller:', error);

    // Error de código duplicado
    if (error.statusCode === 409) {
      return errorResponse(res, error.message, 409);
    }

    next(error);
  }
};

/**
 * DELETE /api/v1/equipos/:id
 * Eliminar equipo (soft delete)
 */
export const deleteEquipo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await equipoService.deleteEquipo(id);

    return successResponse(
      res,
      result,
      'Equipo eliminado exitosamente'
    );
  } catch (error) {
    logger.error('Error en deleteEquipo controller:', error);
    next(error);
  }
};

/**
 * GET /api/v1/equipos/:id/componentes
 * Obtener componentes de un equipo
 */
export const getComponentesByEquipo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const componentes = await equipoService.getComponentesByEquipo(id);

    return successResponse(
      res,
      { componentes },
      'Componentes obtenidos exitosamente'
    );
  } catch (error) {
    logger.error('Error en getComponentesByEquipo controller:', error);
    next(error);
  }
};

export default {
  getEquipos,
  getEquipoById,
  createEquipo,
  updateEquipo,
  deleteEquipo,
  getComponentesByEquipo,
};
