import React from 'react';
import { useAppContext } from '../context/AppContext';
import TechniqueList from '../components/TechniqueList';
import { Clock, BarChart3 } from 'lucide-react';

const Home: React.FC = () => {
  const { isDarkMode, sessionHistory } = useAppContext();
  
  // Calculate total practice time
  const totalPracticeTime = sessionHistory.reduce((total, session) => total + session.duration, 0);
  
  // Format time in hours and minutes
  const formatTotalTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} seconds`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hour${hours !== 1 ? 's' : ''}${remainingMinutes > 0 ? ` ${remainingMinutes} min` : ''}`;
  };
  
  // Get most practiced technique
  const getTechniquePracticeCount = () => {
    const counts: Record<string, { count: number, duration: number }> = {};
    
    sessionHistory.forEach(session => {
      if (!counts[session.techniqueName]) {
        counts[session.techniqueName] = { count: 0, duration: 0 };
      }
      counts[session.techniqueName].count += 1;
      counts[session.techniqueName].duration += session.duration;
    });
    
    let mostPracticedTechnique = { name: '', count: 0, duration: 0 };
    
    Object.entries(counts).forEach(([name, data]) => {
      if (data.count > mostPracticedTechnique.count) {
        mostPracticedTechnique = { name, count: data.count, duration: data.duration };
      }
    });
    
    return mostPracticedTechnique;
  };
  
  const mostPracticed = getTechniquePracticeCount();
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'
    }`}>
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">BreathFlow</h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Evidence-based breathing techniques
          </p>
        </div>
        
        {sessionHistory.length > 0 && (
          <div className={`rounded-xl p-5 mb-8 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-md`}>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart3 size={20} className="mr-2 text-blue-500" />
              Your Breathing Journey
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                <div className="flex items-center mb-1">
                  <Clock size={16} className="mr-2 text-blue-500" />
                  <h3 className="text-sm font-medium">Total Practice Time</h3>
                </div>
                <p className="text-2xl font-bold">
                  {formatTotalTime(totalPracticeTime)}
                </p>
              </div>
              
              {mostPracticed.name && (
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <div className="flex items-center mb-1">
                    <BarChart3 size={16} className="mr-2 text-green-500" />
                    <h3 className="text-sm font-medium">Most Practiced</h3>
                  </div>
                  <p className="text-2xl font-bold">
                    {mostPracticed.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {mostPracticed.count} session{mostPracticed.count !== 1 ? 's' : ''} 
                    {' '}({formatTotalTime(mostPracticed.duration)})
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        <h2 className="text-2xl font-bold mb-6">Breathing Techniques</h2>
        <TechniqueList />
      </div>
    </div>
  );
};

export default Home;