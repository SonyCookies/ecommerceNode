const { Product, Category } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  index: async (req, res) => {
    const categoryId = req.query.categoryId || null;
    const searchQuery = req.query.search || "";

    try {
      const products = await Product.findAll({
        where: {
          ...(categoryId ? { categoryId } : {}),
          ...(searchQuery ? { name: { [Op.like]: `%${searchQuery}%` } } : {}),
        },
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["name"],
          },
        ],
      });

      const categories = await Category.findAll();

      res.render("products", {
        products,
        categories,
        selectedCategoryId: categoryId,
        searchQuery,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).send("Server Error");
    }
  },

  loadProducts: async (req, res) => {
    const categoryId = req.query.categoryId || null;
    const searchQuery = req.query.search || "";
    const sort = req.query.sort;

    const order = [];
    if (sort === "price-asc") {
      order.push(["price", "ASC"]);
    } else if (sort === "price-desc") {
      order.push(["price", "DESC"]);
    }

    try {
      const products = await Product.findAll({
        where: {
          ...(categoryId ? { categoryId } : {}),
          ...(searchQuery ? { name: { [Op.like]: `%${searchQuery}%` } } : {}),
        },
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["name"],
          },
        ],
        order: order.length > 0 ? order : undefined,
      });

      return res.render("partials/productGrid", { products });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).send("Server Error");
    }
  },

  view: async (req, res) => {
    const productId = req.params.id;

    try {
      const product = await Product.findByPk(productId);

      if (!product) {
        return res.status(404).send("Product not found");
      }

      res.render('product_view', { product });
    } catch (error) {
      console.error('Error fetching product details:', error);
      res.status(500).send("Server Error");
    }
  }
};
