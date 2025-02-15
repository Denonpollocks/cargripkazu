import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const goHome = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Order Guide', href: '/order-guide' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <div className="fixed w-screen bg-black bg-opacity-90 z-50">
      <div className="w-screen">
        <div className="flex justify-between justify-center item-center h-20 px-8">
          <div className="w-40">
            <Link to="/" onClick={goHome} className="text-gold-500 font-bold text-3xl">
              Car Grip
            </Link>
          </div>
          <div className="flex items-center justify-end w-screen">
            <div className="flex space-x-12">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => {
                    if (item.href === '/') {
                      goHome();
                    } else {
                      scrollToSection(item.name.toLowerCase());
                    }
                  }}
                  className="text-gold-400 hover:text-gold-300"
                >
                  {item.name}
                </Link>
              ))}
              <button onClick={() => scrollToSection('vehicles')} className="text-gold-400 hover:text-gold-300">Vehicles</button>
              <button onClick={() => scrollToSection('parts')} className="text-gold-400 hover:text-gold-300">Parts</button>
              <Link to="/signin" className="text-gold-400 hover:text-gold-300">Sign In</Link>
              {user?.isAdmin && (
                <Link 
                  to="/admin"
                  className="text-gold-400 hover:text-gold-300"
                >
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
          <div className="w-48"></div>
        </div>
      </div>
    </div>
  );
};

export default Navigation; 