'use strict';

const { ROLES, PERMISOS_POR_ROL } = require('../../utils/constants.js');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const roles = [
      {
        nombre: ROLES.ADMIN,
        descripcion: 'Administrador del sistema con acceso total',
        permisos: JSON.stringify(PERMISOS_POR_ROL[ROLES.ADMIN]),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: ROLES.SUPERVISOR,
        descripcion: 'Supervisor con permisos de gestión y cambio de estados de EDP',
        permisos: JSON.stringify(PERMISOS_POR_ROL[ROLES.SUPERVISOR]),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: ROLES.OPERADOR,
        descripcion: 'Operador con permisos de lectura y creación básica',
        permisos: JSON.stringify(PERMISOS_POR_ROL[ROLES.OPERADOR]),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('roles', roles, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
