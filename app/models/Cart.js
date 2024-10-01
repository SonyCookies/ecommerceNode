// models/Cart.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Cart', {
    total: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
  });
};
