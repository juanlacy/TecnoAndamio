'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('edp_equipos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      edp_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'edp',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      equipo_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'equipos',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      configuracion: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'JSON con componentes específicos y cantidades',
      },
      comentarios: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      subtotal_uf: {
        type: Sequelize.DECIMAL(15, 4),
        allowNull: false,
        defaultValue: 0,
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
    await queryInterface.addIndex('edp_equipos', ['edp_id']);
    await queryInterface.addIndex('edp_equipos', ['equipo_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('edp_equipos');
  }
};
