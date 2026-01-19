'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tiposServicio = [
      {
        nombre: 'Armado',
        descripcion: 'Servicio de armado e instalación de equipos',
        activo: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: 'Desarmado',
        descripcion: 'Servicio de desarmado y retiro de equipos',
        activo: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: 'Flete',
        descripcion: 'Servicio de transporte de equipos',
        activo: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: 'Mantención',
        descripcion: 'Servicio de mantención y revisión de equipos',
        activo: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: 'Visita Técnica',
        descripcion: 'Servicio de visita técnica y evaluación',
        activo: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: 'Capacitación',
        descripcion: 'Servicio de capacitación en uso seguro de equipos',
        activo: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('tipos_servicio', tiposServicio, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tipos_servicio', null, {});
  }
};
