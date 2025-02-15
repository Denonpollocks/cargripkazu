import { Request, Response } from 'express';
import Order from '../models/Order';
import { emailService } from '../services/EmailService';
import User from '../models/User';

export class AdminOrderController {
  // Get all orders with user details
  public async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const orders = await Order.find()
        .populate('userId', 'firstName lastName email')
        .sort({ dateOrdered: -1 });

      const formattedOrders = orders.map(order => ({
        ...order.toObject(),
        user: order.userId ? {
          firstName: (order.userId as any).firstName,
          lastName: (order.userId as any).lastName,
          email: (order.userId as any).email
        } : null,
        userId: (order.userId as any)?._id
      }));

      res.status(200).json(formattedOrders);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching orders' });
    }
  }

  // Get single order by ID
  public async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const order = await Order.findOne({ orderId: req.params.orderId })
        .populate('userId', 'firstName lastName email');

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      const formattedOrder = {
        ...order.toObject(),
        user: order.userId ? {
          firstName: (order.userId as any).firstName,
          lastName: (order.userId as any).lastName,
          email: (order.userId as any).email
        } : null,
        userId: (order.userId as any)?._id
      };

      res.status(200).json(formattedOrder);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching order' });
    }
  }

  // Update order status and details
  public async updateOrder(req: Request, res: Response): Promise<void> {
    try {
      const { status, shipping } = req.body;

      const order = await Order.findOne({ orderId: req.params.orderId })
        .populate('userId', 'firstName lastName email');

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      // Update order status and shipping info
      order.status = status;
      if (shipping) {
        order.shipping = {
          ...order.shipping,
          ...shipping
        };
      }

      await order.save();

      // Send email notification based on status change
      if (order.userId) {
        const user = order.userId as any;
        
        if (status === 'shipped') {
          await emailService.sendShippingUpdate(user.email, {
            orderId: order.orderId,
            trackingNumber: order.shipping?.trackingNumber || '',
            status: order.shipping?.status || '',
            estimatedDelivery: order.shipping?.estimatedDelivery?.toString() || '',
            userName: user.firstName
          });
        } else if (status === 'delivered') {
          await emailService.sendDeliveryConfirmation(user.email, {
            orderId: order.orderId,
            deliveryDate: new Date().toISOString(),
            userName: user.firstName
          });
        }
      }

      const formattedOrder = {
        ...order.toObject(),
        user: order.userId ? {
          firstName: (order.userId as any).firstName,
          lastName: (order.userId as any).lastName,
          email: (order.userId as any).email
        } : null,
        userId: (order.userId as any)?._id
      };

      res.status(200).json(formattedOrder);
    } catch (error) {
      res.status(500).json({ error: 'Error updating order' });
    }
  }

  // Update shipping information
  public async updateShipping(req: Request, res: Response): Promise<void> {
    try {
      const { trackingNumber, estimatedDelivery, status, carrier, steps } = req.body;

      const order = await Order.findOne({ orderId: req.params.orderId })
        .populate('userId', 'firstName lastName email');

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      // Update shipping information
      order.shipping = {
        ...order.shipping,
        trackingNumber,
        estimatedDelivery,
        carrier: carrier || order.shipping?.carrier || '',
        steps: steps || order.shipping?.steps || [],
        status: status || order.shipping?.status || '',
        
      };

      await order.save();

      // Send shipping update email
      if (order.userId) {
        const user = order.userId as any;
        await emailService.sendShippingUpdate(user.email, {
          orderId: order.orderId,
          trackingNumber,
          status,
          estimatedDelivery,
          userName: user.firstName
        });
      }

      const formattedOrder = {
        ...order.toObject(),
        user: order.userId ? {
          firstName: (order.userId as any).firstName,
          lastName: (order.userId as any).lastName,
          email: (order.userId as any).email
        } : null,
        userId: (order.userId as any)?._id
      };

      res.status(200).json(formattedOrder);
    } catch (error) {
      res.status(500).json({ error: 'Error updating shipping information' });
    }
  }

  // Get order statistics
  public async getOrderStats(req: Request, res: Response): Promise<void> {
    try {
      const [
        totalOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        vehicleOrders,
        partsOrders
      ] = await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ status: 'processing' }),
        Order.countDocuments({ status: 'shipped' }),
        Order.countDocuments({ status: 'delivered' }),
        Order.countDocuments({ type: 'vehicle' }),
        Order.countDocuments({ type: 'parts' })
      ]);

      // Calculate total revenue
      const orders = await Order.find();
      const totalRevenue = orders.reduce((sum, order) => {
        const amount = parseFloat(order.payment.amount.replace(/[^0-9.-]+/g, ''));
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);

      // Get recent orders
      const recentOrders = await Order.find()
        .populate('userId', 'firstName lastName email')
        .sort({ dateOrdered: -1 })
        .limit(5);

      res.status(200).json({
        total: totalOrders,
        byStatus: {
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders
        },
        byType: {
          vehicle: vehicleOrders,
          parts: partsOrders
        },
        revenue: totalRevenue,
        recentOrders: recentOrders.map(order => ({
          ...order.toObject(),
          user: order.userId ? {
            firstName: (order.userId as any).firstName,
            lastName: (order.userId as any).lastName,
            email: (order.userId as any).email
          } : null,
          userId: (order.userId as any)?._id
        }))
      });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching order statistics' });
    }
  }
} 