// controllers/cart.cont.js
const { Cart, CartItem, Product } = require("../models");

async function recalculateCartTotal(cart) {
  const updatedCart = await Cart.findOne({
    where: { id: cart.id },
    include: {
      model: Product,
      as: "products",
      through: {
        model: CartItem,
        as: "cartItems",
      },
    },
  });

  const total = updatedCart.products.reduce((sum, product) => {
    return sum + product.price * product.cartItems.quantity;
  }, 0);

  updatedCart.total = total;
  await updatedCart.save();
}

module.exports = {
  addToCart: async (req, res) => {
    console.log("Request Body:", req.body);
    const { productId } = req.body;
    const userId = req.session.userId;

    let cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      try {
        cart = await Cart.create({ userId }); 
        console.log("Created new cart with ID:", cart.id);
      } catch (error) {
        console.error("Error creating new cart:", error);
        return res
          .status(500)
          .json({ success: false, message: "Failed to create a cart" });
      }
    }

    console.log("Cart ID:", cart.id, "Product ID:", productId);

    try {
      let cartItem = await CartItem.findOne({
        where: { CartId: cart.id, ProductId: productId },
      });

      if (cartItem) {
        cartItem.quantity += 1;
        await cartItem.save();
        res
          .status(200)
          .json({ success: true, message: "Item quantity updated in cart" });
      } else {
        await CartItem.create({
          CartId: cart.id,
          ProductId: productId,
          quantity: 1,
        });
        res.status(200).json({ success: true, message: "Item added to cart" });
      }
    } catch (error) {
      console.error("Error handling CartItem:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to add/update item in cart" });
    }
  },

  viewCart: async (req, res) => {
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

    if (cart) {
      const total = cart.products.reduce((sum, product) => {
        return sum + product.price * product.cartItems.quantity;
      }, 0);

      cart.total = total;
    }

    res.render("cart", { cart });
  },

  updateQuantity: async (req, res) => {
    const { productId, action } = req.body;
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

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found." });
    }

    const cartItem = await CartItem.findOne({
      where: { CartId: cart.id, ProductId: productId },
    });

    if (!cartItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found." });
    }

    if (action === "increase") {
      cartItem.quantity += 1;
    } else if (action === "decrease") {
      cartItem.quantity -= 1;
      if (cartItem.quantity < 1) {
        await cartItem.destroy();
        await recalculateCartTotal(cart);
        return res.json({ success: true });
      }
    }

    await cartItem.save();

    await recalculateCartTotal(cart);

    res.json({ success: true });
  },

  remove: async (req, res) => {
    const { productId } = req.body;
    const userId = req.session.userId;

    const cart = await Cart.findOne({ where: { userId } });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found." });

    await CartItem.destroy({ where: { cartId: cart.id, productId } });
    res.json({ success: true });
  },

  checkout: async (req, res) => {},
};
