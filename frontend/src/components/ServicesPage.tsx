import React from 'react';

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-black pt-32 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gold-500 mb-12 text-center">Our Services</h1>

        {/* Import Section */}
        <div className="mb-16 w-full">
          <h3 className="text-3xl font-normal mb-6 text-gold-500">Import Services</h3>
          <div className="bg-black p-8 rounded-lg w-full">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h4 className="text-2xl font-normal mb-4 text-gold-500">Vehicle Import</h4>
                <ul className="space-y-4 text-gold-400">
                  <li>Complete documentation handling</li>
                  <li>Customs clearance assistance</li>
                  <li>Door-to-door shipping services</li>
                  <li>Vehicle inspection and verification</li>
                </ul>
              </div>
              <div>
                <h4 className="text-2xl font-normal mb-4 text-gold-500">Parts Import</h4>
                <ul className="space-y-4 text-gold-400">
                  <li>OEM parts sourcing (Brand new and used)</li>
                  <li>Bulk orders handling</li>
                  <li>Quality inspection</li>
                  <li>Competitive shipping rates (Air and Sea)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="mb-20 w-full">
          <h3 className="text-3xl font-normal mb-8 text-gold-500">Export Services</h3>
          <div className="bg-black p-8 rounded-lg w-full">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h4 className="text-2xl font-normal mb-4 text-gold-500">Vehicle Export</h4>
                <ul className="space-y-4 text-gold-400">
                  <li>International shipping arrangements</li>
                  <li>Export documentation handling</li>
                  <li>Vehicle preparation and inspection</li>
                  <li>Container and RoRo shipping options</li>
                </ul>
              </div>
              <div>
                <h4 className="text-2xl font-normal mb-4 text-gold-500">Parts Export</h4>
                <ul className="space-y-4 text-gold-400">
                  <li>Worldwide shipping solutions</li>
                  <li>Bulk export handling</li>
                  <li>Packaging and protection</li>
                  <li>Express shipping available</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Auction Purchase Section */}
        <div className="w-full">
          <h3 className="text-3xl font-normal mb-8 text-gold-500">Auction Purchase Services</h3>
          <div className="bg-black p-8 rounded-lg w-full">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h4 className="text-2xl font-normal mb-4 text-gold-500">Auction Bidding</h4>
                <ul className="space-y-4 text-gold-400">
                  <li>Access to major Japanese auto auctions</li>
                  <li>Professional bidding strategy</li>
                  <li>Real-time auction updates</li>
                  <li>Vehicle condition reports</li>
                </ul>
              </div>
              <div>
                <h4 className="text-2xl font-normal mb-4 text-gold-500">Post-Purchase Support</h4>
                <ul className="space-y-4 text-gold-400">
                  <li>Inspection verification</li>
                  <li>Transportation arrangements</li>
                  <li>Documentation processing</li>
                  <li>Storage solutions available</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Auction Logos Section */}
        <div className="mt-8 w-full">
          <div className="flex flex-wrap justify-center items-center gap-12">
            <img 
              src="/src/assets/iauc-logo.png" 
              alt="iAuc Logo" 
              className="h-16 object-contain"
            />
            <img 
              src="/src/assets/tau-logo.png" 
              alt="TAU Auction Logo" 
              className="h-16 object-contain"
            />
            <img 
              src="/src/assets/yahoo-logo.jpeg" 
              alt="Yahoo Auction Logo" 
              className="h-16 object-contain"
            />
          </div>
        </div>
      
      </div>
    </div>
  );
};

export default ServicesPage; 