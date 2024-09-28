const express = require("express");
const path = require("path");
const indexR = require("../routes/index.route");
const productR = require("../routes/product.route");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join("app", "views"));
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/src", express.static(path.join(__dirname, "src")));

app.use(express.json());
app.use("/", indexR);
app.use("/products", productR);

module.exports = app;
