import React from 'react';
import { Order } from '../types/interfaces';

interface TrackingStep {
  status: string;
  date: string;
  location: string;
  description: string;
  completed: boolean;
}

interface TrackingInfo {
  orderId: string;
  trackingNumber: string;
  carrier: string;
  currentStatus: string;
  estimatedDelivery: string;
  steps: TrackingStep[];
}

interface TrackingPageProps {
  order: Order;
}

const TrackingPage: React.FC<TrackingPageProps> = ({ order }) => {
  // Mock tracking data - replace with actual API calls
  const [trackingInfo, setTrackingInfo] = React.useState<TrackingInfo[]>([
    {
      orderId: "ORD-123456",
      trackingNumber: "JP123456789",
      carrier: "Japan Post",
      currentStatus: "In Transit",
      estimatedDelivery: "2024-04-15",
      steps: [
        {
          status: "Order Processed",
          date: "2024-03-20",
          location: "Tokyo, Japan",
          description: "Order has been processed and is ready for shipment",
          completed: true
        },
        {
          status: "Picked Up",
          date: "2024-03-21",
          location: "Tokyo, Japan",
          description: "Package has been picked up by carrier",
          completed: true
        },
        {
          status: "In Transit",
          date: "2024-03-22",
          location: "Narita, Japan",
          description: "Package is in transit to destination",
          completed: true
        },
        {
          status: "Customs Clearance",
          date: "Pending",
          location: "Sydney, Australia",
          description: "Package awaiting customs clearance",
          completed: false
        },
        {
          status: "Out for Delivery",
          date: "Pending",
          location: "Sydney, Australia",
          description: "Package out for delivery",
          completed: false
        },
        {
          status: "Delivered",
          date: "Pending",
          location: "Sydney, Australia",
          description: "Package has been delivered",
          completed: false
        }
      ]
    }
  ]);

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-gold-500 mb-6">Track Shipments</h2>
      
      {trackingInfo.map((tracking) => (
        <div key={tracking.trackingNumber} className="border border-gold-500 rounded-lg p-6">
          {/* Tracking Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-gold-500">Order #{tracking.orderId}</h3>
              <p className="text-gold-400">Tracking Number: {tracking.trackingNumber}</p>
              <p className="text-gold-400">Carrier: {tracking.carrier}</p>
            </div>
            <div className="text-right">
              <p className="text-gold-500 font-bold">{tracking.currentStatus}</p>
              <p className="text-gold-400">Est. Delivery: {tracking.estimatedDelivery}</p>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="relative">
            {tracking.steps.map((step, index) => (
              <div key={index} className="mb-8 flex">
                {/* Status Indicator */}
                <div className="flex flex-col items-center mr-4">
                  <div className={`w-4 h-4 rounded-full ${
                    step.completed ? 'bg-gold-500' : 'bg-zinc-700'
                  }`}></div>
                  {index < tracking.steps.length - 1 && (
                    <div className={`w-0.5 h-full ${
                      step.completed ? 'bg-gold-500' : 'bg-zinc-700'
                    }`}></div>
                  )}
                </div>

                {/* Status Details */}
                <div className="flex-1">
                  <div className="mb-2">
                    <h4 className="text-gold-500 font-bold">{step.status}</h4>
                    <p className="text-gold-400">{step.date}</p>
                  </div>
                  <div className="bg-zinc-900 rounded p-4">
                    <p className="text-gold-400 mb-1">{step.location}</p>
                    <p className="text-gold-400 text-sm">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackingPage; 