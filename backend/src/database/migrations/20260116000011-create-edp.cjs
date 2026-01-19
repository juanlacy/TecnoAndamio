'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('edp', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      codigo: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Código único del EDP, ej: EDP_1, EDP_2',
      },
      cliente_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'clientes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      obra_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'obras',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      orden_compra: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      fecha_inicio: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      fecha_corte: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      fecha_termino: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      unidad_alquiler: {
        type: Sequelize.ENUM('Valor UF', 'Pesos'),
        allowNull: false,
        defaultValue: 'Valor UF',
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
        comment: 'Usuario responsable del EDP',
      },
      importe_total: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },
      estado: {
        type: Sequelize.ENUM('Borrador', 'Abierto', 'Cerrado', 'Validado', 'Facturado', 'Cobrado'),
        allowNull: false,
        defaultValue: 'Borrador',
      },
      url_orden_compra: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'URL del archivo en Drive/Storage',
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
    await queryInterface.addIndex('edp', ['codigo']);
    await queryInterface.addIndex('edp', ['cliente_id']);
    await queryInterface.addIndex('edp', ['obra_id']);
    await queryInterface.addIndex('edp', ['estado']);
    await queryInterface.addIndex('edp', ['fecha_inicio']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('edp');
  }
};
