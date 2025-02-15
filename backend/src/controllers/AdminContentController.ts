import { Request, Response } from 'express';
import Content from '../models/Content';
import { uploadToS3 } from '../utils/s3Utils';
import { Types } from 'mongoose';

export class AdminContentController {
  // Get page content
  public async getPageContent(req: Request, res: Response): Promise<void> {
    try {
      const { pageType } = req.params;

      const content = await Content.findOne({ type: pageType })
        .populate('updatedBy', 'firstName lastName');

      if (!content) {
        // Create default content if none exists
        const newContent = new Content({
          pageId: `${pageType}-${Date.now()}`,
          type: pageType,
          sections: [],
          updatedBy: req.user?.id
        });
        await newContent.save();
        res.status(200).json(newContent);
        return;
      }

      res.status(200).json(content);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching page content' });
    }
  }

  // Update page content
  public async updatePageContent(req: Request, res: Response): Promise<void> {
    try {
      const { pageType } = req.params;
      const { sections } = req.body;

      const content = await Content.findOne({ type: pageType });

      if (!content) {
        res.status(404).json({ error: 'Page content not found' });
        return;
      }

      content.sections = sections;
      content.lastUpdated = new Date();
      content.updatedBy = req.user?.id ? new Types.ObjectId(req.user.id) : content.updatedBy;

      await content.save();

      const updatedContent = await content.populate('updatedBy', 'firstName lastName');
      res.status(200).json(updatedContent);
    } catch (error) {
      res.status(500).json({ error: 'Error updating page content' });
    }
  }

  // Upload media (images/videos)
  public async uploadMedia(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const url = await uploadToS3(req.file, 'content');

      res.status(200).json({ url });
    } catch (error) {
      res.status(500).json({ error: 'Error uploading media' });
    }
  }
} 