const express = require("express");
const session = require("express-session");
const flash = require("connect-flash"); 
const path = require("path");
const indexR = require("../routes/index.route");
const productR = require("../routes/product.route");
const userR = require("../routes/user.route");


const app = express();

app.set("view engine", "ejs");
app.set("views", path.join("app", "views"));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "npm_run_devs", // Change this to a secure key
    resave: false,
    saveUninitialized: true,
    cookie: {secure:false}
  }));

  app.use(flash()); 

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/src", express.static(path.join(__dirname, "src")));

app.use(express.json());
app.use("/", indexR);
app.use("/products", productR);
app.use("/user", userR)


module.exports = app;
