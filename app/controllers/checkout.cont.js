const {
  Order,
  OrderItem,
  Product,
  Payment,
  Cart,
  CartItem,
} = require("../models");

module.exports = {
  handleCheckout: async (req, res) => {
    try {
      const userId = req.session.userId;

      const cart = await Cart.findOne({
        where: { userId },
        include: {
          model: Product,
          as: "products",
          through: {
            model: CartItem,
            as: "cartItems",
          },
        },
      });

      if (!cart || cart.products.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Cart is empty." });
      }

      // Calculate the total
      const total = cart.products.reduce((sum, product) => {
        return sum + product.price * product.cartItems.quantity;
      }, 0);

      // Create the order
      const order = await Order.create({
        userId: userId,
        total: total,
        status: "pending",
      });

      // Add products to OrderItems
      const orderItems = cart.products.map((product) => ({
        quantity: product.cartItems.quantity,
        price: product.price,
        ProductId: product.id,
        OrderId: order.id,
      }));

      await OrderItem.bulkCreate(orderItems);

      // Clear the cart
      await CartItem.destroy({ where: { CartId: cart.id } });
      await cart.destroy();

      res.json({ success: true, orderId: order.id });
    } catch (error) {
      console.error("Error during checkout:", error);
      res.status(500).json({ success: false, message: "Checkout failed." });
    }
  },

  showConfirmationPage: async (req, res) => {
    const { orderId } = req.query;
    try {
      const order = await Order.findByPk(orderId, {
        include: [
          {
            model: Product,
            as: "products", // Use the alias defined in your associations
            through: {
              model: OrderItem,
              as: "orderItems", // If applicable, use the alias for the junction table
            },
          },
        ],
      });

      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found." });
      }

      res.render("confirm", { order });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to load order confirmation page.",
      });
    }
  },

  confirmOrder: async (req, res) => {
    const { orderId, paymentMethod } = req.body;

    try {
      const order = await Order.findByPk(orderId);
      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found." });
      }

      await Payment.create({
        method: paymentMethod,
        status: "completed",
        orderId: orderId,
      });

      order.status = "completed";
      await order.save();

      res.json({ success: true, message: "Order confirmed!" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Order confirmation failed." });
    }
  },
};
