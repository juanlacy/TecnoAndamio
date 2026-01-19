import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * Servicio para manejo de tokens JWT
 */

/**
 * Genera un token JWT para un usuario
 *
 * @param {object} usuario - Objeto usuario con id, email y roles
 * @returns {string} Token JWT
 */
export const generateToken = (usuario) => {
  try {
    const payload = {
      id: usuario.id,
      email: usuario.email,
      roles: usuario.roles || [],
    };

    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    return token;
  } catch (error) {
    logger.error('Error al generar token:', error);
    throw new Error('Error al generar token de autenticación');
  }
};

/**
 * Genera un refresh token con mayor duración
 *
 * @param {object} usuario - Objeto usuario con id y email
 * @returns {string} Refresh token JWT
 */
export const generateRefreshToken = (usuario) => {
  try {
    const payload = {
      id: usuario.id,
      email: usuario.email,
      type: 'refresh',
    };

    const refreshToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.refreshExpiresIn || '7d',
    });

    return refreshToken;
  } catch (error) {
    logger.error('Error al generar refresh token:', error);
    throw new Error('Error al generar refresh token');
  }
};

/**
 * Verifica un token JWT
 *
 * @param {string} token - Token a verificar
 * @returns {object} Payload decodificado del token
 * @throws {Error} Si el token es inválido o expirado
 */
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expirado');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Token inválido');
    }
    throw error;
  }
};

/**
 * Decodifica un token sin verificarlo
 * Útil para debug o para leer información sin validar
 *
 * @param {string} token - Token a decodificar
 * @returns {object|null} Payload decodificado o null si falla
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    logger.error('Error al decodificar token:', error);
    return null;
  }
};

export default {
  generateToken,
  generateRefreshToken,
  verifyToken,
  decodeToken,
};
