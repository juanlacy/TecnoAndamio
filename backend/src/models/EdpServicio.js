import { DataTypes } from 'sequelize';

const EdpServicio = (sequelize) => {
  const EdpServicioModel = sequelize.define(
    'EdpServicio',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      edp_equipo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'edp_equipos',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      tipo_servicio_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'tipos_servicio',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      cantidad: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 1.0,
        allowNull: false,
        comment: 'Cantidad de veces que se aplica el servicio',
      },
      precio_unitario: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0.0,
        allowNull: false,
        comment: 'Precio por unidad en pesos chilenos',
      },
      subtotal: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0.0,
        allowNull: false,
        comment: 'Subtotal en pesos chilenos',
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
      tableName: 'edp_servicios',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
    }
  );

  EdpServicioModel.associate = (models) => {
    // N:1 - EdpServicio pertenece a un EdpEquipo
    EdpServicioModel.belongsTo(models.EdpEquipo, {
      foreignKey: 'edp_equipo_id',
      as: 'edp_equipo',
    });

    // N:1 - EdpServicio referencia a un tipo de servicio
    EdpServicioModel.belongsTo(models.TipoServicio, {
      foreignKey: 'tipo_servicio_id',
      as: 'tipo_servicio',
    });
  };

  return EdpServicioModel;
};

export default EdpServicio;
