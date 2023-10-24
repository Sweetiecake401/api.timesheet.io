module.exports = (sequelize, DataTypes) => {
    const Project_sub = sequelize.define(
      "Project_sub",
      {
        project_subid: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        project_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        monday_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        created_by: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        updated_by: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        is_active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          default: true,
        },
        is_deleted: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          default: true,
        },
      },
      {
        // options
        tableName: "Project_sub",
        timestamps: true,
      charset: "utf8",
      createdAt: "created_date", // Specify the custom column name for createdAt
      updatedAt: "updated_date",
        collate: "utf8_general_ci",
      }
    );
    
  
    Project_sub.associate = (models) => {
        Project_sub.belongsTo(models.Users, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Project_sub.belongsTo(models.Projects, {
        foreignKey: "project_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    };
    return Project_sub;
  };
  