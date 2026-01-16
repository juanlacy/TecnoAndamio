import { DataTypes } from 'sequelize';

const CategoriaEquipo = (sequelize) => {
  const CategoriaEquipoModel = sequelize.define(
    'CategoriaEquipo',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      tableName: 'categorias_equipos',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
    }
  );

  CategoriaEquipoModel.associate = (models) => {
    // 1:N - CategoriaEquipo tiene muchos equipos
    CategoriaEquipoModel.hasMany(models.Equipo, {
      foreignKey: 'categoria_id',
      as: 'equipos',
    });
  };

  return CategoriaEquipoModel;
};

export default CategoriaEquipo;
