import React from 'react';
import { BreathingTechnique } from '../types';
import { useAppContext } from '../context/AppContext';
import { Play } from 'lucide-react';

interface TechniqueCardProps {
  technique: BreathingTechnique;
  onClick: () => void;
}

const TechniqueCard: React.FC<TechniqueCardProps> = ({ technique, onClick }) => {
  const { isDarkMode } = useAppContext();
  
  return (
    <div 
      className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl h-full flex flex-col ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}
      style={{ borderTop: `4px solid ${technique.color}` }}
    >
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold">{technique.name}</h3>
          <span 
            className="ml-2 text-xs font-semibold rounded-full px-2 py-1"
            style={{ 
              backgroundColor: `${technique.color}20`, // 20% opacity
              color: technique.color 
            }}
          >
            #{technique.id}
          </span>
        </div>
        
        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {technique.description}
        </p>
        
        <div className={`text-sm font-medium mb-4 flex-grow ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <div className="flex items-center mb-2">
            <span className="font-bold min-w-24">Pattern:</span>
            <span>{technique.pattern}</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold min-w-24">Use Cases:</span>
            <span>{technique.useCases}</span>
          </div>
        </div>

        <button
          onClick={onClick}
          className="w-full flex items-center justify-center py-2 px-4 rounded-lg font-medium transition-colors duration-200"
          style={{ 
            backgroundColor: technique.color,
            color: '#ffffff',
          }}
        >
          <Play size={18} className="mr-2" />
          Start Practice
        </button>
      </div>
    </div>
  );
};

export default TechniqueCard;