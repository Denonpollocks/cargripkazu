import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    // Main footer container with dark background
    <footer className="bg-zinc-900 py-12">
      {/* Content container with max width */}
      <div className="max-w-[1440px] mx-auto px-8">
        {/* Quick Links - centered */}
        <div className="flex flex-col items-center">
          <h3 className="text-l font-normal text-gold-500 mb-4">Quick Links</h3>
          <ul className="space-y-2 text-center">
            <li>
              <Link to="/" className="text-gold-400 hover:text-gold-300 text-sm">Home</Link>
            </li>
            <li>
              <Link to="/services" className="text-gold-400 hover:text-gold-300 text-sm">Services</Link>
            </li>
            <li>
              <Link to="/#vehicles" className="text-gold-400 hover:text-gold-300 text-sm">Vehicles</Link>
            </li>
            <li>
              <Link to="/#parts" className="text-gold-400 hover:text-gold-300 text-sm">Parts</Link>
            </li>
            <li>
              <Link to="/#contact" className="text-gold-400 hover:text-gold-300 text-sm">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Copyright Notice */}
        <div className="mt-8 pt-8 border-t border-zinc-800 text-center text-gold-400">
          <p>&copy; {new Date().getFullYear()} Car Grip by Nisa Ventures and APRS Japan Lanka. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 