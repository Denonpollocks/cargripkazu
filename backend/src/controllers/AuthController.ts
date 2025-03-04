import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { config } from '../config';
import bcryptjs from 'bcryptjs';

export class AuthController {
  // Register new user
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, firstName, lastName, phone, country, company } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ error: 'Email already registered' });
        return;
      }

      // Create new user
      const user = new User({
        email,
        password,
        firstName,
        lastName,
        phone,
        country,
        company
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        config.jwtSecret,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Error registering user' });
    }
  }

  // Login user
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      
      const user = await User.findOne({ email, password });
      console.log('Login attempt for email:', email);
      
      if (!user) {
        console.log('User not found or invalid password');
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign(
        { 
          id: user._id, 
          email: user.email,
          isAdmin: user.isAdmin 
        },
        config.jwtSecret,
        { expiresIn: '24h' }
      );

      res.status(200).json({
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin
        }
      });
    } catch (error) {
      console.error('Login error details:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Get current user
  public async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const user = await User.findById(userId).select('-password');
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user' });
    }
  }
} 