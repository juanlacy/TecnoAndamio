import { DataTypes } from 'sequelize';

const Equipo = (sequelize) => {
  const EquipoModel = sequelize.define(
    'Equipo',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      categoria_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'categorias_equipos',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      nombre: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      codigo: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
        comment: 'Código interno del equipo',
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      especificaciones: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'JSON con especificaciones técnicas',
      },
      disponible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        comment: 'Indica si el equipo está activo',
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
      tableName: 'equipos',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
    }
  );

  EquipoModel.associate = (models) => {
    // N:1 - Equipo pertenece a una categoría
    EquipoModel.belongsTo(models.CategoriaEquipo, {
      foreignKey: 'categoria_id',
      as: 'categoria',
    });

    // 1:N - Equipo tiene muchos componentes
    EquipoModel.hasMany(models.ComponenteEquipo, {
      foreignKey: 'equipo_id',
      as: 'componentes',
    });

    // 1:N - Equipo aparece en muchos EDPs
    EquipoModel.hasMany(models.EdpEquipo, {
      foreignKey: 'equipo_id',
      as: 'edp_equipos',
    });
  };

  return EquipoModel;
};

export default Equipo;
