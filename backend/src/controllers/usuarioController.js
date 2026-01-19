import * as usuarioService from '../services/usuarioService.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import logger from '../utils/logger.js';

/**
 * Controlador de Usuarios
 */

/**
 * GET /api/v1/usuarios
 * Listar usuarios con paginación y filtros
 */
export const getUsuarios = async (req, res, next) => {
  try {
    const { search, activo, page, limit } = req.query;

    const result = await usuarioService.listUsuarios({
      search,
      activo: activo !== undefined ? activo === 'true' : undefined,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    });

    return paginatedResponse(
      res,
      result.usuarios,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total
    );
  } catch (error) {
    logger.error('Error en getUsuarios controller:', error);
    next(error);
  }
};

/**
 * GET /api/v1/usuarios/:id
 * Obtener usuario por ID
 */
export const getUsuarioById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const usuario = await usuarioService.getUsuarioById(id);

    return successResponse(
      res,
      { usuario },
      'Usuario obtenido exitosamente'
    );
  } catch (error) {
    if (error.message === 'Usuario no encontrado') {
      return errorResponse(res, error.message, 404);
    }
    logger.error('Error en getUsuarioById controller:', error);
    next(error);
  }
};

/**
 * POST /api/v1/usuarios
 * Crear nuevo usuario
 */
export const createUsuario = async (req, res, next) => {
  try {
    const { email, nombre, password, roles, activo } = req.body;

    const usuario = await usuarioService.createUsuario(
      { email, nombre, password, activo },
      roles
    );

    return successResponse(
      res,
      { usuario },
      'Usuario creado exitosamente',
      201
    );
  } catch (error) {
    if (error.message === 'El email ya está registrado') {
      return errorResponse(res, error.message, 409);
    }
    logger.error('Error en createUsuario controller:', error);
    next(error);
  }
};

/**
 * PUT /api/v1/usuarios/:id
 * Actualizar usuario
 */
export const updateUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, nombre, password, roles, activo } = req.body;

    const usuario = await usuarioService.updateUsuario(
      id,
      { email, nombre, password, activo },
      roles
    );

    return successResponse(
      res,
      { usuario },
      'Usuario actualizado exitosamente'
    );
  } catch (error) {
    if (error.message === 'Usuario no encontrado') {
      return errorResponse(res, error.message, 404);
    }
    if (error.message === 'El email ya está registrado') {
      return errorResponse(res, error.message, 409);
    }
    logger.error('Error en updateUsuario controller:', error);
    next(error);
  }
};

/**
 * DELETE /api/v1/usuarios/:id
 * Eliminar usuario (soft delete)
 */
export const deleteUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;

    await usuarioService.deleteUsuario(id);

    return successResponse(
      res,
      null,
      'Usuario eliminado exitosamente'
    );
  } catch (error) {
    if (error.message === 'Usuario no encontrado') {
      return errorResponse(res, error.message, 404);
    }
    logger.error('Error en deleteUsuario controller:', error);
    next(error);
  }
};

export default {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
};
