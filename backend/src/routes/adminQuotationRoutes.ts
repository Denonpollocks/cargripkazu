import { Router } from 'express';
import { AdminQuotationController } from '../controllers/AdminQuotationController';
import { adminMiddleware } from '../middleware/adminMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const adminQuotationController = new AdminQuotationController();

// Apply auth and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Quotation management routes
router.get('/quotations', adminQuotationController.getAllQuotations);
router.get('/quotations/:quotationId', adminQuotationController.getQuotationById);
router.put('/quotations/:quotationId/response', adminQuotationController.respondToQuotation);
router.get('/quotations/stats', adminQuotationController.getQuotationStats);

export default router; 