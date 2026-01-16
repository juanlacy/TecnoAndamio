'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contactos', {
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
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      telefono: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      correo: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      tipo: {
        type: Sequelize.ENUM('Obra', 'Empresa', 'Facturación'),
        allowNull: false,
        defaultValue: 'Obra',
      },
      principal: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Indica si es el contacto principal del cliente',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Índices
    await queryInterface.addIndex('contactos', ['cliente_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('contactos');
  }
};
