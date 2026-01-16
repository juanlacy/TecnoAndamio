'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const categorias = [
      {
        nombre: 'Andamio Colgante',
        descripcion: 'Andamios colgantes para trabajos en altura',
        activo: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: 'Cremallera',
        descripcion: 'Montacargas de cremallera para transporte vertical',
        activo: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: 'Montacarga',
        descripcion: 'Montacargas para elevación de materiales',
        activo: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: 'Andamio Tubular',
        descripcion: 'Andamios tubulares modulares',
        activo: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: 'Plataforma de Trabajo',
        descripcion: 'Plataformas elevadoras de trabajo',
        activo: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('categorias_equipos', categorias, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categorias_equipos', null, {});
  }
};
