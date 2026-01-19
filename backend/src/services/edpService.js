import db from '../models/index.js';
import { Op } from 'sequelize';
import { AppError } from '../utils/errors.js';
import logger from '../utils/logger.js';

const { Edp, Cliente, Obra, Usuario, EdpEquipo, EdpServicio, EdpEstadoHistorico, Equipo, TipoServicio } = db;

/**
 * Service de EDP (Estados de Pago)
 * Lógica de negocio compleja con estados e historial
 */

/**
 * Estados válidos de EDP
 */
const ESTADOS_VALIDOS = ['Borrador', 'Abierto', 'Cerrado', 'Validado', 'Facturado', 'Cobrado'];

/**
 * Transiciones de estado válidas
 */
const TRANSICIONES_VALIDAS = {
  'Borrador': ['Abierto'],
  'Abierto': ['Cerrado'],
  'Cerrado': ['Validado', 'Abierto'], // Se puede reabrir
  'Validado': ['Facturado'],
  'Facturado': ['Cobrado'],
  'Cobrado': [], // Estado final
};

/**
 * Listar EDPs con paginación y filtros
 */
export const listEdps = async ({ estado, cliente_id, obra_id, search = '', page = 1, limit = 10 }) => {
  try {
    const offset = (page - 1) * limit;
    const where = {};

    // Filtro por estado
    if (estado) {
      where.estado = estado;
    }

    // Filtro por cliente
    if (cliente_id) {
      where.cliente_id = cliente_id;
    }

    // Filtro por obra
    if (obra_id) {
      where.obra_id = obra_id;
    }

    // Filtro de búsqueda por código
    if (search) {
      where.codigo = {
        [Op.like]: `%${search}%`,
      };
    }

    const { count, rows } = await Edp.findAndCountAll({
      where,
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['id', 'empresa', 'rut'],
        },
        {
          model: Obra,
          as: 'obra',
          attributes: ['id', 'nombre', 'direccion'],
        },
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email'],
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      order: [['fecha_inicio', 'DESC']],
      limit,
      offset,
    });

    return {
      edps: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  } catch (error) {
    logger.error('Error en listEdps service:', error);
    throw error;
  }
};

/**
 * Obtener EDP por ID con todas las relaciones
 */
