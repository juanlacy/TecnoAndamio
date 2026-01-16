'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('edp_servicios', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      edp_equipo_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'edp_equipos',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      tipo_servicio_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tipos_servicio',
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
      precio_unitario_uf: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: false,
        defaultValue: 0,
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
    await queryInterface.addIndex('edp_servicios', ['edp_equipo_id']);
    await queryInterface.addIndex('edp_servicios', ['tipo_servicio_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('edp_servicios');
  }
};
