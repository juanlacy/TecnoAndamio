import db from '../models/index.js';
import { Op } from 'sequelize';
import { AppError } from '../utils/errors.js';
import logger from '../utils/logger.js';

const { Obra, Cliente, Usuario } = db;

/**
 * Service de Obras
 * Lógica de negocio para CRUD de obras
 */

/**
 * Listar obras con paginación y filtros
 */
export const listObras = async ({ cliente_id, activa = null, search = '', page = 1, limit = 10 }) => {
  try {
    const offset = (page - 1) * limit;
    const where = {};

    // Filtro por cliente
    if (cliente_id) {
      where.cliente_id = cliente_id;
    }

    // Filtro por estado activa
    if (activa !== null) {
      where.activa = activa;
    }

    // Filtro de búsqueda por nombre
    if (search) {
      where.nombre = {
        [Op.like]: `%${search}%`,
      };
    }

    const { count, rows } = await Obra.findAndCountAll({
      where,
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['id', 'empresa', 'rut'],
        },
        {
          model: Usuario,
          as: 'responsable',
          attributes: ['id', 'nombre', 'email'],
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      order: [['created_at', 'DESC']], // Usar created_at en lugar de fecha_inicio
      limit,
      offset,
    });

    return {
      obras: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  } catch (error) {
    logger.error('Error en listObras service:', error);
    throw error;
  }
};

/**
 * Obtener obra por ID con relaciones
 */
export const getObraById = async (id) => {
  try {
    const obra = await Obra.findByPk(id, {
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['id', 'empresa', 'rut', 'direccion'],
        },
        {
          model: Usuario,
          as: 'responsable',
          attributes: ['id', 'nombre', 'email'],
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    if (!obra) {
      throw new AppError('Obra no encontrada', 404);
    }

    return obra;
  } catch (error) {
    logger.error('Error en getObraById service:', error);
    throw error;
  }
};

/**
 * Crear nueva obra
 */
export const createObra = async (obraData) => {
  try {
    const {
      codigo,
      cliente_id,
      nombre,
      descripcion,
      direccion,
      ciudad,
      region,
      responsable_id,
      fecha_inicio,
      fecha_termino_estimada,
      estado,
      activo,
    } = obraData;

    // Verificar que el cliente existe
    const cliente = await Cliente.findByPk(cliente_id);
    if (!cliente) {
      throw new AppError('Cliente no encontrado', 404);
    }

    // Verificar que el usuario responsable existe (si se proporciona)
    if (responsable_id) {
      const responsable = await Usuario.findByPk(responsable_id);
      if (!responsable) {
        throw new AppError('Usuario responsable no encontrado', 404);
      }
    }

    // Validar rango de fechas si ambas están presentes
    if (fecha_termino_estimada && fecha_inicio) {
      if (new Date(fecha_termino_estimada) < new Date(fecha_inicio)) {
        throw new AppError('La fecha de término debe ser posterior a la fecha de inicio', 400);
      }
    }

    // Crear obra
    const obra = await Obra.create({
      codigo,
      cliente_id,
      nombre,
      descripcion,
      direccion,
      ciudad,
      region,
      responsable_id,
      fecha_inicio,
      fecha_termino_estimada,
      estado: estado || 'planificacion',
      activa: activo !== undefined ? activo : true,
    });

    // Recargar con relaciones
    const obraCompleta = await Obra.findByPk(obra.id, {
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['id', 'empresa', 'rut'],
        },
        {
          model: Usuario,
          as: 'responsable',
          attributes: ['id', 'nombre', 'email'],
        },
      ],
    });

    return obraCompleta;
  } catch (error) {
    logger.error('Error en createObra service:', error);
    throw error;
  }
};

/**
 * Actualizar obra
 */
export const updateObra = async (id, obraData) => {
  try {
    const obra = await Obra.findByPk(id);

    if (!obra) {
      throw new AppError('Obra no encontrada', 404);
    }

    const {
      codigo,
      nombre,
      descripcion,
      direccion,
      ciudad,
      region,
      responsable_id,
      fecha_inicio,
      fecha_termino_estimada,
      estado,
      activo,
    } = obraData;

    // Verificar que el usuario responsable existe (si se proporciona)
    if (responsable_id) {
      const responsable = await Usuario.findByPk(responsable_id);
      if (!responsable) {
        throw new AppError('Usuario responsable no encontrado', 404);
      }
    }

    // Validar rango de fechas
    const nuevaFechaInicio = fecha_inicio || obra.fecha_inicio;
    const nuevaFechaTermino = fecha_termino_estimada !== undefined ? fecha_termino_estimada : obra.fecha_termino_estimada;

    if (nuevaFechaTermino && nuevaFechaInicio && new Date(nuevaFechaTermino) < new Date(nuevaFechaInicio)) {
      throw new AppError('La fecha de término debe ser posterior a la fecha de inicio', 400);
    }

    // Actualizar campos
    if (codigo !== undefined) obra.codigo = codigo;
    if (nombre !== undefined) obra.nombre = nombre;
    if (descripcion !== undefined) obra.descripcion = descripcion;
    if (direccion !== undefined) obra.direccion = direccion;
    if (ciudad !== undefined) obra.ciudad = ciudad;
    if (region !== undefined) obra.region = region;
    if (responsable_id !== undefined) obra.responsable_id = responsable_id;
    if (fecha_inicio !== undefined) obra.fecha_inicio = fecha_inicio;
    if (fecha_termino_estimada !== undefined) obra.fecha_termino_estimada = fecha_termino_estimada;
    if (estado !== undefined) obra.estado = estado;
    if (activo !== undefined) obra.activa = activo;

    await obra.save();

    // Recargar con relaciones
    const obraActualizada = await Obra.findByPk(id, {
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['id', 'empresa', 'rut'],
        },
        {
          model: Usuario,
          as: 'responsable',
          attributes: ['id', 'nombre', 'email'],
        },
      ],
    });

    return obraActualizada;
  } catch (error) {
    logger.error('Error en updateObra service:', error);
    throw error;
  }
};

/**
 * Eliminar obra (soft delete)
 */
export const deleteObra = async (id) => {
  try {
    const obra = await Obra.findByPk(id);

    if (!obra) {
      throw new AppError('Obra no encontrada', 404);
    }

    // Soft delete - marcar como inactiva
    obra.activa = false;
    await obra.save();

    return { message: 'Obra eliminada exitosamente' };
  } catch (error) {
    logger.error('Error en deleteObra service:', error);
    throw error;
  }
};

export default {
  listObras,
  getObraById,
  createObra,
  updateObra,
  deleteObra,
};
