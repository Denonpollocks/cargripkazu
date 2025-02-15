import { Router } from 'express';
import { AdminOrderController } from '../controllers/AdminOrderController';
import { adminMiddleware } from '../middleware/adminMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const adminOrderController = new AdminOrderController();

// Apply auth and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Order management routes
router.get('/orders', adminOrderController.getAllOrders);
router.get('/orders/:orderId', adminOrderController.getOrderById);
router.put('/orders/:orderId', adminOrderController.updateOrder);
router.put('/orders/:orderId/shipping', adminOrderController.updateShipping);
router.get('/orders/stats', adminOrderController.getOrderStats);

export default router; 