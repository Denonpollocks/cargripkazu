import React from 'react';

const OrderGuide = () => {
  const steps = [
    "Choose your desired vehicle from our catalog",
    "Review specifications and features",
    "Contact our sales team",
    "Receive a detailed quotation",
    "Review and confirm pricing",
    "Submit required documents",
    "Make initial payment",
    "Vehicle order confirmation",
    "Production and shipping updates",
    "Final payment and documentation",
    "Vehicle delivery and handover"
  ];

  return (
    <div className="min-h-screen bg-black text-gold-500 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center">Order Guide</h1>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                {index + 1}
              </div>
              <p className="text-lg pt-1">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderGuide;
