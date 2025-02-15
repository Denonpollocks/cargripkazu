import React from 'react';
import { Order, ShippingAddress, ShippingQuote } from '../types/interfaces';

// Props interface for ShippingSection component
interface ShippingSectionProps {
  order: Order;                 // Current order being processed
  shippingModal: {             // Modal state for shipping details
    isOpen: boolean;           // Modal visibility
    orderId: string;           // Current order ID
    step: 'address' | 'quote' | 'confirmation';  // Current step in shipping process
  };
  shippingAddress: ShippingAddress;    // Customer's shipping address
  deliveryImages: File[];              // Delivery confirmation images
  onShippingModalChange: (modal: { 
    isOpen: boolean; 
    orderId: string; 
    step: 'address' | 'quote' | 'confirmation' 
  }) => void;    // Handle modal state changes
  onShippingAddressChange: (address: ShippingAddress) => void;  // Handle address updates
  onDeliveryImagesChange: (images: File[]) => void;  // Handle image uploads
  onShippingSubmit: (orderId: string) => void;       // Handle shipping details submission
  onDeliveryConfirmation: (orderId: string) => void; // Handle delivery confirmation
}

const ShippingSection: React.FC<ShippingSectionProps> = ({
  order,
  shippingModal,
  shippingAddress,
  deliveryImages,
  onShippingModalChange,
  onShippingAddressChange,
  onDeliveryImagesChange,
  onShippingSubmit,
  onDeliveryConfirmation
}) => {
  // Render appropriate actions based on order status
  const renderOrderActions = (order: Order) => {
    // Show shipping details button for processing orders
    if (order.status === 'processing' && !order.shippingAddress) {
      return (
        <button
          onClick={() => onShippingModalChange({ isOpen: true, orderId: order.orderId, step: 'address' })}
          className="px-4 py-2 bg-gold-500 text-black rounded hover:bg-gold-400"
        >
          Enter Shipping Details
        </button>
      );
    }

    // Show delivery confirmation for shipped orders
    if (order.status === 'shipped' && !order.deliveryConfirmation) {
      return (
        <div className="space-y-4">
          <div className="border border-gold-500 rounded-lg p-4">
            <h4 className="text-gold-500 mb-2">Confirm Delivery</h4>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  onDeliveryImagesChange(Array.from(e.target.files));
                }
              }}
              className="w-full text-gold-500 mb-4"
            />
            <button
              onClick={() => onDeliveryConfirmation(order.orderId)}
              className="px-4 py-2 bg-gold-500 text-black rounded hover:bg-gold-400"
            >
              Confirm Receipt
            </button>
          </div>
          <div className="border border-gold-500 rounded-lg p-4">
            <h4 className="text-gold-500 mb-2">Track Shipment</h4>
            {order.shipping?.trackingNumber && (
              <a
                href={`#tracking-link-${order.shipping.trackingNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-400 hover:text-gold-300 underline"
              >
                Track Package
              </a>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {/* Order Actions Section */}
      <div className="mt-4">
        {renderOrderActions(order)}
      </div>

      {/* Shipping Details Modal */}
      {shippingModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-zinc-900 p-8 rounded-lg max-w-md w-full mx-4">
            {shippingModal.step === 'address' ? (
              <>
                <h2 className="text-2xl font-bold text-gold-500 mb-6">Enter Shipping Details</h2>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  onShippingSubmit(shippingModal.orderId);
                }} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={shippingAddress.fullName}
                    onChange={(e) => onShippingAddressChange({ ...shippingAddress, fullName: e.target.value })}
                    className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={shippingAddress.address}
                    onChange={(e) => onShippingAddressChange({ ...shippingAddress, address: e.target.value })}
                    className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={shippingAddress.city}
                    onChange={(e) => onShippingAddressChange({ ...shippingAddress, city: e.target.value })}
                    className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="State/Province"
                    value={shippingAddress.state}
                    onChange={(e) => onShippingAddressChange({ ...shippingAddress, state: e.target.value })}
                    className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={shippingAddress.postalCode}
                    onChange={(e) => onShippingAddressChange({ ...shippingAddress, postalCode: e.target.value })}
                    className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={shippingAddress.country}
                    onChange={(e) => onShippingAddressChange({ ...shippingAddress, country: e.target.value })}
                    className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={shippingAddress.phone}
                    onChange={(e) => onShippingAddressChange({ ...shippingAddress, phone: e.target.value })}
                    className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-gold-500 text-black py-2 rounded hover:bg-gold-400"
                  >
                    Submit
                  </button>
                </form>
              </>
            ) : shippingModal.step === 'quote' ? (
              <>
                <h2 className="text-2xl font-bold text-gold-500 mb-6">Shipping Quote</h2>
                <div className="space-y-4">
                  <div className="border border-gold-500 rounded p-4">
                    <h3 className="text-gold-500 mb-2">Standard Shipping</h3>
                    <p className="text-gold-400">Cost: ¥50,000</p>
                    <p className="text-gold-400">Estimated Days: 30-45</p>
                    <button
                      onClick={() => {
                        onShippingModalChange({ isOpen: false, orderId: '', step: 'address' });
                      }}
                      className="mt-4 w-full bg-gold-500 text-black py-2 rounded hover:bg-gold-400"
                    >
                      Accept Quote
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default ShippingSection; 