import db from '../models/index.js';
import { successResponse, errorResponse } from '../utils/response.js';
import logger from '../utils/logger.js';

const { Rol } = db;

/**
 * Controlador de Roles
 * Solo lectura para el MVP
 */

/**
 * GET /api/v1/roles
 * Listar todos los roles (para dropdowns y asignación)
 */
export const getRoles = async (req, res, next) => {
  try {
    const roles = await Rol.findAll({
      where: { activo: true },
      attributes: ['id', 'nombre', 'descripcion', 'permisos'],
      order: [['nombre', 'ASC']],
    });

    return successResponse(
      res,
      { roles },
      'Roles obtenidos exitosamente'
    );
  } catch (error) {
    logger.error('Error en getRoles controller:', error);
    next(error);
  }
};

/**
 * GET /api/v1/roles/:id
 * Obtener un rol por ID
 */
export const getRolById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const rol = await Rol.findByPk(id, {
      attributes: ['id', 'nombre', 'descripcion', 'permisos', 'activo'],
    });

    if (!rol) {
      return errorResponse(res, 'Rol no encontrado', 404);
    }

    return successResponse(
      res,
      { rol },
      'Rol obtenido exitosamente'
    );
  } catch (error) {
    logger.error('Error en getRolById controller:', error);
    next(error);
  }
};

export default {
  getRoles,
  getRolById,
};
