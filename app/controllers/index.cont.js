
const { Category, Product } = require('../models');
const { Sequelize } = require('sequelize'); 

module.exports = {
  index: async (req, res) => {
    try {
      const categories = await Category.findAll({
        order: [Sequelize.fn('RAND')], 
        limit: 3,
      });

      const products = await Product.findAll({
        order: [Sequelize.fn('RAND')], 
        limit: 3,
      });

      res.render('index', { categories, products });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).send("Server Error");
    }
  },
};
