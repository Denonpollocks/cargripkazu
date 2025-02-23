import { Request, Response } from 'express';
import Quotation from '../models/Quotation';
import { uploadToS3 } from '../utils/s3';
import { ApiError } from '../middleware/errorMiddleware';
import { emailService } from '../services/EmailService';
import User from '../models/User';

export class QuotationController {
  // Create new quotation
  public createQuotation = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ 
          success: false,
          message: 'User ID not found' 
        });
        return;
      }

      const { type, details } = req.body;
      let parsedDetails;
      
      try {
        parsedDetails = typeof details === 'string' ? JSON.parse(details) : details;
      } catch (error) {
        res.status(400).json({
          success: false,
          message: 'Invalid details format'
        });
        return;
      }

      // Handle part image upload if present
      if (type === 'parts' && req.file) {
        try {
          const imageUrl = await uploadToS3(req.file);
          parsedDetails.part_image = imageUrl;
        } catch (uploadError) {
          console.error('S3 upload error:', uploadError);
          res.status(500).json({
            success: false,
            message: 'Error uploading image'
          });
          return;
        }
      }

      const quotation = await Quotation.create({
        userId,
        type,
        details: parsedDetails,
        status: 'pending',
        dateSubmitted: new Date()
      });

      res.status(201).json({
        success: true,
        data: quotation
      });
    } catch (error) {
      console.error('Error creating quotation:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error creating quotation'
      });
    }
  };

  // Get user's quotations
  public async getUserQuotations(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'User ID not found' });
        return;
      }

      const quotations = await Quotation.find({ userId })
        .populate('userId', 'firstName lastName email')
        .sort({ dateSubmitted: -1 });

      res.status(200).json(quotations);
    } catch (error) {
      console.error('Error fetching quotations:', error);
      res.status(500).json({ error: 'Error fetching quotations' });
    }
  }

  // Get single quotation details
  public async getQuotationDetails(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'User ID not found' });
        return;
      }

      const quotation = await Quotation.findOne({
        _id: req.params.quotationId,
        userId
      });

      if (!quotation) {
        res.status(404).json({ error: 'Quotation not found' });
        return;
      }

      res.status(200).json(quotation);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching quotation details' });
    }
  }

  // Update quotation response (admin)
  public async updateQuotationResponse(req: Request, res: Response): Promise<void> {
    try {
      const quotationId = req.params.quotationId;
      const response = req.body;

      const quotation = await Quotation.findById(quotationId)
        .populate('userId', 'firstName lastName email');

      if (!quotation) {
        res.status(404).json({ error: 'Quotation not found' });
        return;
      }

      // Update quotation with response
      quotation.response = response;
      quotation.status = 'responded';
      await quotation.save();

      // Send email notification to user
      const user = quotation.userId as any;
      await emailService.sendEmail(
        user.email,
        'Quotation Response Available',
        'quotation-response',
        {
          userName: user.firstName,
          quotationId: quotation._id?.toString(),
          type: quotation.type,
          response: response
        }
      );

      res.status(200).json(quotation);
    } catch (error) {
      console.error('Error updating quotation response:', error);
      res.status(500).json({ error: 'Error updating quotation response' });
    }
  }

  // Accept quotation and create order
  public async acceptQuotation(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'User ID not found' });
        return;
      }

      const quotation = await Quotation.findOne({
        _id: req.params.quotationId,
        userId,
        status: 'responded'
      });

      if (!quotation) {
        res.status(404).json({ error: 'Quotation not found or not in responded state' });
        return;
      }

      // Update quotation status
      quotation.status = 'ordered';
      await quotation.save();

      // Create order (this will be implemented in OrderController)
      // const order = await orderController.createOrderFromQuotation(quotation);

      res.status(200).json({
        message: 'Quotation accepted',
        quotation
        // order
      });
    } catch (error) {
      res.status(500).json({ error: 'Error accepting quotation' });
    }
  }

  // Cancel quotation
  public async cancelQuotation(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'User ID not found' });
        return;
      }

      const quotation = await Quotation.findOneAndDelete({
        _id: req.params.quotationId,
        userId,
        status: 'pending' // Can only cancel pending quotations
      });

      if (!quotation) {
        res.status(404).json({ error: 'Quotation not found or cannot be cancelled' });
        return;
      }

      res.status(200).json({ message: 'Quotation cancelled successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error cancelling quotation' });
    }
  }

  // Get quotation statistics (admin only)
  public async getQuotationStats(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Add admin check middleware
      const stats = await Quotation.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const typeStats = await Quotation.aggregate([
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 }
          }
        }
      ]);

      res.status(200).json({
        statusStats: stats,
        typeStats
      });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching quotation statistics' });
    }
  }

  public createGuestQuotation = async (req: Request, res: Response) => {
    try {
      const quotationData = {
        ...req.body,
        image: req.file?.filename,
        isGuest: true
      };

      const quotation = await Quotation.create(quotationData);
      
      res.status(201).json({
        success: true,
        data: quotation
      });
    } catch (error: any) {
      console.error('Error creating guest quotation:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating guest quotation',
        error: error.message
      });
    }
  };
} 