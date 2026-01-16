import { DataTypes } from 'sequelize';

const Contacto = (sequelize) => {
  const ContactoModel = sequelize.define(
    'Contacto',
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
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      correo: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      tipo: {
        type: DataTypes.ENUM('Gerente', 'Supervisor', 'Administrativo', 'Técnico', 'Otro'),
        defaultValue: 'Otro',
        allowNull: false,
      },
      principal: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'Indica si es el contacto principal del cliente',
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
      tableName: 'contactos',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
    }
  );

  ContactoModel.associate = (models) => {
    // N:1 - Contacto pertenece a un cliente
    ContactoModel.belongsTo(models.Cliente, {
      foreignKey: 'cliente_id',
      as: 'cliente',
    });
  };

  return ContactoModel;
};

export default Contacto;
