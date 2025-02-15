"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const s3_1 = require("../utils/s3");
class OrderController {
    // Get all orders for a user
    async getUserOrders(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Use optional chaining
            if (!userId) {
                res.status(401).json({ error: 'User ID not found' });
                return;
            }
            const orders = await Order_1.default.find({ userId }).sort({ dateOrdered: -1 });
            res.status(200).json(orders);
        }
        catch (error) {
            res.status(500).json({ error: 'Error fetching orders' });
        }
    }
    // Get single order details
    async getOrderDetails(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ error: 'User ID not found' });
                return;
            }
            const order = await Order_1.default.findOne({
                orderId: req.params.orderId,
                userId
            });
            if (!order) {
                res.status(404).json({ error: 'Order not found' });
                return;
            }
            res.status(200).json(order);
        }
        catch (error) {
            res.status(500).json({ error: 'Error fetching order details' });
        }
    }
    // Update shipping address
    async updateShippingAddress(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ error: 'User ID not found' });
                return;
            }
            const order = await Order_1.default.findOneAndUpdate({ orderId: req.params.orderId, userId }, { shippingAddress: req.body }, { new: true });
            if (!order) {
                res.status(404).json({ error: 'Order not found' });
                return;
            }
            res.status(200).json(order);
        }
        catch (error) {
            res.status(500).json({ error: 'Error updating shipping address' });
        }
    }
    // Update shipping quote
    async updateShippingQuote(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ error: 'User ID not found' });
                return;
            }
            const order = await Order_1.default.findOneAndUpdate({ orderId: req.params.orderId, userId }, { shippingQuote: req.body }, { new: true });
            if (!order) {
                res.status(404).json({ error: 'Order not found' });
                return;
            }
            res.status(200).json(order);
        }
        catch (error) {
            res.status(500).json({ error: 'Error updating shipping quote' });
        }
    }
    // Update tracking information
    async updateTracking(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ error: 'User ID not found' });
                return;
            }
            const { trackingNumber, carrier, status, step } = req.body;
            const order = await Order_1.default.findOne({
                orderId: req.params.orderId,
                userId
            });
            if (!order) {
                res.status(404).json({ error: 'Order not found' });
                return;
            }
            if (!order.shipping) {
                order.shipping = {
                    trackingNumber,
                    carrier,
                    status,
                    estimatedDelivery: new Date(),
                    steps: []
                };
            }
            if (step) {
                order.shipping.steps.push(step);
            }
            order.shipping.status = status;
            await order.save();
            res.status(200).json(order);
        }
        catch (error) {
            res.status(500).json({ error: 'Error updating tracking information' });
        }
    }
    // Confirm delivery with images
    async confirmDelivery(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ error: 'User ID not found' });
                return;
            }
            const { feedback } = req.body;
            const files = req.files;
            if (!files || files.length === 0) {
                res.status(400).json({ error: 'No images provided' });
                return;
            }
            // Upload images to S3
            const imageUrls = await Promise.all(files.map(file => (0, s3_1.uploadToS3)(file)));
            const order = await Order_1.default.findOneAndUpdate({ orderId: req.params.orderId, userId }, {
                status: 'delivered',
                deliveryConfirmation: {
                    images: imageUrls,
                    confirmedAt: new Date(),
                    feedback
                }
            }, { new: true });
            if (!order) {
                res.status(404).json({ error: 'Order not found' });
                return;
            }
            res.status(200).json(order);
        }
        catch (error) {
            res.status(500).json({ error: 'Error confirming delivery' });
        }
    }
}
exports.OrderController = OrderController;
