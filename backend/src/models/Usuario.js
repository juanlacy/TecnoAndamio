import { DataTypes } from 'sequelize';

const Usuario = (sequelize) => {
  const UsuarioModel = sequelize.define(
    'Usuario',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Null si el usuario usa solo Google OAuth',
      },
      google_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
        comment: 'ID de Google para OAuth',
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
      tableName: 'usuarios',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
    }
  );

  UsuarioModel.associate = (models) => {
    // M:N con Rol a través de UsuarioRol
    UsuarioModel.belongsToMany(models.Rol, {
      through: models.UsuarioRol,
      foreignKey: 'usuario_id',
      otherKey: 'rol_id',
      as: 'roles',
    });

    // 1:N - Usuario puede ser responsable de muchos clientes
    UsuarioModel.hasMany(models.Cliente, {
      foreignKey: 'usuario_responsable_id',
      as: 'clientes_responsable',
    });

    // 1:N - Usuario puede ser responsable de muchas obras
    UsuarioModel.hasMany(models.Obra, {
      foreignKey: 'responsable_id',
      as: 'obras_responsable',
    });

    // 1:N - Usuario crea muchos EDPs
    UsuarioModel.hasMany(models.Edp, {
      foreignKey: 'usuario_id',
      as: 'edps',
    });

    // 1:N - Usuario registra cambios de estado en EDPs
    UsuarioModel.hasMany(models.EdpEstadoHistorico, {
      foreignKey: 'usuario_id',
      as: 'cambios_estado',
    });
  };

  return UsuarioModel;
};

export default Usuario;
