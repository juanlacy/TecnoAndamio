'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('roles', 'activo', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      after: 'permisos'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('roles', 'activo');
  }
};
