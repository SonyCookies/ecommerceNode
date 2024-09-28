const { sequelize } = require("../configs/db.conf");
const { DataTypes } = require("sequelize");

console.log("Defining models and associations...");

const User = require("./User")(sequelize, DataTypes);
const Product = require("./Product")(sequelize, DataTypes);
const Category = require("./Category")(sequelize, DataTypes);
const Order = require("./Order")(sequelize, DataTypes);
const OrderItem = require("./OrderItem")(sequelize, DataTypes);
const Address = require("./Address")(sequelize, DataTypes);
const Payment = require("./Payment")(sequelize, DataTypes);

const applyAssociations = () => {
  User.hasMany(Order, { foreignKey: "userId", as: "orders" });
  User.hasMany(Address, { foreignKey: "userId", as: "addresses" });

  Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
  Product.belongsToMany(Order, { through: OrderItem, as: "orders" });

  Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });

  Order.belongsTo(User, { foreignKey: "userId", as: "user" });
  Order.belongsToMany(Product, { through: OrderItem, as: "products" });

  Address.belongsTo(User, { foreignKey: "userId", as: "user" });
  Payment.belongsTo(Order, { foreignKey: "orderId", as: "order" });
};

applyAssociations();

module.exports = {
  User,
  Product,
  Category,
  Order,
  OrderItem,
  Address,
  Payment,
};
