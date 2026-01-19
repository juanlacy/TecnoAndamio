import express from 'express';
import authRoutes from './authRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import rolRoutes from './rolRoutes.js';

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
 * TODO: Agregar más rutas en Fase 3
 * router.use('/usuarios', usuarioRoutes);
 * router.use('/clientes', clienteRoutes);
 * router.use('/obras', obraRoutes);
 * router.use('/categorias-equipos', categoriaEquipoRoutes);
 * router.use('/equipos', equipoRoutes);
 * router.use('/tipos-servicio', tipoServicioRoutes);
 * router.use('/edp', edpRoutes);
 */

export default router;
