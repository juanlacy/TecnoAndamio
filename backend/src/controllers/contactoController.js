import db from '../models/index.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { AppError } from '../utils/errors.js';
import logger from '../utils/logger.js';

const { Contacto, Cliente } = db;

/**
 * Controlador de Contactos
 * Maneja operaciones de contactos asociados a clientes
 */

/**
 * POST /api/v1/clientes/:clienteId/contactos
 * Crear contacto para un cliente
 */
export const createContacto = async (req, res, next) => {
  try {
    const { clienteId } = req.params;
    const contactoData = req.body;

    // Verificar que el cliente existe
    const cliente = await Cliente.findByPk(clienteId);
    if (!cliente) {
      throw new AppError('Cliente no encontrado', 404);
    }

    // Si se marca como principal, desmarcar otros contactos principales del cliente
    if (contactoData.principal) {
      await Contacto.update(
        { principal: false },
        { where: { cliente_id: clienteId } }
      );
    }

    // Crear contacto
    const contacto = await Contacto.create({
      ...contactoData,
      cliente_id: clienteId,
      activo: true,
    });

    return successResponse(
      res,
      { contacto },
      'Contacto creado exitosamente',
      201
    );
  } catch (error) {
    logger.error('Error en createContacto controller:', error);
    next(error);
  }
};

/**
 * PUT /api/v1/contactos/:id
 * Actualizar contacto
 */
export const updateContacto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contactoData = req.body;

    const contacto = await Contacto.findByPk(id);

    if (!contacto) {
      throw new AppError('Contacto no encontrado', 404);
    }

    // Si se marca como principal, desmarcar otros contactos principales del mismo cliente
    if (contactoData.principal && !contacto.principal) {
      await Contacto.update(
        { principal: false },
        { where: { cliente_id: contacto.cliente_id } }
      );
    }

    // Actualizar campos
    const { nombre, telefono, correo, tipo, principal } = contactoData;

    if (nombre !== undefined) contacto.nombre = nombre;
    if (telefono !== undefined) contacto.telefono = telefono;
    if (correo !== undefined) contacto.correo = correo;
    if (tipo !== undefined) contacto.tipo = tipo;
    if (principal !== undefined) contacto.principal = principal;

    await contacto.save();

    return successResponse(
      res,
      { contacto },
      'Contacto actualizado exitosamente'
    );
  } catch (error) {
    logger.error('Error en updateContacto controller:', error);
    next(error);
  }
};

/**
 * DELETE /api/v1/contactos/:id
 * Eliminar contacto (soft delete)
 */
export const deleteContacto = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contacto = await Contacto.findByPk(id);

    if (!contacto) {
      throw new AppError('Contacto no encontrado', 404);
    }

    // Soft delete
    contacto.activo = false;
    await contacto.save();

    return successResponse(
      res,
      { message: 'Contacto eliminado exitosamente' },
      'Contacto eliminado exitosamente'
    );
  } catch (error) {
    logger.error('Error en deleteContacto controller:', error);
    next(error);
  }
};

export default {
  createContacto,
  updateContacto,
  deleteContacto,
};
