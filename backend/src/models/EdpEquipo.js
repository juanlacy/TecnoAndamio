import { DataTypes } from 'sequelize';

const EdpEquipo = (sequelize) => {
  const EdpEquipoModel = sequelize.define(
    'EdpEquipo',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      edp_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'edp',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      equipo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'equipos',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      cantidad: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      configuracion: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Configuración específica del equipo para este EDP',
      },
      subtotal_uf: {
        type: DataTypes.DECIMAL(15, 4),
        defaultValue: 0.0,
        allowNull: false,
        comment: 'Subtotal en UF para este equipo',
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
      tableName: 'edp_equipos',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
    }
  );

  EdpEquipoModel.associate = (models) => {
    // N:1 - EdpEquipo pertenece a un EDP
    EdpEquipoModel.belongsTo(models.Edp, {
      foreignKey: 'edp_id',
      as: 'edp',
    });

    // N:1 - EdpEquipo referencia a un equipo
    EdpEquipoModel.belongsTo(models.Equipo, {
      foreignKey: 'equipo_id',
      as: 'equipo',
    });

    // 1:N - EdpEquipo tiene muchos servicios asociados
    EdpEquipoModel.hasMany(models.EdpServicio, {
      foreignKey: 'edp_equipo_id',
      as: 'servicios',
    });
  };

  return EdpEquipoModel;
};

export default EdpEquipo;
