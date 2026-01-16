import { DataTypes } from 'sequelize';

const Rol = (sequelize) => {
  const RolModel = sequelize.define(
    'Rol',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      permisos: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'JSON con permisos específicos del rol',
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'roles',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
    }
  );

  RolModel.associate = (models) => {
    // M:N con Usuario a través de UsuarioRol
    RolModel.belongsToMany(models.Usuario, {
      through: models.UsuarioRol,
      foreignKey: 'rol_id',
      otherKey: 'usuario_id',
      as: 'usuarios',
    });
  };

  return RolModel;
};

export default Rol;
