import { DataTypes } from 'sequelize';

const ComponenteEquipo = (sequelize) => {
  const ComponenteEquipoModel = sequelize.define(
    'ComponenteEquipo',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      equipo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'equipos',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      unidad: {
        type: DataTypes.STRING(50),
        defaultValue: 'Unidad',
        allowNull: false,
        comment: 'Ej: Metros, Unidades, Toneladas',
      },
      precio_unitario_uf: {
        type: DataTypes.DECIMAL(10, 4),
        defaultValue: 0.0,
        allowNull: false,
        comment: 'Precio por unidad en UF',
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        comment: 'Indica si el componente está activo',
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
      tableName: 'componentes_equipo',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
    }
  );

  ComponenteEquipoModel.associate = (models) => {
    // N:1 - Componente pertenece a un equipo
    ComponenteEquipoModel.belongsTo(models.Equipo, {
      foreignKey: 'equipo_id',
      as: 'equipo',
    });
  };

  return ComponenteEquipoModel;
};

export default ComponenteEquipo;
