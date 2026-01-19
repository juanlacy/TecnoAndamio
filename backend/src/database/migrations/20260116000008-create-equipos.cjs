'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('equipos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      categoria_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'categorias_equipos',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      nombre: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      codigo: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Código único del equipo',
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      especificaciones: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'JSON con campos técnicos específicos del equipo',
      },
      disponible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    // Índices
    await queryInterface.addIndex('equipos', ['categoria_id']);
    await queryInterface.addIndex('equipos', ['codigo']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('equipos');
  }
};
