'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('obras', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      cliente_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'clientes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      nombre: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      direccion: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      region: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      responsable_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      activa: {
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
    await queryInterface.addIndex('obras', ['cliente_id']);
    await queryInterface.addIndex('obras', ['responsable_id']);
    // Índice único para nombre de obra por cliente
    await queryInterface.addIndex('obras', ['cliente_id', 'nombre'], {
      unique: true,
      name: 'unique_cliente_obra',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('obras');
  }
};
