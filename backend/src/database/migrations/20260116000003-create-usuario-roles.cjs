'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuario_roles', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
        onDelete: 'CASCADE',
      },
      rol_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      asignado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Índices
    await queryInterface.addIndex('usuario_roles', ['usuario_id']);
    await queryInterface.addIndex('usuario_roles', ['rol_id']);
    // Índice único para evitar roles duplicados por usuario
    await queryInterface.addIndex('usuario_roles', ['usuario_id', 'rol_id'], {
      unique: true,
      name: 'unique_usuario_rol',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('usuario_roles');
  }
};