export const getEdpById = async (id) => {
  try {
    const edp = await Edp.findByPk(id, {
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['id', 'empresa', 'rut', 'direccion'],
        },
        {
          model: Obra,
          as: 'obra',
          attributes: ['id', 'nombre', 'direccion'],
        },
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email'],
        },
        {
          model: EdpEquipo,
          as: 'equipos',
          include: [
            {
              model: Equipo,
              as: 'equipo',
              attributes: ['id', 'nombre', 'codigo'],
            },
            {
              model: EdpServicio,
              as: 'servicios',
              include: [
                {
                  model: TipoServicio,
                  as: 'tipoServicio',
                  attributes: ['id', 'nombre'],
                },
              ],
            },
          ],
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    if (!edp) {
      throw new AppError('EDP no encontrado', 404);
    }

    return edp;
  } catch (error) {
    logger.error('Error en getEdpById service:', error);
    throw error;
  }
};

/**
 * Crear nuevo EDP
 */
export const createEdp = async (edpData, usuarioId) => {
  const t = await db.sequelize.transaction();

  try {
    const { codigo, cliente_id, obra_id, fecha_inicio, fecha_termino, observaciones, comentarios } = edpData;

    // Verificar que el código no exista
    const existeEdp = await Edp.findOne({
      where: { codigo },
    });

    if (existeEdp) {
      throw new AppError('Ya existe un EDP con este código', 409);
    }

    // Verificar que el cliente existe
    const cliente = await Cliente.findByPk(cliente_id);
    if (!cliente) {
      throw new AppError('Cliente no encontrado', 404);
    }

    // Verificar que la obra existe y pertenece al cliente
    const obra = await Obra.findByPk(obra_id);
    if (!obra) {
      throw new AppError('Obra no encontrada', 404);
    }
    if (obra.cliente_id !== cliente_id) {
      throw new AppError('La obra no pertenece al cliente especificado', 400);
    }

    // Crear EDP con estado inicial Borrador
    const edp = await Edp.create({
      codigo,
      cliente_id,
      obra_id,
      fecha_inicio,
      fecha_termino,
      comentarios: observaciones || comentarios || null,
      estado: 'Borrador',
      importe_total: 0,
      usuario_id: usuarioId,
    }, { transaction: t });

    // Registrar en historial
    await EdpEstadoHistorico.create({
      edp_id: edp.id,
      estado_anterior: null,
      estado_nuevo: 'Borrador',
      usuario_id: usuarioId,
      comentario: 'EDP creado',
    }, { transaction: t });

    await t.commit();

    // Recargar con relaciones
    return await getEdpById(edp.id);
  } catch (error) {
    await t.rollback();
    logger.error('Error en createEdp service:', error);
    throw error;
  }
};

/**
 * Actualizar EDP (solo si estado = Borrador)
 */
export const updateEdp = async (id, edpData) => {
  try {
    const edp = await Edp.findByPk(id);

    if (!edp) {
      throw new AppError('EDP no encontrado', 404);
    }

    // Solo se puede editar si está en Borrador
    if (edp.estado !== 'Borrador') {
      throw new AppError('Solo se pueden editar EDPs en estado Borrador', 400);
    }

    const { codigo, fecha_inicio, fecha_termino, observaciones, comentarios } = edpData;

    // Si se actualiza el código, verificar que no exista
    if (codigo && codigo !== edp.codigo) {
      const existeOtroEdp = await Edp.findOne({
        where: {
          codigo,
          id: { [Op.ne]: id },
        },
      });

      if (existeOtroEdp) {
        throw new AppError('Ya existe otro EDP con este código', 409);
      }
      edp.codigo = codigo;
    }

    // Validar fechas
    if (fecha_inicio && fecha_termino) {
      if (new Date(fecha_termino) <= new Date(fecha_inicio)) {
        throw new AppError('Fecha de término debe ser posterior a fecha de inicio', 400);
      }
    }

    // Actualizar campos
    if (fecha_inicio !== undefined) edp.fecha_inicio = fecha_inicio;
    if (fecha_termino !== undefined) edp.fecha_termino = fecha_termino;
    if (observaciones !== undefined || comentarios !== undefined) {
      edp.comentarios = observaciones || comentarios;
    }

    await edp.save();

    return await getEdpById(id);
  } catch (error) {
    logger.error('Error en updateEdp service:', error);
    throw error;
  }
};

/**
 * Eliminar EDP (solo si estado = Borrador)
 */
export const deleteEdp = async (id) => {
  const t = await db.sequelize.transaction();

  try {
    const edp = await Edp.findByPk(id);

    if (!edp) {
      throw new AppError('EDP no encontrado', 404);
    }

    // Solo se puede eliminar si está en Borrador
    if (edp.estado !== 'Borrador') {
      throw new AppError('Solo se pueden eliminar EDPs en estado Borrador', 400);
    }

    // Eliminar equipos, servicios e historial asociados
    await EdpServicio.destroy({
      where: { edp_equipo_id: { [Op.in]: await EdpEquipo.findAll({ where: { edp_id: id }, attributes: ['id'], raw: true }).then(r => r.map(e => e.id)) } },
      transaction: t,
    });

    await EdpEquipo.destroy({ where: { edp_id: id }, transaction: t });
    await EdpEstadoHistorico.destroy({ where: { edp_id: id }, transaction: t });
    await edp.destroy({ transaction: t });

    await t.commit();

    return { message: 'EDP eliminado exitosamente' };
  } catch (error) {
    await t.rollback();
    logger.error('Error en deleteEdp service:', error);
    throw error;
  }
};

/**
 * Cambiar estado de EDP con validación de transiciones
 */
export const cambiarEstado = async (id, nuevoEstado, comentario, usuarioId) => {
  const t = await db.sequelize.transaction();

  try {
    const edp = await Edp.findByPk(id);

    if (!edp) {
      throw new AppError('EDP no encontrado', 404);
    }

    const estadoActual = edp.estado;

    // Validar que el nuevo estado sea válido
    if (!ESTADOS_VALIDOS.includes(nuevoEstado)) {
      throw new AppError('Estado no válido', 400);
    }

    // Si el estado es el mismo, no hacer nada
    if (estadoActual === nuevoEstado) {
      throw new AppError('El EDP ya está en este estado', 400);
    }

    // Validar transición
    const transicionesPermitidas = TRANSICIONES_VALIDAS[estadoActual] || [];
    if (!transicionesPermitidas.includes(nuevoEstado)) {
      throw new AppError(
        `No se puede cambiar de ${estadoActual} a ${nuevoEstado}. Transiciones permitidas: ${transicionesPermitidas.join(', ')}`,
        400
      );
    }

    // Actualizar estado
    edp.estado = nuevoEstado;
    await edp.save({ transaction: t });

    // Registrar en historial
    await EdpEstadoHistorico.create({
      edp_id: id,
      estado_anterior: estadoActual,
      estado_nuevo: nuevoEstado,
      usuario_id: usuarioId,
      comentario: comentario || `Cambio de estado de ${estadoActual} a ${nuevoEstado}`,
    }, { transaction: t });

    await t.commit();

    return await getEdpById(id);
  } catch (error) {
    await t.rollback();
    logger.error('Error en cambiarEstado service:', error);
    throw error;
  }
};

/**
 * Obtener historial de cambios de estado
 */
export const getHistorial = async (id) => {
  try {
    const edp = await Edp.findByPk(id);

    if (!edp) {
      throw new AppError('EDP no encontrado', 404);
    }

    const historial = await EdpEstadoHistorico.findAll({
      where: { edp_id: id },
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email'],
        },
      ],
      order: [['fecha_cambio', 'ASC']],
    });

    return historial;
  } catch (error) {
    logger.error('Error en getHistorial service:', error);
    throw error;
  }
};

export default {
  listEdps,
  getEdpById,
  createEdp,
  updateEdp,
  deleteEdp,
  cambiarEstado,
  getHistorial,
};
