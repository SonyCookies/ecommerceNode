const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkout.cont");

// Create the order
router.post("/create", checkoutController.handleCheckout);

// Display the confirmation page
router.get("/confirm", checkoutController.showConfirmationPage);

// Finalize the payment
router.post("/confirm", checkoutController.confirmOrder);

module.exports = router;
