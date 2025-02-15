import React, { useState } from 'react';
import ContactSection from './ContactSection';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gold-500 mb-12 text-center">Contact Us</h1>
        
        {/* Contact Form */}
        <div className="max-w-2xl mx-auto mb-24">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gold-400 mb-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-gold-500 rounded-lg px-4 py-2 text-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-gold-400 mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-gold-500 rounded-lg px-4 py-2 text-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-gold-400 mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-gold-500 rounded-lg px-4 py-2 text-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-gold-400 mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full bg-zinc-900 border border-gold-500 rounded-lg px-4 py-2 text-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gold-500 text-black py-3 rounded-lg font-semibold hover:bg-gold-400 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Existing Contact Section */}
        <ContactSection />
      </div>
    </div>
  );
};

export default ContactPage; 