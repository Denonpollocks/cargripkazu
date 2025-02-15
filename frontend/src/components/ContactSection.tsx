import React from 'react';
import SocialMedia from './SocialMedia';

const ContactSection = () => {
  return (
    <div id="contact" className="py-16 bg-black">
      <div className="max-w-[1440px] mx-auto px-8">
        <h2 className="text-4xl font-normal text-center mb-16 text-gold-500">Contact Us</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-zinc-900 p-6 rounded-lg">
            <h3 className="text-xl font-normal text-gold-500 mb-4">Our Location</h3>
            <p className="text-gold-400">
              Hiratsuka<br />
              Kanagawa, Japan 259-1137
            </p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg">
            <h3 className="text-xl font-normal text-gold-500 mb-4">Contact Info</h3>
            <p className="text-gold-400">
              admin@car-grip.com<br />
              WhatsApp or call us at <br />
              +81 80 9322 5278
            </p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg">
            <h3 className="text-xl font-normal text-gold-500 mb-4">Business Hours</h3>
            <p className="text-gold-400">
              Monday - Friday: 9:00 AM - 6:00 PM<br />
              Saturday: Based on inquiries<br />
              Sunday: Closed
            </p>
          </div>
        </div>

        <div className="mt-12 text-center text-gold-400">
          <p>For immediate assistance, please use our quotation form or send us an email.</p>
        </div>
      </div>
    </div>
  );
};

export default ContactSection; 