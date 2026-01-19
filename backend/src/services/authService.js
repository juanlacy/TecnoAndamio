import bcrypt from 'bcryptjs';
import db from '../models/index.js';
import { generateToken, generateRefreshToken, verifyToken } from './tokenService.js';
import logger from '../utils/logger.js';
import { ROLES } from '../utils/constants.js';

const { Usuario, Rol, UsuarioRol } = db;

/**
 * Servicio de autenticación
 */

/**
 * Registrar un nuevo usuario
 *
 * @param {object} userData - Datos del usuario (email, nombre, password)
 * @param {Array<string>} rolesNombres - Nombres de los roles a asignar (opcional)
 * @returns {object} Usuario creado con token
 */
export const register = async (userData, rolesNombres = [ROLES.OPERADOR]) => {
  try {
    const { email, nombre, password } = userData;

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      throw new Error('El email ya está registrado');
    }

    // Hashear password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear usuario
    const usuario = await Usuario.create({
      email,
      nombre,
      password_hash: passwordHash,
      activo: true,
    });

    // Asignar roles
    const roles = await Rol.findAll({
      where: {
        nombre: rolesNombres,
      },
    });

    if (roles.length === 0) {
      // Si no se encontraron roles, asignar Operador por defecto
      const rolOperador = await Rol.findOne({ where: { nombre: ROLES.OPERADOR } });
      if (rolOperador) {
        await UsuarioRol.create({
          usuario_id: usuario.id,
          rol_id: rolOperador.id,
        });
      }
    } else {
      // Asignar los roles encontrados
      await Promise.all(
        roles.map((rol) =>
          UsuarioRol.create({
            usuario_id: usuario.id,
            rol_id: rol.id,
          })
        )
      );
    }

    // Obtener usuario con roles para generar token
    const usuarioConRoles = await Usuario.findByPk(usuario.id, {
      include: [
        {
          model: Rol,
          as: 'roles',
          through: { attributes: [] },
        },
      ],
    });

    const rolesUsuario = usuarioConRoles.roles.map((rol) => rol.nombre);

    // Generar tokens
    const token = generateToken({
      id: usuario.id,
      email: usuario.email,
      roles: rolesUsuario,
    });

    const refreshToken = generateRefreshToken({
      id: usuario.id,
      email: usuario.email,
    });

    logger.info(`Usuario registrado: ${email}`);

    return {
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        roles: rolesUsuario,
        activo: usuario.activo,
      },
      token,
      refreshToken,
    };
  } catch (error) {
    logger.error('Error al registrar usuario:', error);
    throw error;
  }
};

/**
 * Login de usuario con email y password
 *
 * @param {string} email - Email del usuario
 * @param {string} password - Password del usuario
 * @returns {object} Usuario con token
 */
export const login = async (email, password) => {
  try {
    // Buscar usuario con roles
    const usuario = await Usuario.findOne({
      where: { email },
      include: [
        {
          model: Rol,
          as: 'roles',
          through: { attributes: [] },
        },
      ],
    });

    if (!usuario) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      throw new Error('Usuario inactivo. Contacte al administrador');
    }

    // Verificar password (solo si tiene password_hash, podría ser usuario de Google)
    if (!usuario.password_hash) {
      throw new Error('Este usuario solo puede ingresar con Google');
    }

    const passwordValido = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValido) {
      throw new Error('Credenciales inválidas');
    }

    const rolesUsuario = usuario.roles.map((rol) => rol.nombre);

    // Generar tokens
    const token = generateToken({
      id: usuario.id,
      email: usuario.email,
      roles: rolesUsuario,
    });

    const refreshToken = generateRefreshToken({
      id: usuario.id,
      email: usuario.email,
    });

    logger.info(`Usuario autenticado: ${email}`);

    return {
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        roles: rolesUsuario,
        activo: usuario.activo,
      },
      token,
      refreshToken,
    };
  } catch (error) {
    logger.error('Error al hacer login:', error);
    throw error;
  }
};

/**
 * Renovar token usando refresh token
 *
 * @param {string} refreshToken - Refresh token
 * @returns {object} Nuevo token de acceso
 */
export const refreshAccessToken = async (refreshToken) => {
  try {
    // Verificar refresh token
    const decoded = verifyToken(refreshToken);

    if (decoded.type !== 'refresh') {
      throw new Error('Token inválido');
    }

    // Buscar usuario con roles
    const usuario = await Usuario.findByPk(decoded.id, {
      include: [
        {
          model: Rol,
          as: 'roles',
          through: { attributes: [] },
        },
      ],
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    if (!usuario.activo) {
      throw new Error('Usuario inactivo');
    }

    const rolesUsuario = usuario.roles.map((rol) => rol.nombre);

    // Generar nuevo token de acceso
    const token = generateToken({
      id: usuario.id,
      email: usuario.email,
      roles: rolesUsuario,
    });

    logger.info(`Token renovado para usuario: ${usuario.email}`);

    return {
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        roles: rolesUsuario,
      },
    };
  } catch (error) {
    logger.error('Error al renovar token:', error);
    throw error;
  }
};

/**
 * Obtener información del usuario actual
 *
 * @param {number} userId - ID del usuario
 * @returns {object} Información del usuario
 */
export const getCurrentUser = async (userId) => {
  try {
    const usuario = await Usuario.findByPk(userId, {
      include: [
        {
          model: Rol,
          as: 'roles',
          through: { attributes: [] },
        },
      ],
      attributes: { exclude: ['password_hash'] },
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const rolesUsuario = usuario.roles.map((rol) => rol.nombre);

    return {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      roles: rolesUsuario,
      activo: usuario.activo,
      google_id: usuario.google_id,
      created_at: usuario.created_at,
      updated_at: usuario.updated_at,
    };
  } catch (error) {
    logger.error('Error al obtener usuario actual:', error);
    throw error;
  }
};

/**
 * Hashear password
 *
 * @param {string} password - Password en texto plano
 * @returns {string} Password hasheado
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Comparar password
 *
 * @param {string} password - Password en texto plano
 * @param {string} hash - Hash almacenado
 * @returns {boolean} true si coinciden
 */
export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

export default {
  register,
  login,
  refreshAccessToken,
  getCurrentUser,
  hashPassword,
  comparePassword,
};
