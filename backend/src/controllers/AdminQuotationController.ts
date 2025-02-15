import { Request, Response } from 'express';
import Quotation from '../models/Quotation';
import User from '../models/User';
import { emailService } from '../services/EmailService';

export class AdminQuotationController {
  // Get all quotations with user details
  public async getAllQuotations(req: Request, res: Response): Promise<void> {
    try {
      const quotations = await Quotation.find()
        .populate('userId', 'firstName lastName email')
        .sort({ dateSubmitted: -1 });

      const formattedQuotations = quotations.map(quotation => ({
        ...quotation.toObject(),
        user: quotation.userId ? {
          firstName: (quotation.userId as any).firstName,
          lastName: (quotation.userId as any).lastName,
          email: (quotation.userId as any).email
        } : null,
        userId: (quotation.userId as any)?._id
      }));

      res.status(200).json(formattedQuotations);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching quotations' });
    }
  }

  // Get single quotation by ID
  public async getQuotationById(req: Request, res: Response): Promise<void> {
    try {
      const quotation = await Quotation.findById(req.params.quotationId)
        .populate('userId', 'firstName lastName email');

      if (!quotation) {
        res.status(404).json({ error: 'Quotation not found' });
        return;
      }

      const formattedQuotation = {
        ...quotation.toObject(),
        user: quotation.userId ? {
          firstName: (quotation.userId as any).firstName,
          lastName: (quotation.userId as any).lastName,
          email: (quotation.userId as any).email
        } : null,
        userId: (quotation.userId as any)?._id
      };

      res.status(200).json(formattedQuotation);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching quotation' });
    }
  }

  // Respond to quotation
  public async respondToQuotation(req: Request, res: Response): Promise<void> {
    try {
      const { availability, estimatedDelivery, additionalNotes, priceBreakdown } = req.body;

      const quotation = await Quotation.findById(req.params.quotationId)
        .populate('userId', 'firstName lastName email');

      if (!quotation) {
        res.status(404).json({ error: 'Quotation not found' });
        return;
      }

      // Update quotation with response
      quotation.status = 'responded';
      quotation.response = {
        availability,
        estimatedDelivery,
        additionalNotes,
        priceBreakdown
      };

      await quotation.save();

      // Send email notification to user
      if (quotation.userId) {
        const user = quotation.userId as any;
        await emailService.sendQuotationResponse(user.email, {
          quotationId: quotation._id as any,
          type: quotation.type,
          response: quotation.response,
          userName: user.firstName
        });
      }

      // Format response
      const formattedQuotation = {
        ...quotation.toObject(),
        user: quotation.userId ? {
          firstName: (quotation.userId as any).firstName,
          lastName: (quotation.userId as any).lastName,
          email: (quotation.userId as any).email
        } : null,
        userId: (quotation.userId as any)?._id
      };

      res.status(200).json(formattedQuotation);
    } catch (error) {
      res.status(500).json({ error: 'Error responding to quotation' });
    }
  }

  // Get quotation statistics
  public async getQuotationStats(req: Request, res: Response): Promise<void> {
    try {
      const [
        totalQuotations,
        pendingQuotations,
        respondedQuotations,
        orderedQuotations,
        vehicleQuotations,
        partsQuotations
      ] = await Promise.all([
        Quotation.countDocuments(),
        Quotation.countDocuments({ status: 'pending' }),
        Quotation.countDocuments({ status: 'responded' }),
        Quotation.countDocuments({ status: 'ordered' }),
        Quotation.countDocuments({ type: 'vehicle' }),
        Quotation.countDocuments({ type: 'parts' })
      ]);

      // Get recent quotations
      const recentQuotations = await Quotation.find()
        .populate('userId', 'firstName lastName email')
        .sort({ dateSubmitted: -1 })
        .limit(5);

      res.status(200).json({
        total: totalQuotations,
        byStatus: {
          pending: pendingQuotations,
          responded: respondedQuotations,
          ordered: orderedQuotations
        },
        byType: {
          vehicle: vehicleQuotations,
          parts: partsQuotations
        },
        recentQuotations: recentQuotations.map(q => ({
          ...q.toObject(),
          user: q.userId ? {
            firstName: (q.userId as any).firstName,
            lastName: (q.userId as any).lastName,
            email: (q.userId as any).email
          } : null,
          userId: (q.userId as any)?._id
        }))
      });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching quotation statistics' });
    }
  }
} 