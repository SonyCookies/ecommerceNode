const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.cont');

router.post('/add', cartController.addToCart);
router.get('/', cartController.viewCart);
router.post('/update', cartController.updateQuantity);
router.post('/remove', cartController.remove);
router.post('/checkout', cartController.checkout);

module.exports = router;
