import mongoose, { Schema, Document } from 'mongoose';

export interface IQuotation extends Document {
  userId: string;
  type: 'vehicle' | 'parts';
  status: 'pending' | 'responded' | 'ordered';
  dateSubmitted: Date;
  details: {
    make_model: string;
    model: string;
    year: string;
    [key: string]: any;
  };
  response?: {
    availability: string;
    estimatedDelivery: string;
    additionalNotes: string;
    priceBreakdown: {
      itemCost: string;
      deliveryCost: string;
      tax: string;
      totalCost: string;
    };
  };
}

const QuotationSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['vehicle', 'parts'], required: true },
  status: { 
    type: String, 
    enum: ['pending', 'responded', 'ordered'], 
    default: 'pending' 
  },
  dateSubmitted: { type: Date, default: Date.now },
  details: { type: Schema.Types.Mixed, required: true },
  response: {
    availability: String,
    estimatedDelivery: String,
    additionalNotes: String,
    priceBreakdown: {
      itemCost: String,
      deliveryCost: String,
      tax: String,
      totalCost: String
    }
  }
}, {
  timestamps: true
});

export default mongoose.model<IQuotation>('Quotation', QuotationSchema); 