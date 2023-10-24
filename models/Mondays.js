module.exports = (sequelize, DataTypes) => {
  const Mondays = sequelize.define(
    "Mondays",
    {
      monday_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      monday_proname: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      monday_subname: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      owner: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      monday_status: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      point_dev: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      point_qa: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      in_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      // options
      tableName: "Mondays",
      timestamps: true,
      charset: "utf8",
      createdAt: "created_date", // Specify the custom column name for createdAt
      updatedAt: "updated_date",
      collate: "utf8_general_ci",
    }
  );

  Mondays.associate = (models) => {
    Mondays.belongsTo(models.Users, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return Mondays;
};
