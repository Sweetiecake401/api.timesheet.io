module.exports = (sequelize, DataTypes) => {
  const TeamProjects = sequelize.define(
    "TeamProjects",
    {
      teamproject_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      project_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      created_by:{
        type: DataTypes.UUID,
        allowNull: true,
      },
      updated_by:{
        type: DataTypes.UUID,
        allowNull: true,
      },
      is_deleted:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      is_active:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      // option
      tableName: "tbTeamProjects",
      timestamps: {
        createdAt: "create_date", // Change createdAt field name to create_date
        updatedAt: "updated_date", // Change updatedAt field name to updated_date
      },
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );

  TeamProjects.associate = (models) => {
    TeamProjects.belongsTo(models.Projects, {
      foreignKey: "project_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    TeamProjects.belongsTo(models.Users, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
  };
  return TeamProjects;
};
