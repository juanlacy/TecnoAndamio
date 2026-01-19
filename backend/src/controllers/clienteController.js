import * as clienteService from '../services/clienteService.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import logger from '../utils/logger.js';

/**
 * Controlador de Clientes
 * Maneja las peticiones HTTP para el CRUD de clientes
 */

/**
 * GET /api/v1/clientes
 * Listar clientes con paginación y filtros
 */
export const getClientes = async (req, res, next) => {
  try {
    const { search, rut, activo, page = 1, limit = 10 } = req.query;

    const result = await clienteService.listClientes({
      search,
      rut,
      activo: activo === 'true' ? true : activo === 'false' ? false : null,
      page: parseInt(page),
      limit: parseInt(limit),
    });

    const { clientes, total } = result;

    return paginatedResponse(
      res,
      clientes,
      parseInt(page),
      parseInt(limit),
      total,
      'Clientes obtenidos exitosamente'
    );
  } catch (error) {
    logger.error('Error en getClientes controller:', error);
    next(error);
  }
};

/**
 * GET /api/v1/clientes/:id
 * Obtener cliente por ID con contactos y obras
 */
export const getClienteById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const cliente = await clienteService.getClienteById(id);

    return successResponse(
      res,
      { cliente },
      'Cliente obtenido exitosamente'
    );
  } catch (error) {
    logger.error('Error en getClienteById controller:', error);
    next(error);
  }
};

/**
 * POST /api/v1/clientes
 * Crear nuevo cliente
 */
export const createCliente = async (req, res, next) => {
  try {
    const clienteData = req.body;

    const cliente = await clienteService.createCliente(clienteData);

    return successResponse(
      res,
      { cliente },
      'Cliente creado exitosamente',
      201
    );
  } catch (error) {
    logger.error('Error en createCliente controller:', error);

    // Error de RUT duplicado
    if (error.statusCode === 409) {
      return errorResponse(res, error.message, 409);
    }

    next(error);
  }
};

/**
 * PUT /api/v1/clientes/:id
 * Actualizar cliente
 */
export const updateCliente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const clienteData = req.body;

    const cliente = await clienteService.updateCliente(id, clienteData);

    return successResponse(
      res,
      { cliente },
      'Cliente actualizado exitosamente'
    );
  } catch (error) {
    logger.error('Error en updateCliente controller:', error);

    // Error de RUT duplicado
    if (error.statusCode === 409) {
      return errorResponse(res, error.message, 409);
    }

    next(error);
  }
};

/**
 * DELETE /api/v1/clientes/:id
 * Eliminar cliente (soft delete)
 */
export const deleteCliente = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await clienteService.deleteCliente(id);

    return successResponse(
      res,
      result,
      'Cliente eliminado exitosamente'
    );
  } catch (error) {
    logger.error('Error en deleteCliente controller:', error);
    next(error);
  }
};

/**
 * GET /api/v1/clientes/:id/contactos
 * Obtener contactos de un cliente
 */
export const getContactosByCliente = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contactos = await clienteService.getContactosByCliente(id);

    return successResponse(
      res,
      { contactos },
      'Contactos obtenidos exitosamente'
    );
  } catch (error) {
    logger.error('Error en getContactosByCliente controller:', error);
    next(error);
  }
};

/**
 * GET /api/v1/clientes/:id/obras
 * Obtener obras de un cliente
 */
export const getObrasByCliente = async (req, res, next) => {
  try {
    const { id } = req.params;

    const obras = await clienteService.getObrasByCliente(id);

    return successResponse(
      res,
      { obras },
      'Obras obtenidas exitosamente'
    );
  } catch (error) {
    logger.error('Error en getObrasByCliente controller:', error);
    next(error);
  }
};

export default {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
  getContactosByCliente,
  getObrasByCliente,
};
