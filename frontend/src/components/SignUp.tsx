import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const SignUp = () => {
  // Get location and navigation objects from React Router
  const location = useLocation();
  const navigate = useNavigate();
  // Extract quotation data from location state if coming from quotation form
  const { fromQuotation, quotationData } = location.state || {};

  // Initialize form state with empty values
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    country: '',
    company: ''
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Log the form data (replace with actual API call)
      console.log('Form submitted:', formData);

      if (fromQuotation && quotationData) {
        // If user came from quotation form, handle both signup and quotation
        console.log('Submitting quotation:', quotationData);
        // TODO: Add API call for quotation submission
        
        alert('Account created and quotation submitted successfully!');
      } else {
        // Handle regular signup only
        alert('Account created successfully!');
      }

      // Redirect to home page after successful submission
      navigate('/');
      
    } catch (error) {
      // Handle any errors during submission
      console.error('Error during submission:', error);
      alert('An error occurred. Please try again.');
    }
  };

  // Handle input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update form state when input values change
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    // Main container with black background and padding
    <div className="min-h-screen bg-black pt-24 pb-12 px-4">
      {/* Form card with dark background */}
      <div className="max-w-2xl mx-auto bg-zinc-900 rounded-lg p-8">
        {/* Dynamic title based on whether user came from quotation */}
        <h1 className="text-3xl font-bold text-gold-500 mb-8 text-center">
          {fromQuotation ? 'Create Account & Submit Quotation' : 'Create Account'}
        </h1>
        
        {/* Show additional message if coming from quotation */}
        {fromQuotation && (
          <p className="text-gold-400 mb-6 text-center">
            Your quotation will be submitted along with your account creation
          </p>
        )}
        
        {/* Signup form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First and Last Name in 2-column grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gold-500 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                required
                className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gold-500 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                required
                className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email field */}
          <div>
            <label className="block text-gold-500 mb-2">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500"
              onChange={handleChange}
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block text-gold-500 mb-2">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500"
              onChange={handleChange}
            />
          </div>

          {/* Confirm Password field */}
          <div>
            <label className="block text-gold-500 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              required
              className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500"
              onChange={handleChange}
            />
          </div>

          {/* Phone Number field */}
          <div>
            <label className="block text-gold-500 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              required
              className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500"
              onChange={handleChange}
            />
          </div>

          {/* Country field */}
          <div>
            <label className="block text-gold-500 mb-2">Country</label>
            <input
              type="text"
              name="country"
              required
              className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500"
              onChange={handleChange}
            />
          </div>

          {/* Optional Company field */}
          <div>
            <label className="block text-gold-500 mb-2">Company (Optional)</label>
            <input
              type="text"
              name="company"
              className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500"
              onChange={handleChange}
            />
          </div>

          {/* Form buttons */}
          <div className="flex justify-end space-x-4">
            {/* Cancel button - returns to home */}
            <Link
              to="/"
              className="px-4 py-2 text-gold-500 hover:text-gold-400"
            >
              Cancel
            </Link>
            {/* Submit button - text changes based on context */}
            <button
              type="submit"
              className="px-4 py-2 bg-gold-500 text-black rounded hover:bg-gold-400"
            >
              {fromQuotation ? 'Create Account & Submit' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp; 