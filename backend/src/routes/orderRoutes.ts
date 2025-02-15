import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authMiddleware } from '../middleware/authMiddleware';
import { upload } from '../middleware/multerMiddleware';

const router = Router();
const orderController = new OrderController();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Order routes
router.get('/orders', orderController.getUserOrders);
router.get('/orders/:orderId', orderController.getOrderDetails);
router.put('/orders/:orderId/shipping-address', orderController.updateShippingAddress);
router.put('/orders/:orderId/shipping-quote', orderController.updateShippingQuote);
router.put('/orders/:orderId/tracking', orderController.updateTracking);
router.post('/orders/:orderId/confirm-delivery', upload.array('images', 5), orderController.confirmDelivery);

export default router; 