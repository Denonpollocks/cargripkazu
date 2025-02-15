import mongoose, { Schema, Document } from 'mongoose';

export interface IContent extends Document {
  pageId: string;
  type: 'home' | 'services' | 'guide';
  sections: {
    id: string;
    title: string;
    content: string;
    type: 'text' | 'image' | 'video';
    order: number;
    metadata?: {
      alt?: string;
      caption?: string;
      link?: string;
    };
  }[];
  lastUpdated: Date;
  updatedBy: mongoose.Types.ObjectId;
}

const ContentSchema: Schema = new Schema({
  pageId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: ['home', 'services', 'guide']
  },
  sections: [{
    id: String,
    title: String,
    content: String,
    type: {
      type: String,
      enum: ['text', 'image', 'video']
    },
    order: Number,
    metadata: {
      alt: String,
      caption: String,
      link: String
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

export default mongoose.model<IContent>('Content', ContentSchema); 