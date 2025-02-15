import { Router } from 'express';
import { AdminContentController } from '../controllers/AdminContentController';
import { adminMiddleware } from '../middleware/adminMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import multer from 'multer';

const router = Router();
const adminContentController = new AdminContentController();

// Apply auth and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Content management routes
router.get('/content/:pageType', adminContentController.getPageContent);
router.put('/content/:pageType', adminContentController.updatePageContent);
router.post('/content/upload', upload.single('media'), adminContentController.uploadMedia);

export default router; 