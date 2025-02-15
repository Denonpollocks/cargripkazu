"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotationController = void 0;
const Quotation_1 = __importDefault(require("../models/Quotation"));
const s3_1 = require("../utils/s3");
const EmailService_1 = require("../services/EmailService");
const User_1 = __importDefault(require("../models/User"));
class QuotationController {
    // Create new quotation
    async createQuotation(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ error: 'User ID not found' });
                return;
            }
            const { type, details } = req.body;
            // Handle part image upload if present
            if (type === 'parts' && req.file) {
                const imageUrl = await (0, s3_1.uploadToS3)(req.file);
                details.part_image = imageUrl;
            }
            const quotation = new Quotation_1.default({
                userId,
                type,
                details,
                dateSubmitted: new Date()
            });
            await quotation.save();
            const user = await User_1.default.findById(userId);
            if (user) {
                await EmailService_1.emailService.sendQuotationConfirmation(user.email, {
                    quotationId: quotation._id,
                    type: quotation.type,
                    details: quotation.details,
                    userName: user.firstName
                });
            }
            res.status(201).json(quotation);
        }
        catch (error) {
            res.status(500).json({ error: 'Error creating quotation' });
        }
    }
    // Get all quotations for a user
    async getUserQuotations(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ error: 'User ID not found' });
                return;
            }
            const quotations = await Quotation_1.default.find({ userId })
                .sort({ dateSubmitted: -1 });
            res.status(200).json(quotations);
        }
        catch (error) {
            res.status(500).json({ error: 'Error fetching quotations' });
        }
    }
    // Get single quotation details
    async getQuotationDetails(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ error: 'User ID not found' });
                return;
            }
            const quotation = await Quotation_1.default.findOne({
                _id: req.params.quotationId,
                userId
            });
            if (!quotation) {
                res.status(404).json({ error: 'Quotation not found' });
                return;
            }
            res.status(200).json(quotation);
        }
        catch (error) {
            res.status(500).json({ error: 'Error fetching quotation details' });
        }
    }
    // Update quotation response (admin only)
    async updateQuotationResponse(req, res) {
        try {
            // TODO: Add admin check middleware
            const { availability, estimatedDelivery, additionalNotes, priceBreakdown } = req.body;
            const quotation = await Quotation_1.default.findByIdAndUpdate(req.params.quotationId, {
                status: 'responded',
                response: {
                    availability,
                    estimatedDelivery,
                    additionalNotes,
                    priceBreakdown
                }
            }, { new: true });
            if (!quotation) {
                res.status(404).json({ error: 'Quotation not found' });
                return;
            }
            const user = await User_1.default.findById(quotation.userId);
            if (user) {
                await EmailService_1.emailService.sendQuotationResponse(user.email, {
                    quotationId: quotation._id,
                    type: quotation.type,
                    response: quotation.response,
                    userName: user.firstName
                });
            }
            res.status(200).json(quotation);
        }
        catch (error) {
            res.status(500).json({ error: 'Error updating quotation response' });
        }
    }
    // Accept quotation and create order
    async acceptQuotation(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ error: 'User ID not found' });
                return;
            }
            const quotation = await Quotation_1.default.findOne({
                _id: req.params.quotationId,
                userId,
                status: 'responded'
            });
            if (!quotation) {
                res.status(404).json({ error: 'Quotation not found or not in responded state' });
                return;
            }
            // Update quotation status
            quotation.status = 'ordered';
            await quotation.save();
            // Create order (this will be implemented in OrderController)
            // const order = await orderController.createOrderFromQuotation(quotation);
            res.status(200).json({
                message: 'Quotation accepted',
                quotation
                // order
            });
        }
        catch (error) {
            res.status(500).json({ error: 'Error accepting quotation' });
        }
    }
    // Cancel quotation
    async cancelQuotation(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ error: 'User ID not found' });
                return;
            }
            const quotation = await Quotation_1.default.findOneAndDelete({
                _id: req.params.quotationId,
                userId,
                status: 'pending' // Can only cancel pending quotations
            });
            if (!quotation) {
                res.status(404).json({ error: 'Quotation not found or cannot be cancelled' });
                return;
            }
            res.status(200).json({ message: 'Quotation cancelled successfully' });
        }
        catch (error) {
            res.status(500).json({ error: 'Error cancelling quotation' });
        }
    }
    // Get quotation statistics (admin only)
    async getQuotationStats(req, res) {
        try {
            // TODO: Add admin check middleware
            const stats = await Quotation_1.default.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ]);
            const typeStats = await Quotation_1.default.aggregate([
                {
                    $group: {
                        _id: '$type',
                        count: { $sum: 1 }
                    }
                }
            ]);
            res.status(200).json({
                statusStats: stats,
                typeStats
            });
        }
        catch (error) {
            res.status(500).json({ error: 'Error fetching quotation statistics' });
        }
    }
}
exports.QuotationController = QuotationController;
