import db from '../models/index.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { AppError } from '../utils/errors.js';
import logger from '../utils/logger.js';

const { TipoServicio } = db;

/**
 * Controlador de Tipos de Servicio
 * Solo lectura para el MVP (para dropdowns)
 */

/**
 * GET /api/v1/tipos-servicio
 * Listar todos los tipos de servicio activos (sin paginación - para dropdowns)
 */
export const getTiposServicio = async (req, res, next) => {
  try {
    const tiposServicio = await TipoServicio.findAll({
      where: { activo: true },
      attributes: ['id', 'nombre', 'descripcion', 'activo'],
      order: [['nombre', 'ASC']],
    });

    return successResponse(
      res,
      { tiposServicio },
      'Tipos de servicio obtenidos exitosamente'
    );
  } catch (error) {
    logger.error('Error en getTiposServicio controller:', error);
    next(error);
  }
};

/**
 * GET /api/v1/tipos-servicio/:id
 * Obtener tipo de servicio por ID
 */
export const getTipoServicioById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tipoServicio = await TipoServicio.findByPk(id, {
      attributes: ['id', 'nombre', 'descripcion', 'activo'],
    });

    if (!tipoServicio) {
      throw new AppError('Tipo de servicio no encontrado', 404);
    }

    return successResponse(
      res,
      { tipoServicio },
      'Tipo de servicio obtenido exitosamente'
    );
  } catch (error) {
    logger.error('Error en getTipoServicioById controller:', error);
    next(error);
  }
};

export default {
  getTiposServicio,
  getTipoServicioById,
};
