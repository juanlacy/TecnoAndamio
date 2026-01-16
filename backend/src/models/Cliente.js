import { DataTypes } from 'sequelize';

const Cliente = (sequelize) => {
  const ClienteModel = sequelize.define(
    'Cliente',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      empresa: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
      },
      rut: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      direccion: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      rubro: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Ej: Construcción, Inmobiliario',
      },
      correo_empresa: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      usuario_responsable_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
      tableName: 'clientes',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
    }
  );

  ClienteModel.associate = (models) => {
    // N:1 - Cliente tiene un usuario responsable
    ClienteModel.belongsTo(models.Usuario, {
      foreignKey: 'usuario_responsable_id',
      as: 'responsable',
    });

    // 1:N - Cliente tiene muchos contactos
    ClienteModel.hasMany(models.Contacto, {
      foreignKey: 'cliente_id',
      as: 'contactos',
    });

    // 1:N - Cliente tiene muchas obras
    ClienteModel.hasMany(models.Obra, {
      foreignKey: 'cliente_id',
      as: 'obras',
    });

    // 1:N - Cliente tiene muchos EDPs
    ClienteModel.hasMany(models.Edp, {
      foreignKey: 'cliente_id',
      as: 'edps',
    });
  };

  return ClienteModel;
};

export default Cliente;
