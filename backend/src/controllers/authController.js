import * as authService from '../services/authService.js';
import { successResponse, errorResponse } from '../utils/response.js';
import logger from '../utils/logger.js';

/**
 * Controlador de autenticación
 */

/**
 * POST /api/v1/auth/register
 * Registrar nuevo usuario
 */
export const register = async (req, res, next) => {
  try {
    const { email, nombre, password, roles } = req.body;

    const result = await authService.register(
      { email, nombre, password },
      roles
    );

    return successResponse(
      res,
      {
        usuario: result.usuario,
        token: result.token,
        refreshToken: result.refreshToken,
      },
      'Usuario registrado exitosamente',
      201
    );
  } catch (error) {
    if (error.message === 'El email ya está registrado') {
      return errorResponse(res, error.message, 409);
    }
    logger.error('Error en register controller:', error);
    next(error);
  }
};

/**
 * POST /api/v1/auth/login
 * Login de usuario
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    return successResponse(
      res,
      {
        usuario: result.usuario,
        token: result.token,
        refreshToken: result.refreshToken,
      },
      'Login exitoso'
    );
  } catch (error) {
    if (
      error.message === 'Credenciales inválidas' ||
      error.message.includes('Usuario inactivo') ||
      error.message.includes('solo puede ingresar con Google')
    ) {
      return errorResponse(res, error.message, 401);
    }
    logger.error('Error en login controller:', error);
    next(error);
  }
};

/**
 * POST /api/v1/auth/refresh
 * Renovar token de acceso
 */
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const result = await authService.refreshAccessToken(refreshToken);

    return successResponse(
      res,
      {
        token: result.token,
        usuario: result.usuario,
      },
      'Token renovado exitosamente'
    );
  } catch (error) {
    if (
      error.message.includes('Token') ||
      error.message === 'Usuario no encontrado' ||
      error.message === 'Usuario inactivo'
    ) {
      return errorResponse(res, error.message, 401);
    }
    logger.error('Error en refresh controller:', error);
    next(error);
  }
};

/**
 * GET /api/v1/auth/me
 * Obtener usuario actual (requiere autenticación)
 */
export const me = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const usuario = await authService.getCurrentUser(userId);

    return successResponse(
      res,
      { usuario },
      'Usuario obtenido exitosamente'
    );
  } catch (error) {
    if (error.message === 'Usuario no encontrado') {
      return errorResponse(res, error.message, 404);
    }
    logger.error('Error en me controller:', error);
    next(error);
  }
};

/**
 * POST /api/v1/auth/logout
 * Logout de usuario (opcional - en JWT el cliente elimina el token)
 */
export const logout = async (req, res) => {
  // En JWT stateless, el logout es manejado por el cliente eliminando el token
  // Este endpoint es opcional y solo retorna un mensaje de éxito
  logger.info(`Usuario ${req.user.email} cerró sesión`);

  return successResponse(
    res,
    null,
    'Logout exitoso. Por favor elimine el token del cliente'
  );
};

export default {
  register,
  login,
  refresh,
  me,
  logout,
};
