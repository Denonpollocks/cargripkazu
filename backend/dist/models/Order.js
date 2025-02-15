"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const OrderSchema = new mongoose_1.Schema({
    orderId: { type: String, required: true, unique: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    quotationId: { type: String, required: true },
    type: { type: String, enum: ['vehicle', 'parts'], required: true },
    status: {
        type: String,
        enum: ['processing', 'shipped', 'delivered'],
        default: 'processing'
    },
    dateOrdered: { type: Date, default: Date.now },
    details: { type: mongoose_1.Schema.Types.Mixed, required: true },
    payment: {
        amount: { type: String, required: true },
        receiptUrl: { type: String, required: true },
        dateSubmitted: { type: Date, default: Date.now },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending'
        }
    },
    shipping: {
        trackingNumber: String,
        estimatedDelivery: Date,
        status: String,
        carrier: String,
        steps: [{
                status: String,
                date: Date,
                location: String,
                description: String
            }]
    },
    shippingAddress: {
        fullName: String,
        address: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        phone: String
    },
    shippingQuote: {
        method: String,
        cost: String,
        estimatedDays: String,
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        }
    },
    deliveryConfirmation: {
        images: [String],
        confirmedAt: Date,
        feedback: String
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Order', OrderSchema);
