'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('edp_estados_historico', {
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
      estado_anterior: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Null si es el primer estado',
      },
      estado_nuevo: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      fecha: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Usuario que realizó el cambio de estado',
      },
      comentario: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Índices
    await queryInterface.addIndex('edp_estados_historico', ['edp_id']);
    await queryInterface.addIndex('edp_estados_historico', ['fecha']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('edp_estados_historico');
  }
};
