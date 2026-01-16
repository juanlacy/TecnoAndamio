import { Sequelize } from 'sequelize';
import dbConfig from '../config/database.js';
import { config } from '../config/env.js';

// Importar todos los modelos
import Usuario from './Usuario.js';
import Rol from './Rol.js';
import UsuarioRol from './UsuarioRol.js';
import Cliente from './Cliente.js';
import Contacto from './Contacto.js';
import Obra from './Obra.js';
import CategoriaEquipo from './CategoriaEquipo.js';
import Equipo from './Equipo.js';
import ComponenteEquipo from './ComponenteEquipo.js';
import TipoServicio from './TipoServicio.js';
import Edp from './Edp.js';
import EdpEquipo from './EdpEquipo.js';
import EdpServicio from './EdpServicio.js';
import EdpEstadoHistorico from './EdpEstadoHistorico.js';

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

// Inicializar modelos
db.Usuario = Usuario(sequelize);
db.Rol = Rol(sequelize);
db.UsuarioRol = UsuarioRol(sequelize);
db.Cliente = Cliente(sequelize);
db.Contacto = Contacto(sequelize);
db.Obra = Obra(sequelize);
db.CategoriaEquipo = CategoriaEquipo(sequelize);
db.Equipo = Equipo(sequelize);
db.ComponenteEquipo = ComponenteEquipo(sequelize);
db.TipoServicio = TipoServicio(sequelize);
db.Edp = Edp(sequelize);
db.EdpEquipo = EdpEquipo(sequelize);
db.EdpServicio = EdpServicio(sequelize);
db.EdpEstadoHistorico = EdpEstadoHistorico(sequelize);

// Configurar asociaciones entre modelos
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;
