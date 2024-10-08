const express = require("express");
const flash = require("connect-flash");
const path = require("path");
const session = require('express-session')
const indexR = require("../routes/index.route");
const productR = require("../routes/product.route");
const adminR = require('../routes/admin.route')
const cartR = require("../routes/cart.route");
const checkoutR = require("../routes/checkout.route");
const orderR = require("../routes/order.route");
const userR = require("../routes/user.route");
const session = require("express-session");

const app = express();

app.use(
  session({
    secret:
      "2fc29b2209d5de507a4ea271bc43fa81464ba2ee028280eb056d91d12c5b8e48cb48be1cb6cc6adb8bef7362024934c6ab783c926cf95a392c9ddbec89884efc",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use((req, res, next) => {
  if (!req.session.userId) {
    req.session.userId = 2024;
  }
  next();
});

app.use(flash());

app.set("view engine", "ejs");
app.set("views", path.join("app", "views"));
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/src", express.static(path.join(__dirname, "src")));

app.use(express.json());
app.use("/", indexR);
app.use("/products", productR);
app.use('/admin', adminR);
app.use("/cart", cartR);
app.use("/checkout", checkoutR);
app.use("/orders", orderR);
app.use("/user", userR);

module.exports = app;
