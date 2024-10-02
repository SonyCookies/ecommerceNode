const { INTEGER } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Admin",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdById: {
        // New field to store the creator's admin ID
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'admins', // Self-reference the 'admins' table
          key: 'id',
        }
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
      },
    },
    {
      tableName: "admins", // Use a specific table name
      timestamps: false, // Disable automatic timestamps as we define our own
    }
  );
};
