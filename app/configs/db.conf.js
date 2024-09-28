const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("ecommerce_node", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

// const initModels = require("../models/index");
// initModels(sequelize);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to Database");
    await sequelize.sync({});
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, DataTypes, connectDB };
