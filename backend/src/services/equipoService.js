import db from '../models/index.js';
import { Op } from 'sequelize';
import { AppError } from '../utils/errors.js';
import logger from '../utils/logger.js';

const { Equipo, CategoriaEquipo, ComponenteEquipo } = db;

/**
 * Service de Equipos
 * Lógica de negocio para CRUD de equipos y componentes
 */

/**
 * Listar equipos con paginación y filtros
 */
export const listEquipos = async ({ categoria_id, disponible = null, activo = null, search = '', page = 1, limit = 10 }) => {
  try {
    const offset = (page - 1) * limit;
    const where = {};

    // Filtro por categoría
    if (categoria_id) {
      where.categoria_id = categoria_id;
    }

    // Filtro por disponibilidad
    if (disponible !== null) {
      where.disponible = disponible;
    }

    // Filtro por estado activo
    if (activo !== null) {
      where.activo = activo;
    }

    // Filtro de búsqueda por nombre o código
    if (search) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { codigo: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Equipo.findAndCountAll({
      where,
      include: [
        {
          model: CategoriaEquipo,
          as: 'categoria',
          attributes: ['id', 'nombre'],
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      order: [['nombre', 'ASC']],
      limit,
      offset,
    });

    return {
      equipos: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  } catch (error) {
    logger.error('Error en listEquipos service:', error);
    throw error;
  }
};

/**
 * Obtener equipo por ID con categoría y componentes
 */
export const getEquipoById = async (id) => {
  try {
    const equipo = await Equipo.findByPk(id, {
      include: [
        {
          model: CategoriaEquipo,
          as: 'categoria',
          attributes: ['id', 'nombre', 'descripcion'],
        },
        {
          model: ComponenteEquipo,
          as: 'componentes',
          where: { activo: true },
          required: false,
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    if (!equipo) {
      throw new AppError('Equipo no encontrado', 404);
    }

    return equipo;
  } catch (error) {
    logger.error('Error en getEquipoById service:', error);
    throw error;
  }
};

/**
 * Crear nuevo equipo
 */
export const createEquipo = async (equipoData) => {
  try {
    const {
      categoria_id,
      nombre,
      codigo,
      descripcion,
      especificaciones,
      disponible,
      activo,
    } = equipoData;

    // Verificar que la categoría existe
    const categoria = await CategoriaEquipo.findByPk(categoria_id);
    if (!categoria) {
      throw new AppError('Categoría no encontrada', 404);
    }

    // Verificar que el código no exista
    const existeEquipo = await Equipo.findOne({
      where: { codigo },
    });

    if (existeEquipo) {
      throw new AppError('Ya existe un equipo con este código', 409);
    }

    // Crear equipo
    const equipo = await Equipo.create({
      categoria_id,
      nombre,
      codigo,
      descripcion,
      especificaciones,
      disponible: disponible !== undefined ? disponible : true,
      activo: activo !== undefined ? activo : true,
    });

    // Recargar con relaciones
    const equipoCompleto = await Equipo.findByPk(equipo.id, {
      include: [
        {
          model: CategoriaEquipo,
          as: 'categoria',
          attributes: ['id', 'nombre'],
        },
      ],
    });

    return equipoCompleto;
  } catch (error) {
    logger.error('Error en createEquipo service:', error);
    throw error;
  }
};

/**
 * Actualizar equipo
 */
export const updateEquipo = async (id, equipoData) => {
  try {
    const equipo = await Equipo.findByPk(id);

    if (!equipo) {
      throw new AppError('Equipo no encontrado', 404);
    }

    const {
      categoria_id,
      nombre,
      codigo,
      descripcion,
      especificaciones,
      disponible,
      activo,
    } = equipoData;

    // Si se actualiza la categoría, verificar que existe
    if (categoria_id && categoria_id !== equipo.categoria_id) {
      const categoria = await CategoriaEquipo.findByPk(categoria_id);
      if (!categoria) {
        throw new AppError('Categoría no encontrada', 404);
      }
      equipo.categoria_id = categoria_id;
    }

    // Si se actualiza el código, verificar que no exista
    if (codigo && codigo !== equipo.codigo) {
      const existeOtroEquipo = await Equipo.findOne({
        where: {
          codigo,
          id: { [Op.ne]: id },
        },
      });

      if (existeOtroEquipo) {
        throw new AppError('Ya existe otro equipo con este código', 409);
      }
      equipo.codigo = codigo;
    }

    // Actualizar campos
    if (nombre !== undefined) equipo.nombre = nombre;
    if (descripcion !== undefined) equipo.descripcion = descripcion;
    if (especificaciones !== undefined) equipo.especificaciones = especificaciones;
    if (disponible !== undefined) equipo.disponible = disponible;
    if (activo !== undefined) equipo.activo = activo;

    await equipo.save();

    // Recargar con relaciones
    const equipoActualizado = await Equipo.findByPk(id, {
      include: [
        {
          model: CategoriaEquipo,
          as: 'categoria',
          attributes: ['id', 'nombre'],
        },
      ],
    });

    return equipoActualizado;
  } catch (error) {
    logger.error('Error en updateEquipo service:', error);
    throw error;
  }
};

/**
 * Eliminar equipo (soft delete)
 */
export const deleteEquipo = async (id) => {
  try {
    const equipo = await Equipo.findByPk(id);

    if (!equipo) {
      throw new AppError('Equipo no encontrado', 404);
    }

    // Soft delete
    equipo.activo = false;
    await equipo.save();

    return { message: 'Equipo eliminado exitosamente' };
  } catch (error) {
    logger.error('Error en deleteEquipo service:', error);
    throw error;
  }
};

/**
 * Obtener componentes de un equipo
 */
export const getComponentesByEquipo = async (equipoId) => {
  try {
    const equipo = await Equipo.findByPk(equipoId);

    if (!equipo) {
      throw new AppError('Equipo no encontrado', 404);
    }

    const componentes = await ComponenteEquipo.findAll({
      where: {
        equipo_id: equipoId,
        activo: true,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      order: [['nombre', 'ASC']],
    });

    return componentes;
  } catch (error) {
    logger.error('Error en getComponentesByEquipo service:', error);
    throw error;
  }
};

export default {
  listEquipos,
  getEquipoById,
  createEquipo,
  updateEquipo,
  deleteEquipo,
  getComponentesByEquipo,
};
