import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { errorResponse } from '../utils/response.js';
import logger from '../utils/logger.js';

/**
 * Middleware para verificar el token JWT
 * Extrae el token del header Authorization: Bearer <token>
 * Verifica el token y adjunta el usuario a req.user
 */
export const verifyToken = async (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(
        res,
        'Token de autenticación no proporcionado',
        401
      );
    }

    // Extraer token (formato: "Bearer <token>")
    const token = authHeader.split(' ')[1];

    if (!token) {
      return errorResponse(
        res,
        'Token de autenticación inválido',
        401
      );
    }

    // Verificar token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Adjuntar información del usuario a la request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      roles: decoded.roles || [],
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(
        res,
        'Token expirado. Por favor, inicie sesión nuevamente',
        401
      );
    }

    if (error.name === 'JsonWebTokenError') {
      return errorResponse(
        res,
        'Token inválido',
        401
      );
    }

    logger.error('Error al verificar token:', error);
    return errorResponse(
      res,
      'Error al verificar autenticación',
      500
    );
  }
};

/**
 * Middleware opcional para verificar token
 * Si hay token, lo verifica, pero no falla si no hay token
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      if (token) {
        const decoded = jwt.verify(token, config.jwt.secret);
        req.user = {
          id: decoded.id,
          email: decoded.email,
          roles: decoded.roles || [],
        };
      }
    }

    next();
  } catch (error) {
    // Si falla la verificación en modo opcional, simplemente continuamos sin usuario
    logger.debug('Token opcional no válido, continuando sin autenticación');
    next();
  }
};

export default {
  verifyToken,
  optionalAuth,
};
