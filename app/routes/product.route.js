// app/routes/product.routes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.cont");

router.get("/", productController.index);  
router.get("/load", productController.loadProducts); 
router.get("/:id", productController.view);

module.exports = router;
