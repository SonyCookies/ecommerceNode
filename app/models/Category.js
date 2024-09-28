module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
