'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('clientes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      empresa: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },
      rut: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      direccion: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      rubro: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Ej: Construcción, Inmobiliario',
      },
      correo_empresa: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      usuario_responsable_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      activo: {
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
    await queryInterface.addIndex('clientes', ['rut']);
    await queryInterface.addIndex('clientes', ['usuario_responsable_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('clientes');
  }
};
