import { DataTypes } from 'sequelize';

const Edp = (sequelize) => {
  const EdpModel = sequelize.define(
    'Edp',
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
        comment: 'Código único del EDP (auto-generado)',
      },
      cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'clientes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      obra_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'obras',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      orden_compra: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      fecha_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      fecha_corte: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      fecha_termino: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      unidad_alquiler: {
        type: DataTypes.ENUM('Valor UF', 'Pesos'),
        defaultValue: 'Valor UF',
        allowNull: false,
      },
      estado: {
        type: DataTypes.ENUM('Borrador', 'Abierto', 'Cerrado', 'Validado', 'Facturado', 'Cobrado'),
        defaultValue: 'Borrador',
        allowNull: false,
      },
      importe_total: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0.0,
        allowNull: false,
        comment: 'Importe total en pesos chilenos',
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
        comment: 'Usuario que creó el EDP',
      },
      comentarios: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      url_orden_compra: {
        type: DataTypes.STRING(255),
        allowNull: true,
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
      tableName: 'edp',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
    }
  );

  EdpModel.associate = (models) => {
    // N:1 - EDP pertenece a un cliente
    EdpModel.belongsTo(models.Cliente, {
      foreignKey: 'cliente_id',
      as: 'cliente',
    });

    // N:1 - EDP pertenece a una obra
    EdpModel.belongsTo(models.Obra, {
      foreignKey: 'obra_id',
      as: 'obra',
    });

    // N:1 - EDP fue creado por un usuario
    EdpModel.belongsTo(models.Usuario, {
      foreignKey: 'usuario_id',
      as: 'usuario',
    });

    // 1:N - EDP tiene muchos equipos
    EdpModel.hasMany(models.EdpEquipo, {
      foreignKey: 'edp_id',
      as: 'equipos',
    });

    // 1:N - EDP tiene historial de cambios de estado
    EdpModel.hasMany(models.EdpEstadoHistorico, {
      foreignKey: 'edp_id',
      as: 'historial_estados',
    });
  };

  return EdpModel;
};

export default Edp;
