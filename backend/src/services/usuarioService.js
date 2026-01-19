import { Op } from 'sequelize';
import db from '../models/index.js';
import { hashPassword } from './authService.js';
import logger from '../utils/logger.js';
import { PAGINATION } from '../utils/constants.js';

const { Usuario, Rol, UsuarioRol } = db;

/**
 * Servicio de Usuarios
 */

/**
 * Listar usuarios con paginación y filtros
 *
 * @param {object} filters - Filtros de búsqueda
 * @returns {object} Usuarios paginados
 */
export const listUsuarios = async (filters = {}) => {
  try {
    const {
      search = '',
      activo,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
    } = filters;

    // Construir condiciones WHERE
    const where = {};

    if (search) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    if (activo !== undefined) {
      where.activo = activo;
    }

    // Calcular offset
    const offset = (page - 1) * limit;

    // Consulta con paginación
    const { count, rows } = await Usuario.findAndCountAll({
      where,
      include: [
        {
          model: Rol,
          as: 'roles',
          through: { attributes: [] },
          attributes: ['id', 'nombre'],
        },
      ],
      attributes: { exclude: ['password_hash', 'google_id'] },
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    return {
      usuarios: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    };
  } catch (error) {
    logger.error('Error al listar usuarios:', error);
    throw error;
  }
};

/**
 * Obtener usuario por ID
 *
 * @param {number} id - ID del usuario
 * @returns {object} Usuario
 */
export const getUsuarioById = async (id) => {
  try {
    const usuario = await Usuario.findByPk(id, {
      include: [
        {
          model: Rol,
          as: 'roles',
          through: { attributes: [] },
          attributes: ['id', 'nombre', 'descripcion'],
        },
      ],
      attributes: { exclude: ['password_hash'] },
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    return usuario;
  } catch (error) {
    logger.error('Error al obtener usuario:', error);
    throw error;
  }
};

/**
 * Crear nuevo usuario
 *
 * @param {object} usuarioData - Datos del usuario
 * @param {Array<number>} rolesIds - IDs de roles a asignar
 * @returns {object} Usuario creado
 */
export const createUsuario = async (usuarioData, rolesIds = []) => {
  try {
    const { email, nombre, password, activo = true } = usuarioData;

    // Verificar si el email ya existe
    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      throw new Error('El email ya está registrado');
    }

    // Hashear password
    const passwordHash = await hashPassword(password);

    // Crear usuario
    const usuario = await Usuario.create({
      email,
      nombre,
      password_hash: passwordHash,
      activo,
    });

    // Asignar roles
    if (rolesIds && rolesIds.length > 0) {
      const roles = await Rol.findAll({
        where: { id: rolesIds },
      });

      if (roles.length === 0) {
        // Si no se encontraron roles, asignar Operador por defecto
        const rolOperador = await Rol.findOne({ where: { nombre: 'Operador' } });
        if (rolOperador) {
          await UsuarioRol.create({
            usuario_id: usuario.id,
            rol_id: rolOperador.id,
          });
        }
      } else {
        await Promise.all(
          roles.map((rol) =>
            UsuarioRol.create({
              usuario_id: usuario.id,
              rol_id: rol.id,
            })
          )
        );
      }
    } else {
      // Asignar rol Operador por defecto
      const rolOperador = await Rol.findOne({ where: { nombre: 'Operador' } });
      if (rolOperador) {
        await UsuarioRol.create({
          usuario_id: usuario.id,
          rol_id: rolOperador.id,
        });
      }
    }

    // Retornar usuario con roles
    return await getUsuarioById(usuario.id);
  } catch (error) {
    logger.error('Error al crear usuario:', error);
    throw error;
  }
};

/**
 * Actualizar usuario
 *
 * @param {number} id - ID del usuario
 * @param {object} usuarioData - Datos a actualizar
 * @param {Array<number>} rolesIds - IDs de roles a asignar
 * @returns {object} Usuario actualizado
 */
export const updateUsuario = async (id, usuarioData, rolesIds) => {
  try {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const { email, nombre, password, activo } = usuarioData;

    // Verificar email único (si se está cambiando)
    if (email && email !== usuario.email) {
      const existente = await Usuario.findOne({ where: { email } });
      if (existente) {
        throw new Error('El email ya está registrado');
      }
    }

    // Preparar datos a actualizar
    const updateData = {};
    if (email) updateData.email = email;
    if (nombre) updateData.nombre = nombre;
    if (activo !== undefined) updateData.activo = activo;

    // Si se proporciona password, hashearlo
    if (password) {
      updateData.password_hash = await hashPassword(password);
    }

    // Actualizar usuario
    await usuario.update(updateData);

    // Actualizar roles si se proporcionan
    if (rolesIds && Array.isArray(rolesIds)) {
      // Eliminar roles actuales
      await UsuarioRol.destroy({ where: { usuario_id: id } });

      // Asignar nuevos roles
      if (rolesIds.length > 0) {
        const roles = await Rol.findAll({
          where: { id: rolesIds },
        });

        await Promise.all(
          roles.map((rol) =>
            UsuarioRol.create({
              usuario_id: usuario.id,
              rol_id: rol.id,
            })
          )
        );
      }
    }

    // Retornar usuario actualizado con roles
    return await getUsuarioById(id);
  } catch (error) {
    logger.error('Error al actualizar usuario:', error);
    throw error;
  }
};

/**
 * Eliminar usuario (soft delete - cambiar activo a false)
 *
 * @param {number} id - ID del usuario
 * @returns {boolean} true si se eliminó correctamente
 */
export const deleteUsuario = async (id) => {
  try {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // Soft delete - cambiar activo a false
    await usuario.update({ activo: false });

    logger.info(`Usuario ${id} desactivado`);
    return true;
  } catch (error) {
    logger.error('Error al eliminar usuario:', error);
    throw error;
  }
};

export default {
  listUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
};
