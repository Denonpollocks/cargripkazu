// Interface for vehicle quotation/order details
export interface VehicleDetails {
  make_model: string;    // Vehicle make and model (e.g., "Toyota Supra")
  model: string;         // Specific model variant
  year: string;          // Manufacturing year
  mileage: string;       // Vehicle mileage
  grade: string;         // Vehicle grade/condition
  color: string;         // Vehicle color
  budget: string;        // Customer's budget
  country: string;       // Destination country
  port: string;          // Destination port
}

// Interface for parts quotation/order details
export interface PartsDetails {
  make_model: string;         // Vehicle make and model for parts
  model: string;              // Specific model variant
  year: string;              // Vehicle year for parts
  chassis_number: string;     // Vehicle chassis number
  part_number: string;        // Specific part number if known
  parts_description: string;  // Description of required parts
  country: string;           // Destination country
  port: string;              // Destination port
  part_image?: string;       // Optional image of the part
}

// Interface for customer shipping address details
export interface ShippingAddress {
  fullName: string;      // Customer's full name
  address: string;       // Street address
  city: string;          // City
  state: string;         // State/Province
  postalCode: string;    // Postal/ZIP code
  country: string;       // Country
  phone: string;         // Contact phone number
}

// Interface for shipping quotation details
export interface ShippingQuote {
  method: string;        // Shipping method (e.g., "Standard", "Express")
  cost: string;          // Shipping cost
  estimatedDays: string; // Estimated delivery time
  status: 'pending' | 'accepted' | 'rejected';  // Quote status
}

// Main interface for customer orders
export interface Order {
  orderId: string;       // Unique order identifier
  quotationId: string;   // Reference to original quotation
  type: 'vehicle' | 'parts';  // Order type
  status: 'processing' | 'shipped' | 'delivered';  // Current order status
  dateOrdered: string;   // Order date
  details: VehicleDetails | PartsDetails;  // Order details based on type

  // Payment information
  payment: {
    amount: string;          // Total payment amount
    receiptUrl: string;      // URL to payment receipt
    dateSubmitted: string;   // Payment date
  };

  // Shipping information
  shipping?: {
    trackingNumber?: string;
    estimatedDelivery: string;
    status: string;
    carrier?: string;
    notes?: string;
    steps?: Array<{
      status: string;
      date: Date;
      location: string;
      description: string;
    }>;
  };

  shippingAddress?: ShippingAddress;  // Customer's shipping address
  shippingQuote?: ShippingQuote;      // Shipping quote details

  // Delivery confirmation details
  deliveryConfirmation?: {
    images: string[];           // Delivery confirmation images
    confirmedAt: string;        // Confirmation timestamp
    feedback?: string;          // Optional customer feedback
  };
}

export interface PriceBreakdown {
  itemCost: string;
  deliveryCost: string;
  tax: string;
  totalCost: string;
}

export interface Quotation {
  id: string;
  type: 'vehicle' | 'parts';
  status: 'pending' | 'responded' | 'ordered';
  dateSubmitted: string;
  details: VehicleDetails | PartsDetails;
  response?: {
    availability: string;
    estimatedDelivery: string;
    additionalNotes: string;
    priceBreakdown: PriceBreakdown;
  };
  userId?: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

// Interface for website content sections
export interface ContentSection {
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
}

// Interface for page content
export interface PageContent {
  pageId: string;
  type: 'home' | 'services' | 'guide';
  sections: ContentSection[];
  lastUpdated: string;
  updatedBy: string;
} 