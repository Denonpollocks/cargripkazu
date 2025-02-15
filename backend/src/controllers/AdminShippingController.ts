import { Request, Response } from 'express';
import Order from '../models/Order';
import { emailService } from '../services/EmailService';

export class AdminShippingController {
  // Get all shipments
  public async getAllShipments(req: Request, res: Response): Promise<void> {
    try {
      const shipments = await Order.find({ 
        'shipping.trackingNumber': { $exists: true } 
      })
        .populate('userId', 'firstName lastName email')
        .sort({ dateOrdered: -1 });

      const formattedShipments = shipments.map(shipment => ({
        ...shipment.toObject(),
        user: shipment.userId ? {
          firstName: (shipment.userId as any).firstName,
          lastName: (shipment.userId as any).lastName,
          email: (shipment.userId as any).email
        } : null,
        userId: (shipment.userId as any)?._id
      }));

      res.status(200).json(formattedShipments);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching shipments' });
    }
  }

  // Get single shipment by order ID
  public async getShipmentById(req: Request, res: Response): Promise<void> {
    try {
      const shipment = await Order.findOne({ orderId: req.params.orderId })
        .populate('userId', 'firstName lastName email');

      if (!shipment) {
        res.status(404).json({ error: 'Shipment not found' });
        return;
      }

      const formattedShipment = {
        ...shipment.toObject(),
        user: shipment.userId ? {
          firstName: (shipment.userId as any).firstName,
          lastName: (shipment.userId as any).lastName,
          email: (shipment.userId as any).email
        } : null,
        userId: (shipment.userId as any)?._id
      };

      res.status(200).json(formattedShipment);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching shipment' });
    }
  }

  // Update shipment details
  public async updateShipment(req: Request, res: Response): Promise<void> {
    try {
      const { status, trackingNumber, estimatedDelivery, carrier, steps } = req.body;

      const shipment = await Order.findOne({ orderId: req.params.orderId })
        .populate('userId', 'firstName lastName email');

      if (!shipment) {
        res.status(404).json({ error: 'Shipment not found' });
        return;
      }

      // Update shipping information
      shipment.shipping = {
        ...shipment.shipping,
        status,
        trackingNumber,
        estimatedDelivery,
        carrier,
        steps: steps || []  // Provide empty array as fallback
      };

      await shipment.save();

      // Send email notification based on status change
      if (shipment.userId) {
        const user = shipment.userId as any;
        await emailService.sendShippingUpdate(user.email, {
          orderId: shipment.orderId,
          trackingNumber,
          status,
          estimatedDelivery,
          userName: user.firstName
        });
      }

      const formattedShipment = {
        ...shipment.toObject(),
        user: shipment.userId ? {
          firstName: (shipment.userId as any).firstName,
          lastName: (shipment.userId as any).lastName,
          email: (shipment.userId as any).email
        } : null,
        userId: (shipment.userId as any)?._id
      };

      res.status(200).json(formattedShipment);
    } catch (error) {
      res.status(500).json({ error: 'Error updating shipment' });
    }
  }

  // Get shipping statistics
  public async getShippingStats(req: Request, res: Response): Promise<void> {
    try {
      const [
        totalShipments,
        processingShipments,
        inTransitShipments,
        deliveredShipments
      ] = await Promise.all([
        Order.countDocuments({ 'shipping.trackingNumber': { $exists: true } }),
        Order.countDocuments({ 'shipping.status': 'processing' }),
        Order.countDocuments({ 'shipping.status': 'in_transit' }),
        Order.countDocuments({ 'shipping.status': 'delivered' })
      ]);

      // Get recent shipments
      const recentShipments = await Order.find({ 
        'shipping.trackingNumber': { $exists: true } 
      })
        .populate('userId', 'firstName lastName email')
        .sort({ 'shipping.estimatedDelivery': 1 })
        .limit(5);

      res.status(200).json({
        total: totalShipments,
        byStatus: {
          processing: processingShipments,
          inTransit: inTransitShipments,
          delivered: deliveredShipments
        },
        upcomingDeliveries: recentShipments.map(shipment => ({
          ...shipment.toObject(),
          user: shipment.userId ? {
            firstName: (shipment.userId as any).firstName,
            lastName: (shipment.userId as any).lastName,
            email: (shipment.userId as any).email
          } : null,
          userId: (shipment.userId as any)?._id
        }))
      });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching shipping statistics' });
    }
  }
} 