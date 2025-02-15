import React from 'react';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';

const SocialMedia = () => {
  return (
    <div className="bg-black py-4">
      <h2 className="text-2xl font-normal text-center mb-4 text-gold-500">Connect With Us</h2>
      
      <div className="flex items-center justify-center space-x-8">
        <a href="#" className="text-gold-500 hover:text-gold-400 transition-colors">
          <FaFacebookF size={24} />
        </a>
        <a href="#" className="text-gold-500 hover:text-gold-400 transition-colors">
          <FaInstagram size={24} />
        </a>
        <a href="#" className="text-gold-500 hover:text-gold-400 transition-colors">
          <SiTiktok size={22} />
        </a>
      </div>
    </div>
  );
};

export default SocialMedia; 