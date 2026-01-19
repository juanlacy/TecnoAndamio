import { errorResponse } from '../utils/response.js';
import { ROLES, PERMISOS_POR_ROL } from '../utils/constants.js';
import logger from '../utils/logger.js';

/**
 * Middleware para verificar que el usuario tenga uno de los roles permitidos
 * Debe usarse después del middleware verifyToken
 *
 * @param {Array<string>} rolesPermitidos - Array de roles permitidos
 * @returns {Function} Middleware function
 *
 * @example
 * router.get('/admin-only', verifyToken, checkRole([ROLES.ADMIN]), controller);
 */
export const checkRole = (rolesPermitidos) => {
  return (req, res, next) => {
    try {
      // Verificar que el usuario esté autenticado
      if (!req.user) {
        return errorResponse(
          res,
          'Usuario no autenticado',
          401
        );
      }

      // Verificar que el usuario tenga roles
      if (!req.user.roles || req.user.roles.length === 0) {
        return errorResponse(
          res,
          'Usuario sin roles asignados',
          403
        );
      }

      // Verificar si el usuario tiene al menos uno de los roles permitidos
      const tieneRolPermitido = req.user.roles.some(
        (rol) => rolesPermitidos.includes(rol)
      );

      if (!tieneRolPermitido) {
        logger.warn(
          `Usuario ${req.user.email} intentó acceder a recurso que requiere roles: ${rolesPermitidos.join(', ')}`
        );
        return errorResponse(
          res,
          'No tiene permisos para acceder a este recurso',
          403
        );
      }

      next();
    } catch (error) {
      logger.error('Error al verificar rol:', error);
      return errorResponse(
        res,
        'Error al verificar permisos',
        500
      );
    }
  };
};

/**
 * Middleware para verificar que el usuario tenga un permiso específico
 * Debe usarse después del middleware verifyToken
 *
 * @param {string} recurso - Nombre del recurso (ej: 'usuarios', 'clientes')
 * @param {string} accion - Acción a verificar (ej: 'create', 'read', 'update', 'delete')
 * @returns {Function} Middleware function
 *
 * @example
 * router.post('/usuarios', verifyToken, checkPermission('usuarios', 'create'), controller);
 */
export const checkPermission = (recurso, accion) => {
  return (req, res, next) => {
    try {
      // Verificar que el usuario esté autenticado
      if (!req.user) {
        return errorResponse(
          res,
          'Usuario no autenticado',
          401
        );
      }

      // Verificar que el usuario tenga roles
      if (!req.user.roles || req.user.roles.length === 0) {
        return errorResponse(
          res,
          'Usuario sin roles asignados',
          403
        );
      }

      // Verificar permisos para cada rol del usuario
      const tienePermiso = req.user.roles.some((rol) => {
        const permisos = PERMISOS_POR_ROL[rol];
        if (!permisos) return false;

        const permisosRecurso = permisos[recurso];
        if (!permisosRecurso) return false;

        return permisosRecurso.includes(accion);
      });

      if (!tienePermiso) {
        logger.warn(
          `Usuario ${req.user.email} intentó ${accion} en ${recurso} sin permisos`
        );
        return errorResponse(
          res,
          `No tiene permisos para ${accion} en ${recurso}`,
          403
        );
      }

      next();
    } catch (error) {
      logger.error('Error al verificar permiso:', error);
      return errorResponse(
        res,
        'Error al verificar permisos',
        500
      );
    }
  };
};

/**
 * Middleware para verificar que el usuario sea administrador
 * Atajo para checkRole([ROLES.ADMIN])
 */
export const requireAdmin = checkRole([ROLES.ADMIN]);

/**
 * Middleware para verificar que el usuario sea admin o supervisor
 */
export const requireAdminOrSupervisor = checkRole([ROLES.ADMIN, ROLES.SUPERVISOR]);

export default {
  checkRole,
  checkPermission,
  requireAdmin,
  requireAdminOrSupervisor,
};
