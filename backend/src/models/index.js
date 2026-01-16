import { Sequelize } from 'sequelize';
import dbConfig from '../config/database.js';
import { config } from '../config/env.js';

// Obtener configuración según el ambiente
const env = config.nodeEnv || 'development';
const currentConfig = dbConfig[env];

// Inicializar Sequelize
const sequelize = new Sequelize(
  currentConfig.database,
  currentConfig.username,
  currentConfig.password,
  {
    host: currentConfig.host,
    port: currentConfig.port,
    dialect: currentConfig.dialect,
    logging: currentConfig.logging,
    timezone: currentConfig.timezone,
    define: currentConfig.define,
    pool: currentConfig.pool,
  }
);

// Objeto db que contendrá todos los modelos
const db = {
  sequelize,
  Sequelize,
};

// TODO: Importar modelos aquí en Fase 2
// import Usuario from './Usuario.js';
// import Rol from './Rol.js';
// ... etc

// TODO: Agregar modelos al objeto db
// db.Usuario = Usuario;
// db.Rol = Rol;
// ... etc

// TODO: Configurar asociaciones entre modelos
// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

export default db;
