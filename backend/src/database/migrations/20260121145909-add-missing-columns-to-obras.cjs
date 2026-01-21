'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Verificar y agregar solo las columnas que no existen

    const tableInfo = await queryInterface.describeTable('obras');

    // 1. Codigo - verificar si existe
    if (!tableInfo.codigo) {
      await queryInterface.addColumn('obras', 'codigo', {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Código único de la obra',
        after: 'id'
      });

      // Generar códigos únicos para obras existentes
      await queryInterface.sequelize.query(`
        UPDATE obras
        SET codigo = CONCAT('OBR-', LPAD(id, 5, '0'))
        WHERE codigo IS NULL
      `);

      // Hacer codigo NOT NULL y unique
      await queryInterface.changeColumn('obras', 'codigo', {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Código único de la obra'
      });
    }

    // 2. Descripcion
    if (!tableInfo.descripcion) {
      await queryInterface.addColumn('obras', 'descripcion', {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Descripción detallada de la obra',
        after: 'nombre'
      });
    }

    // 3. Ciudad
    if (!tableInfo.ciudad) {
      await queryInterface.addColumn('obras', 'ciudad', {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Ciudad donde se ubica la obra',
        after: 'direccion'
      });
    }

    // 4. Fecha inicio - primero como nullable
    if (!tableInfo.fecha_inicio) {
      await queryInterface.addColumn('obras', 'fecha_inicio', {
        type: Sequelize.DATEONLY,
        allowNull: true,
        comment: 'Fecha de inicio de la obra',
        after: 'responsable_id'
      });

      // Asignar fecha actual a obras existentes
      await queryInterface.sequelize.query(`
        UPDATE obras
        SET fecha_inicio = CURDATE()
        WHERE fecha_inicio IS NULL
      `);

      // Hacer fecha_inicio NOT NULL
      await queryInterface.changeColumn('obras', 'fecha_inicio', {
        type: Sequelize.DATEONLY,
        allowNull: false,
        comment: 'Fecha de inicio de la obra'
      });
    }

    // 5. Fecha termino estimada
    if (!tableInfo.fecha_termino_estimada) {
      await queryInterface.addColumn('obras', 'fecha_termino_estimada', {
        type: Sequelize.DATEONLY,
        allowNull: true,
        comment: 'Fecha estimada de término de la obra',
        after: 'fecha_inicio'
      });
    }

    // 6. Estado
    if (!tableInfo.estado) {
      await queryInterface.addColumn('obras', 'estado', {
        type: Sequelize.ENUM('planificacion', 'en_curso', 'suspendida', 'finalizada'),
        allowNull: false,
        defaultValue: 'planificacion',
        comment: 'Estado actual de la obra',
        after: 'fecha_termino_estimada'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Eliminar columnas en orden inverso
    await queryInterface.removeColumn('obras', 'estado');
    await queryInterface.removeColumn('obras', 'fecha_termino_estimada');
    await queryInterface.removeColumn('obras', 'fecha_inicio');
    await queryInterface.removeColumn('obras', 'ciudad');
    await queryInterface.removeColumn('obras', 'descripcion');
    await queryInterface.removeColumn('obras', 'codigo');
  }
};
