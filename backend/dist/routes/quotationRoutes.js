"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const QuotationController_1 = require("../controllers/QuotationController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const multerMiddleware_1 = require("../middleware/multerMiddleware");
const router = (0, express_1.Router)();
const quotationController = new QuotationController_1.QuotationController();
// Apply auth middleware to all routes
router.use(authMiddleware_1.authMiddleware);
// Quotation routes
router.post('/quotations', multerMiddleware_1.upload.single('part_image'), quotationController.createQuotation);
router.get('/quotations', quotationController.getUserQuotations);
router.get('/quotations/:quotationId', quotationController.getQuotationDetails);
router.put('/quotations/:quotationId/response', quotationController.updateQuotationResponse);
router.post('/quotations/:quotationId/accept', quotationController.acceptQuotation);
router.delete('/quotations/:quotationId', quotationController.cancelQuotation);
router.get('/quotations-stats', quotationController.getQuotationStats);
exports.default = router;
