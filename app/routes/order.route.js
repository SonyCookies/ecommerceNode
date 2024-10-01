const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.cont');

router.get('/', orderController.getUserOrders);

module.exports = router;
