import db from '../models/index.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { AppError } from '../utils/errors.js';
import logger from '../utils/logger.js';

const { CategoriaEquipo } = db;

/**
 * Controlador de Categorías de Equipos
 * Para el MVP, principalmente lectura (para dropdowns)
 * Admin puede crear/editar
 */

/**
 * GET /api/v1/categorias-equipos
 * Listar todas las categorías activas (sin paginación - para dropdowns)
 */
export const getCategorias = async (req, res, next) => {
  try {
    const categorias = await CategoriaEquipo.findAll({
      where: { activo: true },
      attributes: ['id', 'nombre', 'descripcion', 'activo'],
      order: [['nombre', 'ASC']],
    });

    return successResponse(
      res,
      { categorias },
      'Categorías obtenidas exitosamente'
    );
  } catch (error) {
    logger.error('Error en getCategorias controller:', error);
    next(error);
  }
};

/**
 * GET /api/v1/categorias-equipos/:id
 * Obtener categoría por ID
 */
export const getCategoriaById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const categoria = await CategoriaEquipo.findByPk(id, {
      attributes: ['id', 'nombre', 'descripcion', 'activo'],
    });

    if (!categoria) {
      throw new AppError('Categoría no encontrada', 404);
    }

    return successResponse(
      res,
      { categoria },
      'Categoría obtenida exitosamente'
    );
  } catch (error) {
    logger.error('Error en getCategoriaById controller:', error);
    next(error);
  }
};

/**
 * POST /api/v1/categorias-equipos
 * Crear nueva categoría (solo Admin)
 */
export const createCategoria = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body;

    // Verificar que no exista una categoría con el mismo nombre
    const existeCategoria = await CategoriaEquipo.findOne({
      where: { nombre },
    });

    if (existeCategoria) {
      throw new AppError('Ya existe una categoría con este nombre', 409);
    }

    const categoria = await CategoriaEquipo.create({
      nombre,
      descripcion,
      activo: true,
    });

    return successResponse(
      res,
      { categoria },
      'Categoría creada exitosamente',
      201
    );
  } catch (error) {
    logger.error('Error en createCategoria controller:', error);

    if (error.statusCode === 409) {
      return errorResponse(res, error.message, 409);
    }

    next(error);
  }
};

/**
 * PUT /api/v1/categorias-equipos/:id
 * Actualizar categoría (solo Admin)
 */
export const updateCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, activo } = req.body;

    const categoria = await CategoriaEquipo.findByPk(id);

    if (!categoria) {
      throw new AppError('Categoría no encontrada', 404);
    }

    // Si se actualiza el nombre, verificar que no exista otra categoría con ese nombre
    if (nombre && nombre !== categoria.nombre) {
      const existeOtraCategoria = await CategoriaEquipo.findOne({
        where: { nombre },
      });

      if (existeOtraCategoria) {
        throw new AppError('Ya existe otra categoría con este nombre', 409);
      }

      categoria.nombre = nombre;
    }

    if (descripcion !== undefined) categoria.descripcion = descripcion;
    if (activo !== undefined) categoria.activo = activo;

    await categoria.save();

    return successResponse(
      res,
      { categoria },
      'Categoría actualizada exitosamente'
    );
  } catch (error) {
    logger.error('Error en updateCategoria controller:', error);

    if (error.statusCode === 409) {
      return errorResponse(res, error.message, 409);
    }

    next(error);
  }
};

/**
 * DELETE /api/v1/categorias-equipos/:id
 * Eliminar categoría (soft delete - solo Admin)
 */
export const deleteCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;

    const categoria = await CategoriaEquipo.findByPk(id);

    if (!categoria) {
      throw new AppError('Categoría no encontrada', 404);
    }

    // Soft delete
    categoria.activo = false;
    await categoria.save();

    return successResponse(
      res,
      { message: 'Categoría eliminada exitosamente' },
      'Categoría eliminada exitosamente'
    );
  } catch (error) {
    logger.error('Error en deleteCategoria controller:', error);
    next(error);
  }
};

export default {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
};
