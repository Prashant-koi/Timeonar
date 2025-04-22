import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
                <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z"></path>
              </svg>
              <span className="ml-2 text-xl font-bold">Timeonar</span>
            </Link>
          </div>
          
          {/* Navigation Links - Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <NavLink to="/" label="Home" />
              <NavLink to="/features" label="Features" />
              <NavLink to="/pricing" label="Pricing" />
              <NavLink to="/about" label="About Us" />
              <NavLink to="/contact" label="Contact" />
            </div>
          </div>
          
          {/* CTA and Mobile Menu Button */}
          <div className="flex items-center">
            <Link 
              to="/timeonar" 
              className="hidden md:block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
            >
              Get Started
            </Link>
            
            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-400 hover:text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900">
            <MobileNavLink to="/" label="Home" />
            <MobileNavLink to="/features" label="Features" />
            <MobileNavLink to="/pricing" label="Pricing" />
            <MobileNavLink to="/about" label="About Us" />
            <MobileNavLink to="/contact" label="Contact" />
            <Link 
              to="/timeonar" 
              className="block text-center mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink: React.FC<{to: string; label: string}> = ({to, label}) => (
  <Link 
    to={to} 
    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
  >
    {label}
  </Link>
);

const MobileNavLink: React.FC<{to: string; label: string}> = ({to, label}) => (
  <Link 
    to={to} 
    className="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium"
  >
    {label}
  </Link>
);

export default Navbar;