module.exports = (sequelize, DataTypes) => {
  const Timers = sequelize.define(
    "Timers",
    {
      timer_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      work_id: {
        type: DataTypes.UUID, // Use FLOAT data type for float values
        allowNull: true,
      },
      timer: {
        type: DataTypes.INTEGER, // Use FLOAT data type for float values
        allowNull: true,
        defaultValue: 0,
      },
      monday_id:{
        type: DataTypes.UUID, // Use FLOAT data type for float values
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
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
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      // options
      tableName: "Timers",
      timestamps: true,
      charset: "utf8",
      createdAt: "created_date", // Specify the custom column name for createdAt
      updatedAt: "updated_date",
      collate: "utf8_general_ci",
    }
  );
  Timers.associate = (models) => {
    Timers.belongsTo(models.Works, {
      foreignKey: "work_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };
  return Timers;
};
