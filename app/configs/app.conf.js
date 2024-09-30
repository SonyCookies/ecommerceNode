const express = require("express");
const path = require("path");
const session = require('express-session')
const indexR = require("../routes/index.route");
const productR = require("../routes/product.route");
const adminR = require('../routes/admin.route')

const app = express();

// session
app.use(session({
    secret: "npm_run_dev",
    resave: false,
    saveUninitialized:true,
    cookie:{secure:false}
}))

app.set("view engine", "ejs");
app.set("views", path.join("app", "views"));
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/src", express.static(path.join(__dirname, "src")));

app.use(express.json());
app.use("/", indexR);
app.use("/products", productR);
app.use('/admin', adminR);

module.exports = app;
