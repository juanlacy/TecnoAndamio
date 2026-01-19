import db from '../models/index.js';
import { Op } from 'sequelize';
import { AppError } from '../utils/errors.js';
import logger from '../utils/logger.js';
import { validarRut, formatearRut } from '../utils/rutValidator.js';

const { Cliente, Contacto, Obra, Usuario } = db;

/**
 * Service de Clientes
 * Lógica de negocio para CRUD de clientes
 */

/**
 * Listar clientes con paginación y filtros
 */
export const listClientes = async ({ search = '', rut = '', activo = null, page = 1, limit = 10 }) => {
  try {
    const offset = (page - 1) * limit;
    const where = {};

    // Filtro de búsqueda por empresa
    if (search) {
      where.empresa = {
        [Op.like]: `%${search}%`,
      };
    }

    // Filtro por RUT
    if (rut) {
      // Limpiar y formatear RUT para búsqueda
      const rutLimpio = rut.replace(/[.-]/g, '');
      where.rut = {
        [Op.like]: `%${rutLimpio}%`,
      };
    }

    // Filtro por estado activo
    if (activo !== null) {
      where.activo = activo;
    }

    const { count, rows } = await Cliente.findAndCountAll({
      where,
      include: [
        {
          model: Usuario,
          as: 'responsable',
          attributes: ['id', 'nombre', 'email'],
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      order: [['empresa', 'ASC']],
      limit,
      offset,
    });

    return {
      clientes: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  } catch (error) {
    logger.error('Error en listClientes service:', error);
    throw error;
  }
};

/**
 * Obtener cliente por ID con contactos y obras
 */
export const getClienteById = async (id) => {
  try {
    const cliente = await Cliente.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: 'responsable',
          attributes: ['id', 'nombre', 'email'],
        },
        {
          model: Contacto,
          as: 'contactos',
          where: { activo: true },
          required: false,
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
        {
          model: Obra,
          as: 'obras',
          required: false,
          attributes: ['id', 'nombre', 'direccion', 'activa', 'fecha_inicio'],
          order: [['fecha_inicio', 'DESC']],
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    if (!cliente) {
      throw new AppError('Cliente no encontrado', 404);
    }

    return cliente;
  } catch (error) {
    logger.error('Error en getClienteById service:', error);
    throw error;
  }
};

/**
 * Crear nuevo cliente
 */
export const createCliente = async (clienteData) => {
  try {
    const { rut, empresa, direccion, rubro, correo_empresa, telefono_empresa, usuario_responsable_id } = clienteData;

    // Validar RUT
    if (!validarRut(rut)) {
      throw new AppError('RUT inválido', 400);
    }

    // Formatear RUT (limpiar y guardar sin formato)
    const rutLimpio = rut.replace(/[.-]/g, '');

    // Verificar que el RUT no exista
    const existeCliente = await Cliente.findOne({
      where: { rut: rutLimpio },
    });

    if (existeCliente) {
      throw new AppError('Ya existe un cliente con este RUT', 409);
    }

    // Verificar que el usuario responsable exista (si se proporciona)
    if (usuario_responsable_id) {
      const usuarioExiste = await Usuario.findByPk(usuario_responsable_id);
      if (!usuarioExiste) {
        throw new AppError('Usuario responsable no encontrado', 404);
      }
    }

    // Crear cliente
    const cliente = await Cliente.create({
      empresa,
      rut: rutLimpio,
      direccion,
      rubro,
      correo_empresa,
      telefono_empresa,
      usuario_responsable_id,
      activo: true,
    });

    // Recargar con relaciones
    const clienteCompleto = await Cliente.findByPk(cliente.id, {
      include: [
        {
          model: Usuario,
          as: 'responsable',
          attributes: ['id', 'nombre', 'email'],
        },
      ],
    });

    return clienteCompleto;
  } catch (error) {
    logger.error('Error en createCliente service:', error);
    throw error;
  }
};

/**
 * Actualizar cliente
 */
export const updateCliente = async (id, clienteData) => {
  try {
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      throw new AppError('Cliente no encontrado', 404);
    }

    const { rut, empresa, direccion, rubro, correo_empresa, telefono_empresa, usuario_responsable_id, activo } = clienteData;

    // Si se actualiza el RUT, validar y verificar unicidad
    if (rut && rut !== cliente.rut) {
      if (!validarRut(rut)) {
        throw new AppError('RUT inválido', 400);
      }

      const rutLimpio = rut.replace(/[.-]/g, '');

      const existeOtroCliente = await Cliente.findOne({
        where: {
          rut: rutLimpio,
          id: { [Op.ne]: id },
        },
      });

      if (existeOtroCliente) {
        throw new AppError('Ya existe otro cliente con este RUT', 409);
      }

      cliente.rut = rutLimpio;
    }

    // Verificar que el usuario responsable exista (si se proporciona)
    if (usuario_responsable_id) {
      const usuarioExiste = await Usuario.findByPk(usuario_responsable_id);
      if (!usuarioExiste) {
        throw new AppError('Usuario responsable no encontrado', 404);
      }
      cliente.usuario_responsable_id = usuario_responsable_id;
    }

    // Actualizar campos
    if (empresa !== undefined) cliente.empresa = empresa;
    if (direccion !== undefined) cliente.direccion = direccion;
    if (rubro !== undefined) cliente.rubro = rubro;
    if (correo_empresa !== undefined) cliente.correo_empresa = correo_empresa;
    if (telefono_empresa !== undefined) cliente.telefono_empresa = telefono_empresa;
    if (activo !== undefined) cliente.activo = activo;

    await cliente.save();

    // Recargar con relaciones
    const clienteActualizado = await Cliente.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: 'responsable',
          attributes: ['id', 'nombre', 'email'],
        },
      ],
    });

    return clienteActualizado;
  } catch (error) {
    logger.error('Error en updateCliente service:', error);
    throw error;
  }
};

/**
 * Eliminar cliente (soft delete)
 */
export const deleteCliente = async (id) => {
  try {
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      throw new AppError('Cliente no encontrado', 404);
    }

    // Soft delete
    cliente.activo = false;
    await cliente.save();

    return { message: 'Cliente eliminado exitosamente' };
  } catch (error) {
    logger.error('Error en deleteCliente service:', error);
    throw error;
  }
};

/**
 * Obtener contactos de un cliente
 */
export const getContactosByCliente = async (clienteId) => {
  try {
    const cliente = await Cliente.findByPk(clienteId);

    if (!cliente) {
      throw new AppError('Cliente no encontrado', 404);
    }

    const contactos = await Contacto.findAll({
      where: {
        cliente_id: clienteId,
        activo: true,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      order: [
        ['principal', 'DESC'],
        ['nombre', 'ASC'],
      ],
    });

    return contactos;
  } catch (error) {
    logger.error('Error en getContactosByCliente service:', error);
    throw error;
  }
};

/**
 * Obtener obras de un cliente
 */
export const getObrasByCliente = async (clienteId) => {
  try {
    const cliente = await Cliente.findByPk(clienteId);

    if (!cliente) {
      throw new AppError('Cliente no encontrado', 404);
    }

    const obras = await Obra.findAll({
      where: {
        cliente_id: clienteId,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      order: [['fecha_inicio', 'DESC']],
    });

    return obras;
  } catch (error) {
    logger.error('Error en getObrasByCliente service:', error);
    throw error;
  }
};

export default {
  listClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
  getContactosByCliente,
  getObrasByCliente,
};
