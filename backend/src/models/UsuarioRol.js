import { DataTypes } from 'sequelize';

const UsuarioRol = (sequelize) => {
  const UsuarioRolModel = sequelize.define(
    'UsuarioRol',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      rol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      asignado_en: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'usuario_roles',
      timestamps: false,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['usuario_id', 'rol_id'],
          name: 'unique_usuario_rol',
        },
      ],
    }
  );

  UsuarioRolModel.associate = (models) => {
    // N:1 con Usuario
    UsuarioRolModel.belongsTo(models.Usuario, {
      foreignKey: 'usuario_id',
      as: 'usuario',
    });

    // N:1 con Rol
    UsuarioRolModel.belongsTo(models.Rol, {
      foreignKey: 'rol_id',
      as: 'rol',
    });
  };

  return UsuarioRolModel;
};

export default UsuarioRol;
