import React from 'react';
import { useAppContext } from '../context/AppContext';
import TechniqueCard from './TechniqueCard';
import CreatePatternCard from './CreatePatternCard';
import { useNavigate } from 'react-router-dom';

const TechniqueList: React.FC = () => {
  const { techniques, setCurrentTechnique } = useAppContext();
  const navigate = useNavigate();
  
  const handleTechniqueClick = (techniqueId: number) => {
    const technique = techniques.find(t => t.id === techniqueId);
    if (technique) {
      setCurrentTechnique(technique);
      navigate('/exercise');
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CreatePatternCard />
      {techniques.map(technique => (
        <TechniqueCard 
          key={technique.id}
          technique={technique}
          onClick={() => handleTechniqueClick(technique.id)}
        />
      ))}
    </div>
  );
};

export default TechniqueList;