const { sequelize, DataTypes } = require("../configs/db.conf");
const Category = require("../models/Category")(sequelize, DataTypes);
const Product = require("../models/Product")(sequelize, DataTypes);

const seedDatabase = async () => {
  try {
    await sequelize.sync();
    console.log("Database synchronized.");

    const categories = [
      { name: "Electronics" },
      { name: "Clothing" },
      { name: "Home & Kitchen" },
      { name: "Books" },
      { name: "Toys & Games" },
    ];

    const createdCategories = await Category.bulkCreate(categories);
    console.log("Categories populated:", createdCategories);

    const products = [
      {
        name: "Smartphone",
        description: "Latest model smartphone with high-resolution camera.",
        price: 699.99,
        stock: 100,
        categoryId: createdCategories[0].id,
      },
      {
        name: "Laptop",
        description: "Powerful laptop for gaming and work.",
        price: 1299.99,
        stock: 50,
        categoryId: createdCategories[0].id,
      },
      {
        name: "T-Shirt",
        description: "Comfortable cotton T-shirt.",
        price: 19.99,
        stock: 200,
        categoryId: createdCategories[1].id,
      },
      {
        name: "Jeans",
        description: "Stylish jeans for everyday wear.",
        price: 49.99,
        stock: 150,
        categoryId: createdCategories[1].id,
      },
      {
        name: "Blender",
        description: "High-speed blender for smoothies.",
        price: 99.99,
        stock: 75,
        categoryId: createdCategories[2].id,
      },
      {
        name: "Cookbook",
        description: "Delicious recipes for home cooking.",
        price: 29.99,
        stock: 30,
        categoryId: createdCategories[3].id,
      },
      {
        name: "Board Game",
        description: "Fun family board game for all ages.",
        price: 29.99,
        stock: 60,
        categoryId: createdCategories[4].id,
      },
    ];

    const createdProducts = await Product.bulkCreate(products);
    console.log("Products populated:", createdProducts);
  } catch (error) {
    console.error("Error populating the database:", error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
