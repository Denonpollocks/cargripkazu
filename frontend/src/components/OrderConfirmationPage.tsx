import React, { useState } from 'react';
import { Order } from '../types/interfaces';

interface OrderConfirmationPageProps {
  order: Order;
  onConfirm: (orderId: string, images: File[], feedback?: string) => void;
}

const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ order, onConfirm }) => {
  const [receiptImages, setReceiptImages] = useState<File[]>([]);
  const [feedback, setFeedback] = useState('');
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setReceiptImages(files);

      // Create preview URLs
      const urls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(order.orderId, receiptImages, feedback);
  };

  return (
    <div className="bg-zinc-900 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gold-500 mb-6">Order Confirmation</h2>

      {/* Order Details Section */}
      <div className="mb-8 border border-gold-500 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-gold-500 font-bold mb-4">Order Information</h3>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="text-gold-400 py-2">Order Number:</td>
                  <td className="text-gold-400 py-2">{order.orderId}</td>
                </tr>
                <tr>
                  <td className="text-gold-400 py-2">Order Date:</td>
                  <td className="text-gold-400 py-2">{order.dateOrdered}</td>
                </tr>
                <tr>
                  <td className="text-gold-400 py-2">Status:</td>
                  <td className="text-gold-400 py-2">{order.status}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="text-gold-500 font-bold mb-4">Shipping Information</h3>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="text-gold-400 py-2">Tracking Number:</td>
                  <td className="text-gold-400 py-2">{order.shipping?.trackingNumber || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="text-gold-400 py-2">Carrier:</td>
                  <td className="text-gold-400 py-2">Japan Post</td>
                </tr>
                <tr>
                  <td className="text-gold-400 py-2">Est. Delivery:</td>
                  <td className="text-gold-400 py-2">{order.shipping?.estimatedDelivery}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Receipt Upload Section */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border border-gold-500 rounded-lg p-4">
          <h3 className="text-gold-500 font-bold mb-4">Upload Receipt Images</h3>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full text-gold-500 mb-4 file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0 file:bg-gold-500 file:text-black
              hover:file:bg-gold-400 cursor-pointer"
          />

          {/* Image Previews */}
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Receipt ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrls(previewUrls.filter((_, i) => i !== index));
                      setReceiptImages(receiptImages.filter((_, i) => i !== index));
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Feedback Section */}
        <div className="border border-gold-500 rounded-lg p-4">
          <h3 className="text-gold-500 font-bold mb-4">Additional Feedback (Optional)</h3>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-400"
            rows={4}
            placeholder="Share your feedback about the order..."
          />
        </div>

        {/* Confirmation Button */}
        <button
          type="submit"
          disabled={receiptImages.length === 0}
          className="w-full bg-gold-500 text-black py-3 rounded-lg font-semibold hover:bg-gold-400 
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Order Receipt
        </button>
      </form>
    </div>
  );
};

export default OrderConfirmationPage; 