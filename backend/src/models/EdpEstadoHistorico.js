import { DataTypes } from 'sequelize';

const EdpEstadoHistorico = (sequelize) => {
  const EdpEstadoHistoricoModel = sequelize.define(
    'EdpEstadoHistorico',
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
      estado_anterior: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Null si es el primer estado',
      },
      estado_nuevo: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      fecha: {
        type: DataTypes.DATEONLY,
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
        onDelete: 'RESTRICT',
        comment: 'Usuario que realizó el cambio de estado',
      },
      comentario: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'edp_estados_historico',
      timestamps: false,
      underscored: true,
    }
  );

  EdpEstadoHistoricoModel.associate = (models) => {
    // N:1 - Cambio de estado pertenece a un EDP
    EdpEstadoHistoricoModel.belongsTo(models.Edp, {
      foreignKey: 'edp_id',
      as: 'edp',
    });

    // N:1 - Cambio de estado fue realizado por un usuario
    EdpEstadoHistoricoModel.belongsTo(models.Usuario, {
      foreignKey: 'usuario_id',
      as: 'usuario',
    });
  };

  return EdpEstadoHistoricoModel;
};

export default EdpEstadoHistorico;
