import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Props interface for the QuotationForm component
interface QuotationFormProps {
  isOpen: boolean;  // Controls visibility of the form modal
  onClose: () => void;  // Function to close the modal
}

const API_BASE_URL = 'http://localhost:3000'; // or whatever your backend URL is

const QuotationForm = ({ isOpen, onClose }: QuotationFormProps) => {
  const { user } = useAuth();
  // State for managing form type and data
  const [inquiryType, setInquiryType] = useState<'vehicle' | 'parts'>('vehicle');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Add this after your existing useState declarations
  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      });
    }
  }, [user]);

  // Handle image file selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formDataObj = new FormData();
      
      // Add all form fields
      formDataObj.append('type', inquiryType);
      formDataObj.append('details', JSON.stringify({
        // Vehicle/Parts basic details
        make_model: e.currentTarget.make_model.value,
        model: e.currentTarget.model.value,
        year: e.currentTarget.year.value,
        
        // Preferences (for vehicle)
        ...(inquiryType === 'vehicle' && {
          mileage: e.currentTarget.mileage.value,
          grade: e.currentTarget.grade.value,
          color: e.currentTarget.color.value,
          budget: e.currentTarget.budget.value,
        }),
        
        // Parts specific details
        ...(inquiryType === 'parts' && {
          chassis_number: e.currentTarget.chassis_number?.value,
          part_number: e.currentTarget.part_number?.value,
          parts_description: e.currentTarget.parts_description?.value,
        }),
        
        // Destination information
        country: e.currentTarget.country.value,
        port: e.currentTarget.port.value,
        
        // Contact information
        contactName: formData.name,
        contactEmail: formData.email,
        contactPhone: formData.phone,
        message: formData.message
      }));

      if (selectedImage) {
        formDataObj.append('part_image', selectedImage);
      }

      const response = await fetch(`${API_BASE_URL}/api/quotations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataObj
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit quotation');
      }

      alert('Quotation submitted successfully!');
      onClose();
    } catch (error) {
      console.error('Error submitting quotation:', error);
      alert(error instanceof Error ? error.message : 'Error submitting quotation');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle guest submission flow
  const handleGuestSubmission = async () => {
    try {
      const formDataObj = new FormData();
      
      // Append all form data
      if (selectedImage) {
        formDataObj.append('part_image', selectedImage);
      }
      
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value);
      });
      
      formDataObj.append('inquiryType', inquiryType);
      formDataObj.append('status', 'pending');
      formDataObj.append('createdAt', new Date().toISOString());

      const response = await fetch(`${API_BASE_URL}/api/guest-quotations`, {
        method: 'POST',
        body: formDataObj
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit guest quotation');
      }

      alert('Thank you! We will contact you via email shortly.');
      onClose();
      setShowAuthPrompt(false);
    } catch (error) {
      console.error('Error submitting guest quotation:', error);
      alert('Error submitting quotation. Please try again.');
    }
  };

  // Handle signup flow with quotation data
  const handleSignUp = () => {
    // Prepare quotation data for signup process
    const quotationData = {
      inquiryType,
      ...formData,
    };
    
    // Navigate to signup page with quotation data
    navigate('/SignUp', { 
      state: { 
        fromQuotation: true,
        quotationData 
      }
    });
  };


  const handleSignIn = () => {
    // Prepare quotation data for signup process
    const quotationData = {
      inquiryType,
      ...formData,
    };
    
    // Navigate to signup page with quotation data
    navigate('/SignIn', { 
      state: { 
        fromQuotation: true,
        quotationData 
      }
    });
  };
  // Don't render anything if modal is closed
  if (!isOpen) return null;

  return (
    // Modal overlay with dark background
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto">
      {/* Modal content container */}
      <div className="bg-zinc-900 p-8 rounded-lg max-w-2xl w-full mx-4 my-8">
        {/* Modal header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gold-500">
            {showAuthPrompt ? 'Account Options' : 'Request Quotation'}
          </h2>
          <button onClick={onClose} className="text-gold-500 hover:text-gold-400">✕</button>
        </div>

        {/* Modal body with scrollable content */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
          {showAuthPrompt ? (
            // Authentication options view
            <div className="space-y-6">
              <p className="text-gold-400">Would you like to create an account for better tracking and communication?</p>
              <div className="space-y-4">
                <button
                  onClick={handleSignUp}
                  className="w-full p-3 bg-gold-500 text-black rounded hover:bg-gold-400"
                >
                  Sign Up for an Account
                </button>
                <button
                  onClick={handleGuestSubmission}
                  className="w-full p-3 border border-gold-500 text-gold-500 rounded hover:bg-gold-500 hover:text-black"
                >
                  Continue as Guest
                </button>

                <button
                  onClick={handleSignIn}
                  className="w-full p-3 bg-gold-500 text-black rounded hover:bg-gold-400"
                >
                  Aldready a Member? Sign in
                </button>

                <button
                  onClick={() => setShowAuthPrompt(false)}
                  className="w-full p-3 text-gold-500 hover:text-gold-400"
                >
                  Back
                </button>

                
              </div>
            </div>
          ) : (
            // Quotation form view
            <>
              {/* Inquiry type selection */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => setInquiryType('vehicle')}
                  className={`mr-4 px-4 py-2 rounded ${
                    inquiryType === 'vehicle' ? 'bg-gold-500 text-black' : 'text-gold-500 border border-gold-500'
                  }`}
                >
                  Vehicle Inquiry
                </button>
                <button
                  type="button"
                  onClick={() => setInquiryType('parts')}
                  className={`px-4 py-2 rounded ${
                    inquiryType === 'parts' ? 'bg-gold-500 text-black' : 'text-gold-500 border border-gold-500'
                  }`}
                >
                  Parts Inquiry
                </button>
              </div>
              
              {/* Main quotation form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {inquiryType === 'vehicle' ? (
                  // Vehicle inquiry fields
                  <>
                    {/* Vehicle details section */}
                    <div>
                      <label className="block text-gold-500 mb-2">Vehicle Details</label>
                      <input type="text" name="make_model" placeholder="Make & Model name" className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500 mb-2" />
                      <input type="text" name="model" placeholder="Model" className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500 mb-2" />
                      <input type="text" name="year" placeholder="Year" className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500" />
                    </div>

                    {/* Vehicle preferences section */}
                    <div>
                      <label className="block text-gold-500 mb-2">Preferences</label>
                      <input type="text" name="mileage" placeholder="Desired mileage" className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500 mb-2" />
                      <input type="text" name="grade" placeholder="Grade" className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500 mb-2" />
                      <input type="text" name="color" placeholder="Color" className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500" />
                      <input type="text" name="budget" placeholder="Budget (Maximum you can spend in JPY)" className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500" />
                    </div>
                  </>
                ) : (
                  // Parts inquiry fields
                  <>
                    <div>
                      <label className="block text-gold-500 mb-2">Parts Details</label>
                      {/* Parts identification fields */}
                      <input type="text" name="make_model" placeholder="Make & Model name" className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500 mb-2" />
                      <input type="text" name="model" placeholder="Model" className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500 mb-2" />
                      <input type="text" name="year" placeholder="Year" className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500 mb-2" />
                      <input type="text" name="chassis_number" placeholder="Chassis number" className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500 mb-2" />
                      <input type="text" name="part_number" placeholder="Part number (if known)" className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500 mb-2" />
                      <textarea name="parts_description" placeholder="Describe the parts you need..." className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500" rows={3} />
                      
                      {/* Part image upload section */}
                      <div className="mt-2">
                        <label className="block text-gold-500 mb-2">Upload Part Image</label>
                        <input
                          type="file"
                          name="part_image"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full text-gold-500 file:mr-4 file:py-2 file:px-4
                            file:rounded file:border-0 file:bg-gold-500 file:text-black
                            hover:file:bg-gold-400 cursor-pointer"
                        />
                        {selectedImage && (
                          <p className="text-gold-500 text-sm mt-1">
                            Selected: {selectedImage.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Destination information */}
                <div>
                  <label className="block text-gold-500 mb-2">Destination</label>
                  <input type="text" name="country" placeholder="Country" className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500 mb-2" />
                  <input type="text" name="port" placeholder="Port" className="w-full bg-black border border-gold-500 rounded px-3 py-2 text-gold-500" />
                </div>

                {/* Contact information */}
                <div>
                  <label className="block text-gold-500 mb-2">Contact Information</label>
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full p-2 bg-black border border-gold-500 text-gold-500 rounded"
                    required
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 bg-black border border-gold-500 text-gold-500 rounded"
                    required
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    className="w-full p-2 bg-black border border-gold-500 text-gold-500 rounded"
                    required
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                  <textarea
                    placeholder="Message"
                    className="w-full p-2 bg-black border border-gold-500 text-gold-500 rounded"
                    rows={4}
                    required
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                {/* Form action buttons */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gold-500 hover:text-gold-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-gold-500 text-black rounded hover:bg-gold-400 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Submit'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuotationForm; 