import React, { useState } from 'react';
import { Order } from '../../types/interfaces';

interface ShippingDetailsModalProps {
  shipment: Order;
  onClose: () => void;
  onUpdate: (updatedShipping: {
    status: string;
    trackingNumber: string;
    estimatedDelivery: string;
    carrier?: string;
    notes?: string;
  }) => Promise<void>;
}

const ShippingDetailsModal: React.FC<ShippingDetailsModalProps> = ({
  shipment,
  onClose,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    status: shipment.shipping?.status || 'processing',
    trackingNumber: shipment.shipping?.trackingNumber || '',
    estimatedDelivery: shipment.shipping?.estimatedDelivery || '',
    carrier: shipment.shipping?.carrier || '',
    notes: shipment.shipping?.notes || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onUpdate(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gold-500">
            Update Shipping Details
          </h2>
          <button
            onClick={onClose}
            className="text-gold-400 hover:text-gold-300"
          >
            ✕
          </button>
        </div>

        {/* Order Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gold-500 mb-4">Order Information</h3>
          <div className="bg-black rounded-lg p-4 grid grid-cols-2 gap-4">
            <div>
              <span className="text-gold-400">Order ID:</span>
              <span className="text-gold-400 ml-2">{shipment.orderId}</span>
            </div>
            <div>
              <span className="text-gold-400">Customer:</span>
              <span className="text-gold-400 ml-2">{shipment.shippingAddress?.fullName}</span>
            </div>
            <div>
              <span className="text-gold-400">Destination:</span>
              <span className="text-gold-400 ml-2">
                {shipment.shippingAddress?.city}, {shipment.shippingAddress?.country}
              </span>
            </div>
            <div>
              <span className="text-gold-400">Phone:</span>
              <span className="text-gold-400 ml-2">{shipment.shippingAddress?.phone}</span>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500 text-white p-4 rounded">
              {error}
            </div>
          )}

          {/* Shipping Status */}
          <div>
            <label className="block text-gold-400 mb-2">Shipping Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-400"
            >
              <option value="processing">Processing</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          {/* Tracking Number */}
          <div>
            <label className="block text-gold-400 mb-2">Tracking Number</label>
            <input
              type="text"
              value={formData.trackingNumber}
              onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
              className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-400"
              placeholder="Enter tracking number"
            />
          </div>

          {/* Carrier */}
          <div>
            <label className="block text-gold-400 mb-2">Shipping Carrier</label>
            <input
              type="text"
              value={formData.carrier}
              onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
              className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-400"
              placeholder="e.g., DHL, FedEx"
            />
          </div>

          {/* Estimated Delivery */}
          <div>
            <label className="block text-gold-400 mb-2">Estimated Delivery Date</label>
            <input
              type="date"
              value={formData.estimatedDelivery.split('T')[0]}
              onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
              className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-400"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-gold-400 mb-2">Shipping Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-400"
              rows={3}
              placeholder="Add any additional notes about the shipment..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gold-500 hover:text-gold-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-gold-500 text-black rounded hover:bg-gold-400 disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Update Shipping'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShippingDetailsModal; 