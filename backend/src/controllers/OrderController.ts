import { Request, Response } from 'express';
import Order from '../models/Order';
import { uploadToS3 } from '../utils/s3';

export class OrderController {
  // Get all orders for a user
  public async getUserOrders(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id; // Use optional chaining
      if (!userId) {
        res.status(401).json({ error: 'User ID not found' });
        return;
      }

      const orders = await Order.find({ userId }).sort({ dateOrdered: -1 });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching orders' });
    }
  }

  // Get single order details
  public async getOrderDetails(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'User ID not found' });
        return;
      }

      const order = await Order.findOne({ 
        orderId: req.params.orderId,
        userId 
      });
      
      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching order details' });
    }
  }

  // Update shipping address
  public async updateShippingAddress(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'User ID not found' });
        return;
      }

      const order = await Order.findOneAndUpdate(
        { orderId: req.params.orderId, userId },
        { shippingAddress: req.body },
        { new: true }
      );

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: 'Error updating shipping address' });
    }
  }

  // Update shipping quote
  public async updateShippingQuote(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'User ID not found' });
        return;
      }

      const order = await Order.findOneAndUpdate(
        { orderId: req.params.orderId, userId },
        { shippingQuote: req.body },
        { new: true }
      );

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: 'Error updating shipping quote' });
    }
  }

  // Update tracking information
  public async updateTracking(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'User ID not found' });
        return;
      }

      const { trackingNumber, carrier, status, step } = req.body;
      
      const order = await Order.findOne({ 
        orderId: req.params.orderId,
        userId 
      });

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      if (!order.shipping) {
        order.shipping = {
          trackingNumber,
          carrier,
          status,
          estimatedDelivery: new Date(),
          steps: []
        };
      }

      if (step) {
        order.shipping.steps.push(step);
      }

      order.shipping.status = status;
      await order.save();

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: 'Error updating tracking information' });
    }
  }

  // Confirm delivery with images
  public async confirmDelivery(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'User ID not found' });
        return;
      }

      const { feedback } = req.body;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        res.status(400).json({ error: 'No images provided' });
        return;
      }

      // Upload images to S3
      const imageUrls = await Promise.all(
        files.map(file => uploadToS3(file))
      );

      const order = await Order.findOneAndUpdate(
        { orderId: req.params.orderId, userId },
        {
          status: 'delivered',
          deliveryConfirmation: {
            images: imageUrls,
            confirmedAt: new Date(),
            feedback
          }
        },
        { new: true }
      );

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: 'Error confirming delivery' });
    }
  }
} 