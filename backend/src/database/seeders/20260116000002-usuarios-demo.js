'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash de la contraseña 'admin123'
    const passwordHash = await bcrypt.hash('admin123', 10);

    // Crear usuario admin
    await queryInterface.bulkInsert('usuarios', [{
      email: 'admin@tecnoandamios.com',
      nombre: 'Administrador',
      password_hash: passwordHash,
      google_id: null,
      activo: true,
      created_at: new Date(),
      updated_at: new Date(),
    }], {});

    // Obtener el ID del usuario creado y del rol Admin
    const [usuarios] = await queryInterface.sequelize.query(
      "SELECT id FROM usuarios WHERE email = 'admin@tecnoandamios.com'"
    );
    const [roles] = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE nombre = 'Admin'"
    );

    if (usuarios.length > 0 && roles.length > 0) {
      // Asignar rol Admin al usuario
      await queryInterface.bulkInsert('usuario_roles', [{
        usuario_id: usuarios[0].id,
        rol_id: roles[0].id,
        asignado_en: new Date(),
      }], {});
    }
  },

  async down(queryInterface, Sequelize) {
    // Eliminar rol del usuario
    await queryInterface.bulkDelete('usuario_roles', {
      usuario_id: queryInterface.sequelize.literal(
        "(SELECT id FROM usuarios WHERE email = 'admin@tecnoandamios.com')"
      )
    }, {});

    // Eliminar usuario
    await queryInterface.bulkDelete('usuarios', {
      email: 'admin@tecnoandamios.com'
    }, {});
  }
};
