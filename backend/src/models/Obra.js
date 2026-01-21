import { DataTypes } from 'sequelize';

const Obra = (sequelize) => {
  const ObraModel = sequelize.define(
    'Obra',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      codigo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Código único de la obra',
      },
      cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'clientes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      nombre: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Descripción detallada de la obra',
      },
      direccion: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      ciudad: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Ciudad donde se ubica la obra',
      },
      region: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Ej: Metropolitana, Valparaíso',
      },
      responsable_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'Usuario responsable de la obra',
      },
      fecha_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Fecha de inicio de la obra',
      },
      fecha_termino_estimada: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Fecha estimada de término de la obra',
      },
      estado: {
        type: DataTypes.ENUM('planificacion', 'en_curso', 'suspendida', 'finalizada'),
        allowNull: false,
        defaultValue: 'planificacion',
        comment: 'Estado actual de la obra',
      },
      activa: {
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
      tableName: 'obras',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
    }
  );

  ObraModel.associate = (models) => {
    // N:1 - Obra pertenece a un cliente
    ObraModel.belongsTo(models.Cliente, {
      foreignKey: 'cliente_id',
      as: 'cliente',
    });

    // N:1 - Obra tiene un usuario responsable
    ObraModel.belongsTo(models.Usuario, {
      foreignKey: 'responsable_id',
      as: 'responsable',
    });

    // 1:N - Obra tiene muchos EDPs
    ObraModel.hasMany(models.Edp, {
      foreignKey: 'obra_id',
      as: 'edps',
    });
  };

  return ObraModel;
};

export default Obra;
