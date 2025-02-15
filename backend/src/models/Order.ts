import mongoose, { Schema, Document } from 'mongoose';

// Interfaces for nested objects
interface VehicleDetails {
  make_model: string;
  model: string;
  year: string;
  mileage: string;
  grade: string;
  color: string;
  budget: string;
  country: string;
  port: string;
}

interface PartsDetails {
  make_model: string;
  model: string;
  year: string;
  chassis_number: string;
  part_number: string;
  parts_description: string;
  country: string;
  port: string;
  part_image?: string;
}

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface ShippingQuote {
  method: string;
  cost: string;
  estimatedDays: string;
  status: 'pending' | 'accepted' | 'rejected';
}

// Main Order interface
export interface IOrder extends Document {
  orderId: string;
  userId: string;
  quotationId: string;
  type: 'vehicle' | 'parts';
  status: 'processing' | 'shipped' | 'delivered';
  dateOrdered: Date;
  details: VehicleDetails | PartsDetails;
  payment: {
    amount: string;
    receiptUrl: string;
    dateSubmitted: Date;
    status: 'pending' | 'completed' | 'failed';
  };
  shipping?: {
    trackingNumber?: string;
    estimatedDelivery: Date;
    status: string;
    carrier: string;
    steps: Array<{
      status: string;
      date: Date;
      location: string;
      description: string;
    }>;
  };
  shippingAddress?: ShippingAddress;
  shippingQuote?: ShippingQuote;
  deliveryConfirmation?: {
    images: string[];
    confirmedAt: Date;
    feedback?: string;
  };
}

const OrderSchema: Schema = new Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  quotationId: { type: String, required: true },
  type: { type: String, enum: ['vehicle', 'parts'], required: true },
  status: { 
    type: String, 
    enum: ['processing', 'shipped', 'delivered'], 
    default: 'processing' 
  },
  dateOrdered: { type: Date, default: Date.now },
  details: { type: Schema.Types.Mixed, required: true },
  payment: {
    amount: { type: String, required: true },
    receiptUrl: { type: String, required: true },
    dateSubmitted: { type: Date, default: Date.now },
    status: { 
      type: String, 
      enum: ['pending', 'completed', 'failed'], 
      default: 'pending' 
    }
  },
  shipping: {
    trackingNumber: String,
    estimatedDelivery: Date,
    status: String,
    carrier: String,
    steps: [{
      status: String,
      date: Date,
      location: String,
      description: String
    }]
  },
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String
  },
  shippingQuote: {
    method: String,
    cost: String,
    estimatedDays: String,
    status: { 
      type: String, 
      enum: ['pending', 'accepted', 'rejected'], 
      default: 'pending' 
    }
  },
  deliveryConfirmation: {
    images: [String],
    confirmedAt: Date,
    feedback: String
  }
}, {
  timestamps: true
});

export default mongoose.model<IOrder>('Order', OrderSchema); 