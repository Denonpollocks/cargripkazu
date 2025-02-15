import React from 'react';

const VehiclesSection = () => {
  return (
    // Main vehicles section container with minimal top padding
    <div id="vehicles" className="pt-14 pb-16 bg-black">
      {/* Content container with max width */}
      <div className="max-w-[1440px] mx-auto px-8">
        {/* Section heading */}
        <h2 className="text-4xl font-normal text-center mb-16 text-gold-500">Vehicles we can provide</h2>

        {/* Vehicle grid container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Vehicle Card 1 - Premium Vehicles */}
          <div className="bg-zinc-900 rounded-lg overflow-hidden">
            <img src="/src/assets/vehicle1.jpg" alt="Premium Vehicles" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-normal text-gold-500 mb-2">Premium Vehicles</h3>
              <p className="text-gold-400">High-end luxury, sports cars and EVs from top Japanese and European manufacturers</p>
            </div>
          </div>

          {/* Vehicle Card 2 - Commercial Vehicles */}
          <div className="bg-zinc-900 rounded-lg overflow-hidden">
            <img src="/src/assets/vehicle2.jpg" alt="Commercial Vehicles" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-normal text-gold-500 mb-2">Commercial Vehicles</h3>
              <p className="text-gold-400">Reliable trucks, vans, and buses for business needs</p>
            </div>
          </div>

          {/* Vehicle Card 3 - Family Vehicles */}
          <div className="bg-zinc-900 rounded-lg overflow-hidden">
            <img src="/src/assets/vehicle3.jpg" alt="Family Vehicles" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-normal text-gold-500 mb-2">Family Vehicles</h3>
              <p className="text-gold-400">Comfortable and spacious family cars and MPVs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehiclesSection; 