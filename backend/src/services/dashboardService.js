import db from '../models/index.js';
import logger from '../utils/logger.js';
import { EDP_ESTADOS } from '../utils/constants.js';

const { Cliente, Obra, Edp, Usuario } = db;

/**
 * Servicio de Dashboard
 * Proporciona estadísticas y métricas del sistema
 */

/**
 * Obtener estadísticas generales del dashboard
 *
 * @returns {object} Estadísticas del sistema
 */
export const getStats = async () => {
  try {
    // Consultas en paralelo para mejor performance
    const [
      totalClientes,
      totalObras,
      totalUsuarios,
      obrasActivas,
      totalEdps,
      edpsPorEstado,
    ] = await Promise.all([
      // Total de clientes activos
      Cliente.count({ where: { activo: true } }),

      // Total de obras
      Obra.count(),

      // Total de usuarios activos
      Usuario.count({ where: { activo: true } }),

      // Obras activas
      Obra.count({ where: { activa: true } }),

      // Total de EDPs
      Edp.count(),

      // EDPs agrupados por estado
      Edp.findAll({
        attributes: [
          'estado',
          [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
        ],
        group: ['estado'],
        raw: true,
      }),
    ]);

    // Formatear EDPs por estado
    const edpsEstadoMap = {};
    Object.values(EDP_ESTADOS).forEach((estado) => {
      edpsEstadoMap[estado] = 0;
    });

    edpsPorEstado.forEach((item) => {
      edpsEstadoMap[item.estado] = parseInt(item.count);
    });

    // Calcular EDPs activos (no Cobrados ni Cerrados)
    const edpsActivos = Object.entries(edpsEstadoMap)
      .filter(([estado]) => estado !== EDP_ESTADOS.COBRADO && estado !== EDP_ESTADOS.CERRADO)
      .reduce((sum, [, count]) => sum + count, 0);

    return {
      clientes: {
        total: totalClientes,
        activos: totalClientes,
      },
      obras: {
        total: totalObras,
        activas: obrasActivas,
      },
      usuarios: {
        total: totalUsuarios,
        activos: totalUsuarios,
      },
      edp: {
        total: totalEdps,
        activos: edpsActivos,
        porEstado: edpsEstadoMap,
      },
    };
  } catch (error) {
    logger.error('Error al obtener estadísticas del dashboard:', error);
    throw error;
  }
};

/**
 * Obtener actividad reciente del sistema
 *
 * @param {number} limit - Número de registros a retornar
 * @returns {object} Actividad reciente
 */
export const getRecentActivity = async (limit = 10) => {
  try {
    // EDPs recientes
    const edpsRecientes = await Edp.findAll({
      limit,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['id', 'empresa'],
        },
        {
          model: Obra,
          as: 'obra',
          attributes: ['id', 'nombre'],
        },
      ],
      attributes: ['id', 'codigo', 'estado', 'importe_total', 'created_at'],
    });

    // Clientes recientes
    const clientesRecientes = await Cliente.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      attributes: ['id', 'empresa', 'rut', 'created_at'],
    });

    // Obras recientes
    const obrasRecientes = await Obra.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['id', 'empresa'],
        },
      ],
      attributes: ['id', 'nombre', 'activa', 'created_at'],
    });

    return {
      edpsRecientes,
      clientesRecientes,
      obrasRecientes,
    };
  } catch (error) {
    logger.error('Error al obtener actividad reciente:', error);
    throw error;
  }
};

export default {
  getStats,
  getRecentActivity,
};
