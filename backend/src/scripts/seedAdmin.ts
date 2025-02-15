import User from '../models/User';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    
    const adminUser = new User({
      email: 'admin@car-grip.com',
      password: 'admin123',  // Will be hashed by the User model
      firstName: 'Admin',
      lastName: 'User',
      phone: '1234567890',
      country: 'Japan',
      isAdmin: true
    });

    await adminUser.save();
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin(); 