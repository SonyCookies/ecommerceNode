module.exports = (sequelize, DataTypes) => {
  return sequelize.define('CartItem', {
      quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1
      },
      // If you have specific constraints on ProductId and CartId, define them here
      ProductId: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      CartId: {
          type: DataTypes.INTEGER,
          allowNull: false
      }
  });
};
