import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Order from '../models/Order';
import Quotation from '../models/Quotation';
import { ApiError } from '../middleware/errorMiddleware';

export class AdminController {
  // Get all users
  public async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.find()
        .select('-password')
        .sort({ createdAt: -1 });
      
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching users' });
    }
  }

  // Get user by ID
  public async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findById(req.params.userId).select('-password');
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user' });
    }
  }

  // Create new user
  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, firstName, lastName, phone, country, company, isAdmin } = req.body;

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
        company,
        isAdmin
      });

      await user.save();

      // Remove password from response
      const userObj = user.toObject();
      const { password: _, ...userResponse } = userObj;

      res.status(201).json(userResponse);
    } catch (error) {
      res.status(500).json({ error: 'Error creating user' });
    }
  }

  // Update user
  public async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { password, ...updateData } = req.body;
      
      // If password is provided, hash it
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }

      const user = await User.findByIdAndUpdate(
        req.params.userId,
        updateData,
        { new: true }
      ).select('-password');

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error updating user' });
    }
  }

  // Delete user
  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findByIdAndDelete(req.params.userId);
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting user' });
    }
  }

  // Get dashboard statistics
  public async getDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      const [
        totalUsers,
        activeQuotations,
        totalOrders,
        pendingShipments
      ] = await Promise.all([
        User.countDocuments(),
        Quotation.countDocuments({ status: 'pending' }),
        Order.countDocuments(),
        Order.countDocuments({ status: 'processing' })
      ]);

      res.status(200).json({
        users: totalUsers,
        quotations: activeQuotations,
        orders: totalOrders,
        pendingShipments
      });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching dashboard statistics' });
    }
  }
} 