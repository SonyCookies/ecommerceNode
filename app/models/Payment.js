module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    method: {
      type: DataTypes.ENUM('credit_card', 'paypal', 'bank_transfer'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
    },
  });
};