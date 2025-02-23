import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import VehiclesSection from './components/VehiclesSection';
import PartsSection from './components/PartsSection';
import ServicesPage from './components/ServicesPage';
import OrderGuide from './components/OrderGuide';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import QuotationForm from './components/QuotationForm';
import SocialMedia from './components/SocialMedia';
import SignUp from './components/SignUp';
import UserPage from './components/UserPage';
import ContactPage from './components/ContactPage';
import ScrollToTop from './components/ScrollToTop';
import SignIn from './components/SignIn';
import AdminPanel from './components/admin/AdminPanel';
import AdminRoute from './components/routes/AdminRoute';
import AdminLogin from './components/admin/AdminLogin';
import { AuthProvider } from './contexts/AuthContext';
import Privacy from './components/Privacy';

// HomePage component - Contains all sections for the main page
function HomePage({ isQuotationFormOpen, setIsQuotationFormOpen }: { 
  isQuotationFormOpen: boolean; 
  setIsQuotationFormOpen: (open: boolean) => void 
}) {
  return (
    <div className="bg-black">
      <HeroSection onQuotationClick={() => setIsQuotationFormOpen(true)} />
      {/* Sign up section */}
      <div className="w-full bg-black py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl font-bold text-gold-500 mb-6">Join Our Community</h2>
          <SocialMedia />
          <p>
          
          </p>
          <p className="text-gold-400 text-center mb-12 max-w-2xl">
            Create an account to get personalized updates, track your orders, and access exclusive features.
          </p>
          <Link 
            to="/SignUp"
            state={{ fromQuotation: false }}
            className="px-8 py-4 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors font-semibold shadow-lg text-lg"
          >
            Sign Up Now
          </Link>
        </div>
      </div>

      {/* Add scroll anchor points */}
      <div id="vehicles" className="bg-black scroll-mt-20">
        <VehiclesSection />
      </div>
      <div id="parts" className="bg-black scroll-mt-20">
        <PartsSection />
      </div>
    </div>
  );
}

// ScrollHandler component - Manages smooth scrolling to sections
function ScrollHandler() {
  const location = useLocation();

  // Effect to handle scrolling when location changes
  useEffect(() => {
    if (location.state && location.state.scrollTo === 'contact') {
      const element = document.getElementById('contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return null;
}

// Main App component
function App() {
  // State for managing quotation form visibility
  const [isQuotationFormOpen, setIsQuotationFormOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <ScrollToTop>
          <div className="pt-20">
            <Routes>
              <Route path="/" element={
                <HomePage 
                  isQuotationFormOpen={isQuotationFormOpen} 
                  setIsQuotationFormOpen={setIsQuotationFormOpen} 
                />
              } />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/order-guide" element={<OrderGuide />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/user" element={<UserPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/*"
                element={
                  <AdminRoute>
                    <AdminPanel />
                  </AdminRoute>
                }
              />
              <Route path="/privacy" element={<Privacy />} />
            </Routes>
          </div>
        </ScrollToTop>
        <Footer />
        <QuotationForm 
          isOpen={isQuotationFormOpen} 
          onClose={() => setIsQuotationFormOpen(false)} 
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
