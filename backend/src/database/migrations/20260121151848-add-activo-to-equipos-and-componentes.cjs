'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Agregar columna activo a equipos
    await queryInterface.addColumn('equipos', 'activo', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Indica si el equipo está activo',
      after: 'disponible'
    });

    // Agregar columna activo a componentes_equipo
    await queryInterface.addColumn('componentes_equipo', 'activo', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Indica si el componente está activo',
      after: 'precio_unitario_uf'
    });
  },

  async down(queryInterface, Sequelize) {
    // Eliminar columnas en orden inverso
    await queryInterface.removeColumn('componentes_equipo', 'activo');
    await queryInterface.removeColumn('equipos', 'activo');
  }
};
