// app/controllers/home.controller.js
const { Category, Product } = require('../models');
const { Sequelize } = require('sequelize'); // Import Sequelize

module.exports = {
  index: async (req, res) => {
    try {
      // Fetch 3 random categories
      const categories = await Category.findAll({
        order: [Sequelize.fn('RAND')], // Use Sequelize.fn for random ordering (MySQL)
        limit: 3,
      });

      // Fetch 3 random products
      const products = await Product.findAll({
        order: [Sequelize.fn('RAND')], // Use Sequelize.fn for random ordering (MySQL)
        limit: 3,
      });

      // Render the homepage with categories and products
      res.render('index', { categories, products });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).send("Server Error");
    }
  },
};
