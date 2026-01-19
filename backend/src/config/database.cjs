// Configuración de base de datos para Sequelize CLI (CommonJS)
// Este archivo es necesario porque Sequelize CLI no soporta ES Modules completamente

require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'tecnoandamios_user',
    password: process.env.DB_PASSWORD || 'tecnoandamios_pass',
    database: process.env.DB_NAME || 'tecnoandamios_db',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    timezone: '-03:00', // Chile timezone
    define: {
      timestamps: true,
      underscored: true, // snake_case para las columnas
      underscoredAll: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    username: process.env.DB_USER || 'tecnoandamios_user',
    password: process.env.DB_PASSWORD || 'tecnoandamios_pass',
    database: process.env.DB_NAME_TEST || 'tecnoandamios_test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    timezone: '-03:00'
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    timezone: '-03:00',
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    },
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000
    }
  }
};
