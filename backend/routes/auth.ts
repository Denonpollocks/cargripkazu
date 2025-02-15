import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      phone, 
      country, 
      company 
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      country,
      company
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      userId: user._id
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: 'Error creating user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 