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
      direccion: {
        type: DataTypes.STRING(200),
        allowNull: true,
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
