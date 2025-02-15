import React, { useState, useEffect } from 'react';
import { Quotation } from '../../types/interfaces';

interface QuotationResponseModalProps {
  quotation: Quotation;
  onClose: () => void;
  onSubmit: (response: {
    availability: string;
    estimatedDelivery: string;
    additionalNotes: string;
    priceBreakdown: {
      itemCost: string;
      deliveryCost: string;
      tax: string;
      totalCost: string;
    };
  }) => Promise<void>;
}

const QuotationResponseModal: React.FC<QuotationResponseModalProps> = ({
  quotation,
  onClose,
  onSubmit
}) => {
  // State for form data
  const [formData, setFormData] = useState({
    availability: quotation.response?.availability || '',
    estimatedDelivery: quotation.response?.estimatedDelivery || '',
    additionalNotes: quotation.response?.additionalNotes || '',
    priceBreakdown: {
      itemCost: quotation.response?.priceBreakdown.itemCost || '',
      deliveryCost: quotation.response?.priceBreakdown.deliveryCost || '',
      tax: quotation.response?.priceBreakdown.tax || '',
      totalCost: quotation.response?.priceBreakdown.totalCost || ''
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate total cost when price components change
  useEffect(() => {
    const itemCost = parseFloat(formData.priceBreakdown.itemCost.replace(/[^0-9.-]+/g, '')) || 0;
    const deliveryCost = parseFloat(formData.priceBreakdown.deliveryCost.replace(/[^0-9.-]+/g, '')) || 0;
    const tax = parseFloat(formData.priceBreakdown.tax.replace(/[^0-9.-]+/g, '')) || 0;
    
    const total = itemCost + deliveryCost + tax;
    
    setFormData(prev => ({
      ...prev,
      priceBreakdown: {
        ...prev.priceBreakdown,
        totalCost: total.toLocaleString('ja-JP') + ' JPY'
      }
    }));
  }, [
    formData.priceBreakdown.itemCost,
    formData.priceBreakdown.deliveryCost,
    formData.priceBreakdown.tax
  ]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gold-500">
            {quotation.type === 'vehicle' ? 'Vehicle Quotation' : 'Parts Quotation'}
          </h2>
          <button
            onClick={onClose}
            className="text-gold-400 hover:text-gold-300"
          >
            ✕
          </button>
        </div>

        {/* Quotation Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gold-500 mb-2">Request Details</h3>
          <div className="bg-black rounded-lg p-4">
            {Object.entries(quotation.details).map(([key, value]) => (
              <div key={key} className="flex justify-between mb-2">
                <span className="text-gold-400 capitalize">
                  {key.replace(/_/g, ' ')}:
                </span>
                <span className="text-gold-400">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Response Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500 text-white p-4 rounded">
              {error}
            </div>
          )}

          {/* Availability */}
          <div>
            <label className="block text-gold-400 mb-2">Availability</label>
            <select
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-400"
              required
            >
              <option value="">Select availability</option>
              <option value="Available">Available</option>
              <option value="Limited Stock">Limited Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Need to Order">Need to Order</option>
            </select>
          </div>

          {/* Estimated Delivery */}
          <div>
            <label className="block text-gold-400 mb-2">Estimated Delivery</label>
            <input
              type="text"
              value={formData.estimatedDelivery}
              onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
              className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-400"
              placeholder="e.g., 2-3 weeks"
              required
            />
          </div>

          {/* Price Breakdown */}
          <div>
            <h3 className="text-lg font-semibold text-gold-500 mb-4">Price Breakdown</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gold-400 mb-2">Item Cost (JPY)</label>
                <input
                  type="text"
                  value={formData.priceBreakdown.itemCost}
                  onChange={(e) => setFormData({
                    ...formData,
                    priceBreakdown: {
                      ...formData.priceBreakdown,
                      itemCost: e.target.value
                    }
                  })}
                  className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-400"
                  placeholder="e.g., 1,000,000"
                  required
                />
              </div>

              <div>
                <label className="block text-gold-400 mb-2">Delivery Cost (JPY)</label>
                <input
                  type="text"
                  value={formData.priceBreakdown.deliveryCost}
                  onChange={(e) => setFormData({
                    ...formData,
                    priceBreakdown: {
                      ...formData.priceBreakdown,
                      deliveryCost: e.target.value
                    }
                  })}
                  className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-400"
                  placeholder="e.g., 50,000"
                  required
                />
              </div>

              <div>
                <label className="block text-gold-400 mb-2">Tax (JPY)</label>
                <input
                  type="text"
                  value={formData.priceBreakdown.tax}
                  onChange={(e) => setFormData({
                    ...formData,
                    priceBreakdown: {
                      ...formData.priceBreakdown,
                      tax: e.target.value
                    }
                  })}
                  className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-400"
                  placeholder="e.g., 105,000"
                  required
                />
              </div>

              <div>
                <label className="block text-gold-400 mb-2">Total Cost (JPY)</label>
                <input
                  type="text"
                  value={formData.priceBreakdown.totalCost}
                  className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-400"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-gold-400 mb-2">Additional Notes</label>
            <textarea
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-400"
              rows={4}
              placeholder="Enter any additional information or notes..."
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
              {isSubmitting ? 'Submitting...' : 'Submit Response'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuotationResponseModal; 