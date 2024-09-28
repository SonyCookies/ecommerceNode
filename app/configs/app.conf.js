const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(path.join(__dirname, "../../public")));
app.use("/src", express.static(path.join(__dirname, "../../src")));

app.use(express.json());

module.exports = app;
