import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middleware/authMiddleware';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', authMiddleware, authController.getCurrentUser);

// Signup route
router.post('/signup', asyncHandler(async (req: express.Request, res: express.Response) => {
  const { 
    firstName, 
    lastName, 
    email, 
    password, 
    phone, 
    country, 
    company 
  } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user with plain password
  const user = await User.create({
    firstName,
    lastName,
    email,
    password, // Store password as-is
    phone,
    country,
    company
  });

  if (user) {
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
}));

export default router; 