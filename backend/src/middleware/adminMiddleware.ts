import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Check if user is admin
    const user = await User.findById(userId);
    if (!user?.isAdmin) {
      res.status(403).json({ error: 'Admin access required' });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Error checking admin status' });
  }
}; 