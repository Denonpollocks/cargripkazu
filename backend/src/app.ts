import dotenv from 'dotenv';
// Load environment variables first
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import orderRoutes from './routes/orderRoutes';
import { errorHandler } from './middleware/errorMiddleware';
import authRoutes from './routes/authRoutes';
import quotationRoutes from './routes/quotationRoutes';
import adminRoutes from './routes/adminRoutes';
import adminQuotationRoutes from './routes/adminQuotationRoutes';
import adminOrderRoutes from './routes/adminOrderRoutes';
import adminShippingRoutes from './routes/adminShippingRoutes';
import adminContentRoutes from './routes/adminContentRoutes';

// Update config import to use environment variables directly
const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/cargrip',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'ap-northeast-1',
    bucketName: process.env.AWS_BUCKET_NAME || 'cargrip-uploads',
  },
};

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminQuotationRoutes);
app.use('/api/admin', adminOrderRoutes);
app.use('/api/admin', adminShippingRoutes);
app.use('/api/admin', adminContentRoutes);
app.use('/api', orderRoutes);
app.use('/api', quotationRoutes);

// Error handling
app.use(errorHandler);

// MongoDB connection with proper error handling
mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('Connected to MongoDB');
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (error: Error) => {
  console.error('Unhandled Promise Rejection:', error);
  process.exit(1);
});

export default app; 