import db from '../models/index.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { AppError } from '../utils/errors.js';
import logger from '../utils/logger.js';

const { ComponenteEquipo, Equipo } = db;

/**
 * Controlador de Componentes de Equipo
 * Maneja operaciones de componentes asociados a equipos
 */

/**
 * POST /api/v1/equipos/:equipoId/componentes
 * Crear componente para un equipo
 */
export const createComponente = async (req, res, next) => {
  try {
    const { equipoId } = req.params;
    const componenteData = req.body;

    // Verificar que el equipo existe
    const equipo = await Equipo.findByPk(equipoId);
    if (!equipo) {
      throw new AppError('Equipo no encontrado', 404);
    }

    // Crear componente
    const componente = await ComponenteEquipo.create({
      ...componenteData,
      equipo_id: equipoId,
      activo: true,
    });

    return successResponse(
      res,
      { componente },
      'Componente creado exitosamente',
      201
    );
  } catch (error) {
    logger.error('Error en createComponente controller:', error);
    next(error);
  }
};

/**
 * PUT /api/v1/componentes/:id
 * Actualizar componente
 */
export const updateComponente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const componenteData = req.body;

    const componente = await ComponenteEquipo.findByPk(id);

    if (!componente) {
      throw new AppError('Componente no encontrado', 404);
    }

    // Actualizar campos
    const { nombre, unidad, precio_unitario_uf, descripcion, activo } = componenteData;

    if (nombre !== undefined) componente.nombre = nombre;
    if (unidad !== undefined) componente.unidad = unidad;
    if (precio_unitario_uf !== undefined) componente.precio_unitario_uf = precio_unitario_uf;
    if (descripcion !== undefined) componente.descripcion = descripcion;
    if (activo !== undefined) componente.activo = activo;

    await componente.save();

    return successResponse(
      res,
      { componente },
      'Componente actualizado exitosamente'
    );
  } catch (error) {
    logger.error('Error en updateComponente controller:', error);
    next(error);
  }
};

/**
 * DELETE /api/v1/componentes/:id
 * Eliminar componente (soft delete)
 */
export const deleteComponente = async (req, res, next) => {
  try {
    const { id } = req.params;

    const componente = await ComponenteEquipo.findByPk(id);

    if (!componente) {
      throw new AppError('Componente no encontrado', 404);
    }

    // Soft delete
    componente.activo = false;
    await componente.save();

    return successResponse(
      res,
      { message: 'Componente eliminado exitosamente' },
      'Componente eliminado exitosamente'
    );
  } catch (error) {
    logger.error('Error en deleteComponente controller:', error);
    next(error);
  }
};

export default {
  createComponente,
  updateComponente,
  deleteComponente,
};
