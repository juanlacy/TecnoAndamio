import express from 'express';
import authRoutes from './authRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import rolRoutes from './rolRoutes.js';
import usuarioRoutes from './usuarioRoutes.js';
import clienteRoutes from './clienteRoutes.js';
import contactoRoutes from './contactoRoutes.js';
import obraRoutes from './obraRoutes.js';
import categoriaEquipoRoutes from './categoriaEquipoRoutes.js';
import tipoServicioRoutes from './tipoServicioRoutes.js';
import equipoRoutes from './equipoRoutes.js';
import componenteRoutes from './componenteRoutes.js';
import edpRoutes from './edpRoutes.js';

const router = express.Router();

/**
 * Router Principal - API v1
 * Base: /api/v1
 */

/**
 * @route /api/v1/health
 * Health check del API
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TecnoAndamios API v1 funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route /api/v1/auth/*
 * Rutas de autenticación (públicas)
 */
router.use('/auth', authRoutes);

/**
 * @route /api/v1/dashboard/*
 * Rutas de dashboard (estadísticas)
 */
router.use('/dashboard', dashboardRoutes);

/**
 * @route /api/v1/roles/*
 * Rutas de roles (solo lectura)
 */
router.use('/roles', rolRoutes);

/**
 * @route /api/v1/usuarios/*
 * Rutas de usuarios (requiere Admin)
 */
router.use('/usuarios', usuarioRoutes);

/**
 * @route /api/v1/clientes/*
 * Rutas de clientes y contactos anidados
 */
router.use('/clientes', clienteRoutes);

/**
 * @route /api/v1/contactos/*
 * Rutas directas de contactos (PUT, DELETE)
 */
router.use('/contactos', contactoRoutes);

/**
 * @route /api/v1/obras/*
 * Rutas de obras
 */
router.use('/obras', obraRoutes);

/**
 * @route /api/v1/categorias-equipos/*
 * Rutas de categorías de equipos
 */
router.use('/categorias-equipos', categoriaEquipoRoutes);

/**
 * @route /api/v1/tipos-servicio/*
 * Rutas de tipos de servicio (solo lectura)
 */
router.use('/tipos-servicio', tipoServicioRoutes);

/**
 * @route /api/v1/equipos/*
 * Rutas de equipos y componentes anidados
 */
router.use('/equipos', equipoRoutes);

/**
 * @route /api/v1/componentes/*
 * Rutas directas de componentes (PUT, DELETE)
 */
router.use('/componentes', componenteRoutes);

/**
 * @route /api/v1/edp/*
 * Rutas de EDP (Estados de Pago)
 */
router.use('/edp', edpRoutes);

export default router;
