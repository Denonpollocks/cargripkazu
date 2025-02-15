import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { adminMiddleware } from '../middleware/adminMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const adminController = new AdminController();

// Apply auth and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// User management routes
router.get('/users', adminController.getUsers);
router.get('/users/:userId', adminController.getUserById);
router.post('/users', adminController.createUser);
router.put('/users/:userId', adminController.updateUser);
router.delete('/users/:userId', adminController.deleteUser);

// Dashboard statistics
router.get('/dashboard/stats', adminController.getDashboardStats);

export default router; 