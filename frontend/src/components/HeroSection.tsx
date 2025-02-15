import React from 'react';

// Define props interface for HeroSection
interface HeroSectionProps {
  onQuotationClick: () => void;  // Function to handle quotation button click
}

const HeroSection = ({ onQuotationClick }: HeroSectionProps) => {
  return (
    // Main hero section container with reduced height (h-[50vh] instead of h-screen)
    <div className="relative h-[50vh] bg-black">
      {/* Background image container with overlay */}
      <div className="absolute inset-0 bg-[url('/src/assets/CarGrip.png')] bg-contain bg-center bg-no-repeat">
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black opacity-80"></div>
      </div>

      {/* Content container - centered both vertically and horizontally */}
      <div className="relative h-full max-w-[1440px] mx-auto px-8 flex flex-col justify-center items-center text-center pt-16">
        {/* Main heading - centered */}
        <h1 className="text-6xl font-bold text-gold-500 mb-4">
          Your Trusted Partner in
          <br />
          Japanese Auto Import
        </h1>

        {/* Subheading - centered */}
        <p className="text-xl text-gold-400 mb-8 max-w-2xl">
          Specializing in quality Japanese vehicles and parts. 
          Direct import service with professional support throughout the process.
        </p>

        {/* Call-to-action button - centered */}
        <button
          onClick={onQuotationClick}
          className="bg-gold-500 text-black px-8 py-3 rounded-lg text-lg font-semibold 
                   hover:bg-gold-400 transition-colors"
        >
          Request Quotation
        </button>
      </div>
    </div>
  );
};

export default HeroSection; 