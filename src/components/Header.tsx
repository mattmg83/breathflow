import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Sun as Lung, Sun, Moon, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useAppContext();
  const location = useLocation();
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
    } shadow-sm backdrop-blur-md bg-opacity-90`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-2 font-bold text-xl"
          >
            <Lung size={24} className="text-blue-500" />
            <span>BreathFlow</span>
          </Link>
          
          <div className="flex items-center">
            {location.pathname !== '/' && (
              <Link 
                to="/"
                className={`mr-4 p-2 rounded-full hover:bg-opacity-10 ${
                  isDarkMode ? 'hover:bg-white' : 'hover:bg-gray-800'
                }`}
                aria-label="Home"
              >
                <Home size={20} />
              </Link>
            )}
            
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full hover:bg-opacity-10 ${
                isDarkMode ? 'hover:bg-white' : 'hover:bg-gray-800'
              }`}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;