import { Router } from 'express';
import { AdminShippingController } from '../controllers/AdminShippingController';
import { adminMiddleware } from '../middleware/adminMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const adminShippingController = new AdminShippingController();

// Apply auth and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Shipping management routes
router.get('/shipments', adminShippingController.getAllShipments);
router.get('/shipments/:orderId', adminShippingController.getShipmentById);
router.put('/shipments/:orderId', adminShippingController.updateShipment);
router.get('/shipments/stats', adminShippingController.getShippingStats);

export default router; 