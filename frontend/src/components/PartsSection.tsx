import React from 'react';

const PartsSection = () => {
  return (
    // Main parts section container with black background
    <div id="parts" className="py-16 bg-black">
      {/* Content container with max width */}
      <div className="max-w-[1440px] mx-auto px-8">
        {/* Section heading */}
        <h2 className="text-4xl font-normal text-center mb-16 text-gold-500">Auto Parts</h2>

        {/* Parts grid container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Parts Card 1 - Engine Parts */}
          <div className="bg-zinc-900 rounded-lg overflow-hidden">
            <img src="/src/assets/engine-parts.jpg" alt="Engine Parts" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-normal text-gold-500 mb-2">Mechanical・Electrical Parts</h3>
              <p className="text-gold-400">OEM and performance components</p>
            </div>
          </div>

          {/* Parts Card 2 - Body Parts */}
          <div className="bg-zinc-900 rounded-lg overflow-hidden">
            <img src="/src/assets/body-parts.jpg" alt="Body Parts" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-normal text-gold-500 mb-2">Body Parts</h3>
              <p className="text-gold-400">Genuine body panels and accessories</p>
            </div>
          </div>

          {/* Parts Card 3 - Interior Parts */}
          <div className="bg-zinc-900 rounded-lg overflow-hidden">
            <img src="/src/assets/interior-parts.jpg" alt="Interior Parts" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-normal text-gold-500 mb-2">Interior Parts</h3>
              <p className="text-gold-400">Quality interior components and trim</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartsSection; 