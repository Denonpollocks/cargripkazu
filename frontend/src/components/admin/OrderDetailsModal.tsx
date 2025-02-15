import React, { useState } from 'react';
import { Order } from '../../types/interfaces';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onUpdate: (updatedOrder: Order) => Promise<void>;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    status: order.status,
    shipping: {
      ...order.shipping,
      trackingNumber: order.shipping?.trackingNumber || '',
      estimatedDelivery: order.shipping?.estimatedDelivery || '',
      status: order.shipping?.status || ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onUpdate({
        ...order,
        status: formData.status,
        shipping: {
          ...order.shipping,
          ...formData.shipping
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gold-500">
            Order Details - {order.orderId}
          </h2>
          <button
            onClick={onClose}
            className="text-gold-400 hover:text-gold-300"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Order Information */}
          <div>
            <h3 className="text-lg font-semibold text-gold-500 mb-4">Order Information</h3>
            <div className="bg-black rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gold-400">Type:</span>
                <span className="text-gold-400 capitalize">{order.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gold-400">Date:</span>
                <span className="text-gold-400">
                  {new Date(order.dateOrdered).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gold-400">Amount:</span>
                <span className="text-gold-400">{order.payment.amount}</span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold text-gold-500 mb-4">Customer Information</h3>
            <div className="bg-black rounded-lg p-4 space-y-2">
              {order.shippingAddress && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gold-400">Name:</span>
                    <span className="text-gold-400">{order.shippingAddress.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gold-400">Address:</span>
                    <span className="text-gold-400">
                      {order.shippingAddress.address}, {order.shippingAddress.city}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gold-400">Country:</span>
                    <span className="text-gold-400">{order.shippingAddress.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gold-400">Phone:</span>
                    <span className="text-gold-400">{order.shippingAddress.phone}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gold-500 mb-4">Item Details</h3>
          <div className="bg-black rounded-lg p-4">
            {Object.entries(order.details).map(([key, value]) => (
              <div key={key} className="flex justify-between mb-2">
                <span className="text-gold-400 capitalize">
                  {key.replace(/_/g, ' ')}:
                </span>
                <span className="text-gold-400">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500 text-white p-4 rounded">
              {error}
            </div>
          )}

          {/* Order Status */}
          <div>
            <label className="block text-gold-400 mb-2">Order Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-400"
            >
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          {/* Shipping Information */}
          <div>
            <h3 className="text-lg font-semibold text-gold-500 mb-4">Shipping Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gold-400 mb-2">Tracking Number</label>
                <input
                  type="text"
                  value={formData.shipping.trackingNumber}
                  onChange={(e) => setFormData({
                    ...formData,
                    shipping: {
                      ...formData.shipping,
                      trackingNumber: e.target.value
                    }
                  })}
                  className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-400"
                  placeholder="Enter tracking number"
                />
              </div>

              <div>
                <label className="block text-gold-400 mb-2">Estimated Delivery</label>
                <input
                  type="text"
                  value={formData.shipping.estimatedDelivery}
                  onChange={(e) => setFormData({
                    ...formData,
                    shipping: {
                      ...formData.shipping,
                      estimatedDelivery: e.target.value
                    }
                  })}
                  className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-400"
                  placeholder="e.g., 2024-04-15"
                />
              </div>

              <div>
                <label className="block text-gold-400 mb-2">Shipping Status</label>
                <input
                  type="text"
                  value={formData.shipping.status}
                  onChange={(e) => setFormData({
                    ...formData,
                    shipping: {
                      ...formData.shipping,
                      status: e.target.value
                    }
                  })}
                  className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-400"
                  placeholder="e.g., In Transit"
                />
              </div>
            </div>
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
              {isSubmitting ? 'Updating...' : 'Update Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderDetailsModal; 