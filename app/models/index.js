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
const Admin = require('./Admin')(sequelize, DataTypes);
const Cart = require("./Cart")(sequelize, DataTypes);
const CartItem = require("./CartItem")(sequelize, DataTypes);

const applyAssociations = () => {
  // User associations
  User.hasMany(Order, { foreignKey: "userId", as: "orders" });
  User.hasMany(Address, { foreignKey: "userId", as: "addresses" });
  User.hasOne(Cart, { foreignKey: "userId", as: "cart" }); // One cart per user

  // Product associations
  Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
  Product.belongsToMany(Order, { through: OrderItem, as: "orders" }); // Product can be part of many orders
  Product.belongsToMany(Cart, { through: CartItem, as: "carts" }); // Product can be in many carts

  // Category associations
  Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });

  // Order associations
  Order.belongsTo(User, { foreignKey: "userId", as: "user" });
  Order.belongsToMany(Product, { through: OrderItem, as: "products" }); // Many-to-many between Order and Product
  Order.hasMany(OrderItem, { foreignKey: "OrderId", as: "orderItems" }); // An order has many order items

  // OrderItem associations
  OrderItem.belongsTo(Order, { foreignKey: "OrderId", as: "order" }); // An order item belongs to an order
  OrderItem.belongsTo(Product, { foreignKey: "ProductId", as: "product" }); // An order item belongs to a product

  // Address associations
  Address.belongsTo(User, { foreignKey: "userId", as: "user" });

  // Payment associations
  Payment.belongsTo(Order, { foreignKey: "orderId", as: "order" });

  Admin.hasMany(Order, {foreignKey: "adminId", as: "orders"});
  Admin.belongsTo(Admin, {foreignKey: 'createdById', as: 'creator',  });
  // Cart associations
  Cart.belongsTo(User, { foreignKey: "userId", as: "user" }); // Each cart belongs to a user
  Cart.belongsToMany(Product, { through: CartItem, as: "products" }); // Each cart can have many products
};

applyAssociations();

module.exports = {
  sequelize,
  User,
  Product,
  Category,
  Order,
  OrderItem,
  Address,
  Payment,
  Admin,
  Cart,
  CartItem,
};
