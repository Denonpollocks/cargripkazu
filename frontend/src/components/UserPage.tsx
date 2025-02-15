import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ShippingSection from './ShippingSection';
import { Order, ShippingAddress, ShippingQuote, VehicleDetails, PartsDetails, Quotation } from '../types/interfaces';
import TrackingPage from './TrackingPage';
import OrderConfirmationPage from './OrderConfirmationPage';
import { useAuth } from '../contexts/AuthContext';

interface PaymentModal {
  quotationId: string;
  isOpen: boolean;
  totalAmount: string;
}

const UserPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'quotations' | 'orders' | 'profile' | 'shipping'>('profile');

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-gold-400 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Please sign in to view your profile.</p>
          <Link to="/signin" className="text-gold-500 hover:text-gold-300 underline">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Mock data - replace with actual API calls
  const [quotations, setQuotations] = useState<Quotation[]>([
    {
      id: '1',
      type: 'vehicle',
      status: 'responded',
      dateSubmitted: '2024-03-15',
      details: {
        make_model: 'Toyota Supra',
        model: 'GR Supra',
        year: '2020',
        mileage: '50,000 km',
        grade: 'Premium',
        color: 'White',
        budget: '5,000,000 JPY',
        country: 'Australia',
        port: 'Sydney'
      } as VehicleDetails,
      response: {
        availability: 'Available',
        estimatedDelivery: '3 months',
        additionalNotes: 'Vehicle available in white or black color.',
        priceBreakdown: {
          itemCost: '4,300,000 JPY',
          deliveryCost: '350,000 JPY',
          tax: '150,000 JPY',
          totalCost: '4,800,000 JPY'
        }
      }
    },
    {
      id: '2',
      type: 'parts',
      status: 'pending',
      dateSubmitted: '2024-03-18',
      details: {
        make_model: 'Nissan Skyline',
        model: 'GT-R',
        year: '1999',
        chassis_number: 'BNR34-123456',
        part_number: 'NS-123456',
        parts_description: 'Front bumper, original Nissan part',
        country: 'United States',
        port: 'Los Angeles',
        part_image: 'skyline_bumper.jpg'
      } as PartsDetails
    }
  ]);

  // Add new states for payment modal and receipt
  const [paymentModal, setPaymentModal] = useState<PaymentModal>({
    quotationId: '',
    isOpen: false,
    totalAmount: ''
  });
  const [receipt, setReceipt] = useState<File | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // Add orders state
  const [orders, setOrders] = useState<Order[]>([]);

  // Add shipping modal
  const [shippingModal, setShippingModal] = useState<{
    isOpen: boolean;
    orderId: string;
    step: 'address' | 'quote' | 'confirmation';
  }>({
    isOpen: false,
    orderId: '',
    step: 'address'
  });

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: ''
  });

  const [deliveryImages, setDeliveryImages] = useState<File[]>([]);

  // Handle opening payment modal
  const handlePlaceOrder = (quotationId: string, totalAmount: string) => {
    setPaymentModal({
      quotationId,
      isOpen: true,
      totalAmount
    });
  };

  // Handle receipt upload
  const handleReceiptUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setReceipt(event.target.files[0]);
    }
  };

  // Update handlePaymentSubmission to create new order
  const handlePaymentSubmission = () => {
    if (!receipt) {
      alert('Please upload your payment receipt');
      return;
    }

    // Find the quotation being ordered
    const quotation = quotations.find(q => q.id === paymentModal.quotationId);
    if (!quotation) return;

    // Create new order
    const newOrder: Order = {
      orderId: `ORD-${Date.now()}`, // Generate unique order ID
      quotationId: quotation.id,
      type: quotation.type,
      status: 'processing',
      dateOrdered: new Date().toISOString().split('T')[0],
      details: quotation.details,
      payment: {
        amount: paymentModal.totalAmount,
        receiptUrl: URL.createObjectURL(receipt), // In real app, this would be a server URL
        dateSubmitted: new Date().toISOString().split('T')[0]
      },
      shipping: {
        estimatedDelivery: quotation.response?.estimatedDelivery || 'TBD',
        status: 'Processing'
      }
    };

    // Add new order to orders list
    setOrders([newOrder, ...orders]);

    // Update quotation status
    setQuotations(quotations.map(q => 
      q.id === paymentModal.quotationId 
        ? { ...q, status: 'ordered' as const }
        : q
    ));

    setPaymentConfirmed(true);

    // Reset states
    setTimeout(() => {
      setPaymentModal({ quotationId: '', isOpen: false, totalAmount: '' });
      setReceipt(null);
      setPaymentConfirmed(false);
    }, 2000);
  };

  // Handle shipping address submission
  const handleShippingSubmit = (orderId: string) => {
    // In real app, send to backend
    setOrders(orders.map(order => 
      order.orderId === orderId 
        ? { 
            ...order, 
            shippingAddress: shippingAddress,
            shippingQuote: {
              method: 'Standard Shipping',
              cost: '¥50,000',
              estimatedDays: '30-45',
              status: 'pending'
            }
          }
        : order
    ));
    setShippingModal(prev => ({ ...prev, step: 'quote' }));
  };

  // Handle delivery confirmation
  const handleDeliveryConfirmation = (orderId: string) => {
    if (deliveryImages.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    // In real app, upload images to server
    const imageUrls = deliveryImages.map(file => URL.createObjectURL(file));

    setOrders(orders.map(order => 
      order.orderId === orderId 
        ? {
            ...order,
            status: 'delivered' as const,
            deliveryConfirmation: {
              images: imageUrls,
              confirmedAt: new Date().toISOString(),
            }
          }
        : order
    ));

    setDeliveryImages([]);
  };

  // Add handler for order confirmation
  const handleOrderConfirmation = (orderId: string, images: File[], feedback?: string) => {
    // In real app, upload images to server
    const imageUrls = images.map(file => URL.createObjectURL(file));

    setOrders(orders.map(order => 
      order.orderId === orderId 
        ? {
            ...order,
            status: 'delivered' as const,
            deliveryConfirmation: {
              images: imageUrls,
              confirmedAt: new Date().toISOString(),
              feedback
            }
          }
        : order
    ));

    // Switch back to orders tab after confirmation
    setActiveTab('orders');
  };

  const renderDetails = (details: VehicleDetails | PartsDetails, type: 'vehicle' | 'parts') => {
    return (
      <table className="w-full border-collapse">
        <tbody>
          {Object.entries(details).map(([key, value]) => {
            // Skip part_image if it's empty
            if (key === 'part_image' && !value) return null;
            
            return (
              <tr key={key} className="border-b border-gold-500/20">
                <td className="py-2 text-gold-400 text-left w-1/2">
                  {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:
                </td>
                <td className="py-2 text-gold-400 text-left">{value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className="min-h-screen bg-black text-gold-400 pt-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-zinc-900 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gold-500 mb-6">Welcome, {user.firstName}!</h1>
          
          {/* Navigation Tabs */}
          <div className="flex border-b border-gold-500 mb-6">
            <button
              className={`px-4 py-2 ${
                activeTab === 'profile'
                  ? 'text-gold-500 border-b-2 border-gold-500'
                  : 'text-gold-400 hover:text-gold-300'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === 'quotations'
                  ? 'text-gold-500 border-b-2 border-gold-500'
                  : 'text-gold-400 hover:text-gold-300'
              }`}
              onClick={() => setActiveTab('quotations')}
            >
              Quotations
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === 'orders'
                  ? 'text-gold-500 border-b-2 border-gold-500'
                  : 'text-gold-400 hover:text-gold-300'
              }`}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === 'shipping'
                  ? 'text-gold-500 border-b-2 border-gold-500'
                  : 'text-gold-400 hover:text-gold-300'
              }`}
              onClick={() => setActiveTab('shipping')}
            >
              Shipping
            </button>
          </div>

          {/* Content Sections */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gold-400">Name:</p>
                  <p className="font-semibold">{user.firstName} {user.lastName}</p>
                </div>
                <div>
                  <p className="text-gold-400">Email:</p>
                  <p className="font-semibold">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quotations' && (
            <div className="space-y-6">
              {quotations.map((quotation) => (
                <div key={quotation.id} className="bg-black p-6 rounded-lg border border-gold-500">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gold-500">
                        {quotation.type === 'vehicle' ? 'Vehicle Quotation' : 'Parts Quotation'}
                      </h3>
                      <p className="text-gold-400">Submitted: {quotation.dateSubmitted}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      quotation.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                      quotation.status === 'responded' ? 'bg-green-500/20 text-green-500' :
                      'bg-blue-500/20 text-blue-500'
                    }`}>
                      {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                    </span>
                  </div>
                  
                  {renderDetails(quotation.details, quotation.type)}
                  
                  {quotation.response && (
                    <div className="mt-4 pt-4 border-t border-gold-500/20">
                      <h4 className="text-lg font-semibold text-gold-500 mb-2">Response</h4>
                      <div className="space-y-2">
                        <p><span className="text-gold-400">Availability:</span> {quotation.response.availability}</p>
                        <p><span className="text-gold-400">Estimated Delivery:</span> {quotation.response.estimatedDelivery}</p>
                        <p><span className="text-gold-400">Notes:</span> {quotation.response.additionalNotes}</p>
                        <div className="mt-4">
                          <h5 className="text-gold-500">Price Breakdown</h5>
                          <div className="grid grid-cols-2 gap-2">
                            <p><span className="text-gold-400">Item Cost:</span> {quotation.response.priceBreakdown.itemCost}</p>
                            <p><span className="text-gold-400">Delivery:</span> {quotation.response.priceBreakdown.deliveryCost}</p>
                            <p><span className="text-gold-400">Tax:</span> {quotation.response.priceBreakdown.tax}</p>
                            <p><span className="text-gold-400 font-bold">Total:</span> {quotation.response.priceBreakdown.totalCost}</p>
                          </div>
                        </div>

                        {/* Add Order Button */}
                        {quotation.status === 'responded' && (
                          <div className="mt-6 flex justify-end">
                            <button
                              onClick={() => handlePlaceOrder(quotation.id, quotation.response.priceBreakdown.totalCost)}
                              className="px-6 py-2 bg-gold-500 text-black rounded hover:bg-gold-400"
                            >
                              Place Order
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Payment Modal */}
                  {paymentModal.isOpen && paymentModal.quotationId === quotation.id && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-zinc-900 p-6 rounded-lg max-w-md w-full">
                        <h3 className="text-xl font-bold text-gold-500 mb-4">Complete Payment</h3>
                        <p className="text-gold-400 mb-4">Total Amount: {paymentModal.totalAmount}</p>
                        
                        <div className="mb-4">
                          <label className="block text-gold-400 mb-2">Upload Payment Receipt</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleReceiptUpload}
                            className="w-full text-gold-400"
                          />
                        </div>

                        <div className="flex justify-end space-x-4">
                          <button
                            onClick={() => setPaymentModal({ quotationId: '', isOpen: false, totalAmount: '' })}
                            className="px-4 py-2 text-gold-500 hover:text-gold-400"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handlePaymentSubmission}
                            disabled={!receipt || paymentConfirmed}
                            className="px-4 py-2 bg-gold-500 text-black rounded hover:bg-gold-400 disabled:opacity-50"
                          >
                            {paymentConfirmed ? 'Payment Confirmed' : 'Submit Payment'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.orderId} className="bg-black p-6 rounded-lg border border-gold-500">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gold-500">Order #{order.orderId}</h3>
                      <p className="text-gold-400">Ordered: {order.dateOrdered}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      order.status === 'processing' ? 'bg-yellow-500/20 text-yellow-500' :
                      order.status === 'shipped' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-green-500/20 text-green-500'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  {renderDetails(order.details, order.type)}

                  <div className="mt-4 pt-4 border-t border-gold-500/20">
                    <h4 className="text-lg font-semibold text-gold-500 mb-2">Shipping Information</h4>
                    <ShippingSection
                      order={order}
                      shippingModal={shippingModal}
                      shippingAddress={shippingAddress}
                      deliveryImages={deliveryImages}
                      onShippingModalChange={setShippingModal}
                      onShippingAddressChange={setShippingAddress}
                      onDeliveryImagesChange={setDeliveryImages}
                      onShippingSubmit={handleShippingSubmit}
                      onDeliveryConfirmation={handleDeliveryConfirmation}
                    />
                  </div>

                  {order.status === 'shipped' && (
                    <div className="mt-4">
                      <TrackingPage order={order} />
                    </div>
                  )}

                  {order.status === 'delivered' && !order.deliveryConfirmation && (
                    <div className="mt-4">
                      <OrderConfirmationPage
                        order={order}
                        onConfirm={handleOrderConfirmation}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-6">
              {orders.filter(order => order.shipping).map((order) => (
                <div key={order.orderId} className="bg-black p-6 rounded-lg border border-gold-500">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gold-500">Shipment for Order #{order.orderId}</h3>
                      <p className="text-gold-400">
                        Status: <span className="font-semibold">{order.shipping?.status}</span>
                      </p>
                    </div>
                    {order.shipping?.trackingNumber && (
                      <div className="text-right">
                        <p className="text-gold-400">Tracking Number:</p>
                        <p className="font-semibold text-gold-500">{order.shipping.trackingNumber}</p>
                      </div>
                    )}
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="mt-4 bg-zinc-900 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold text-gold-500 mb-2">Shipping Address</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gold-400">Name:</p>
                          <p className="font-semibold">{order.shippingAddress.fullName}</p>
                        </div>
                        <div>
                          <p className="text-gold-400">Phone:</p>
                          <p className="font-semibold">{order.shippingAddress.phone}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gold-400">Address:</p>
                          <p className="font-semibold">
                            {order.shippingAddress.address}, {order.shippingAddress.city}, 
                            {order.shippingAddress.state} {order.shippingAddress.postalCode}, 
                            {order.shippingAddress.country}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tracking Information */}
                  {order.shipping && (
                    <div className="mt-4">
                      <TrackingPage order={order} />
                    </div>
                  )}

                  {/* Delivery Confirmation */}
                  {order.status === 'delivered' && !order.deliveryConfirmation && (
                    <div className="mt-4">
                      <OrderConfirmationPage
                        order={order}
                        onConfirm={handleOrderConfirmation}
                      />
                    </div>
                  )}

                  {/* Confirm Delivery Button */}
                  {order.status === 'shipped' && (
                    <div className="mt-4 p-4 bg-zinc-900 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-gold-500 mb-2">Delivery Confirmation</h4>
                          <p className="text-gold-400">Please confirm when you receive your order</p>
                        </div>
                        <button
                          onClick={() => setActiveTab('orders')}
                          className="px-6 py-2 bg-gold-500 text-black rounded hover:bg-gold-400"
                        >
                          Confirm Delivery
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Show confirmation status if delivered */}
                  {order.status === 'delivered' && (
                    <div className="mt-4 p-4 bg-zinc-900 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-gold-500 mb-2">Delivery Status</h4>
                          <p className="text-green-500">✓ Delivery Confirmed</p>
                        </div>
                        {order.deliveryConfirmation?.confirmedAt && (
                          <p className="text-gold-400">
                            Confirmed on: {new Date(order.deliveryConfirmation.confirmedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Estimated Delivery */}
                  {order.shipping?.estimatedDelivery && (
                    <div className="mt-4 p-4 bg-zinc-900 rounded-lg">
                      <p className="text-gold-400">Estimated Delivery:</p>
                      <p className="font-semibold text-gold-500">
                        {new Date(order.shipping.estimatedDelivery).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {orders.filter(order => order.shipping).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gold-400">No active shipments found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPage; 