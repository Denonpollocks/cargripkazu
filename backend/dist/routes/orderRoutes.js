"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OrderController_1 = require("../controllers/OrderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const multerMiddleware_1 = require("../middleware/multerMiddleware");
const router = (0, express_1.Router)();
const orderController = new OrderController_1.OrderController();
// Apply auth middleware to all routes
router.use(authMiddleware_1.authMiddleware);
// Order routes
router.get('/orders', orderController.getUserOrders);
router.get('/orders/:orderId', orderController.getOrderDetails);
router.put('/orders/:orderId/shipping-address', orderController.updateShippingAddress);
router.put('/orders/:orderId/shipping-quote', orderController.updateShippingQuote);
router.put('/orders/:orderId/tracking', orderController.updateTracking);
router.post('/orders/:orderId/confirm-delivery', multerMiddleware_1.upload.array('images', 5), orderController.confirmDelivery);
exports.default = router;
