const { Order, OrderItem, Product } = require("../models");

module.exports = {
  getUserOrders: async (req, res) => {
    try {
      const userId = req.session.userId;
      const orders = await Order.findAll({
        where: { userId },
        include: [
          {
            model: OrderItem,
            as: "orderItems",
            include: [{ model: Product, as: "product" }],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.render("orders", { orders });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch orders" });
    }
  },
};
