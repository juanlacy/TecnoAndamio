import { DataTypes } from 'sequelize';

const TipoServicio = (sequelize) => {
  const TipoServicioModel = sequelize.define(
    'TipoServicio',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nombre: {
        type: DataTypes.STRING(50),
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
      tableName: 'tipos_servicio',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
    }
  );

  TipoServicioModel.associate = (models) => {
    // 1:N - TipoServicio aparece en muchos servicios de EDP
    TipoServicioModel.hasMany(models.EdpServicio, {
      foreignKey: 'tipo_servicio_id',
      as: 'edp_servicios',
    });
  };

  return TipoServicioModel;
};

export default TipoServicio;
