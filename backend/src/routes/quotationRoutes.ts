import { Router } from 'express';
import { QuotationController } from '../controllers/QuotationController';
import { authMiddleware } from '../middleware/authMiddleware';
import { upload } from '../middleware/multerMiddleware';

const router = Router();
const quotationController = new QuotationController();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Quotation routes
router.post(
  '/quotations', 
  upload.single('part_image'), 
  quotationController.createQuotation
);
router.get('/quotations', quotationController.getUserQuotations);
router.get('/quotations/:quotationId', quotationController.getQuotationDetails);
router.put('/quotations/:quotationId/response', quotationController.updateQuotationResponse);
router.post('/quotations/:quotationId/accept', quotationController.acceptQuotation);
router.delete('/quotations/:quotationId', quotationController.cancelQuotation);
router.get('/quotations-stats', quotationController.getQuotationStats);

export default router; 