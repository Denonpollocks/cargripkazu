import React, { useState, useEffect } from 'react';
import QuotationResponseModal from './QuotationResponseModal';

const QuotationManagement: React.FC = () => {
  const [quotations, setQuotations] = useState([]);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      const response = await fetch('/api/admin/quotations');
      const data = await response.json();
      setQuotations(data);
    } catch (error) {
      console.error('Error fetching quotations:', error);
    }
  };

  const handleRespond = async (response: any) => {
    try {
      const res = await fetch(`/api/admin/quotations/${selectedQuotation._id}/response`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(response),
      });

      if (res.ok) {
        setIsResponseModalOpen(false);
        fetchQuotations(); // Refresh quotations list
      }
    } catch (error) {
      console.error('Error responding to quotation:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gold-500 mb-6">Quotation Management</h2>
      
      {quotations.map((quotation) => (
        <div key={quotation._id} className="bg-black p-6 rounded-lg border border-gold-500">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-gold-500">
                {quotation.type === 'vehicle' ? 'Vehicle Quotation' : 'Parts Quotation'}
              </h3>
              <p className="text-gold-400">From: {quotation.user?.firstName} {quotation.user?.lastName}</p>
              <p className="text-gold-400">Submitted: {new Date(quotation.dateSubmitted).toLocaleDateString()}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              quotation.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
              quotation.status === 'responded' ? 'bg-green-500/20 text-green-500' :
              'bg-blue-500/20 text-blue-500'
            }`}>
              {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
            </span>
          </div>

          {/* Quotation Details */}
          <div className="mt-4">
            {Object.entries(quotation.details).map(([key, value]) => (
              <p key={key} className="text-gold-400">
                <span className="font-semibold">{key.replace('_', ' ')}:</span> {value}
              </p>
            ))}
          </div>

          {/* Response Button */}
          {quotation.status === 'pending' && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSelectedQuotation(quotation);
                  setIsResponseModalOpen(true);
                }}
                className="px-4 py-2 bg-gold-500 text-black rounded hover:bg-gold-400"
              >
                Respond to Quotation
              </button>
            </div>
          )}

          {/* Show Response if available */}
          {quotation.response && (
            <div className="mt-4 pt-4 border-t border-gold-500/20">
              <h4 className="text-lg font-semibold text-gold-500 mb-2">Your Response</h4>
              <div className="space-y-2">
                <p><span className="text-gold-400">Availability:</span> {quotation.response.availability}</p>
                <p><span className="text-gold-400">Estimated Delivery:</span> {quotation.response.estimatedDelivery}</p>
                <p><span className="text-gold-400">Notes:</span> {quotation.response.additionalNotes}</p>
                <div className="mt-2">
                  <h5 className="text-gold-500">Price Breakdown</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <p><span className="text-gold-400">Item Cost:</span> {quotation.response.priceBreakdown.itemCost}</p>
                    <p><span className="text-gold-400">Delivery:</span> {quotation.response.priceBreakdown.deliveryCost}</p>
                    <p><span className="text-gold-400">Tax:</span> {quotation.response.priceBreakdown.tax}</p>
                    <p><span className="text-gold-400 font-bold">Total:</span> {quotation.response.priceBreakdown.totalCost}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Response Modal */}
      {isResponseModalOpen && selectedQuotation && (
        <QuotationResponseModal
          quotation={selectedQuotation}
          onClose={() => setIsResponseModalOpen(false)}
          onSubmit={handleRespond}
        />
      )}
    </div>
  );
};

export default QuotationManagement; 