import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import BreathingAnimation from '../components/BreathingAnimation';
import SessionControls from '../components/SessionControls';
import { useBreathingTimer } from '../hooks/useBreathingTimer';
import { Info, X, CheckCircle } from 'lucide-react';

const Exercise: React.FC = () => {
  const { currentTechnique, isDarkMode, addSessionRecord } = useAppContext();
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [duration, setDuration] = useState(180); // Default 3 minutes
  
  useEffect(() => {
    // Redirect to home if no technique is selected
    if (!currentTechnique) {
      navigate('/');
    }
  }, [currentTechnique, navigate]);
  
  const handleSessionComplete = () => {
    if (currentTechnique) {
      addSessionRecord({
        techniqueId: currentTechnique.id,
        techniqueName: currentTechnique.name,
        duration,
        date: new Date()
      });
      setSessionCompleted(true);
    }
  };
  
  const {
    isActive,
    currentPhase,
    phaseProgress,
    elapsedTime,
    remainingTime,
    completedCycles,
    start,
    pause,
    reset
  } = useBreathingTimer({
    technique: currentTechnique!,
    totalDuration: duration,
    onComplete: handleSessionComplete
  });
  
  if (!currentTechnique) return null;
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'
    }`}>
      {/* Session completed modal */}
      {sessionCompleted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl p-6 max-w-md w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle size={32} className="text-green-500" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-center mb-2">Session Complete!</h2>
            <p className={`text-center mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Great job! You completed a {Math.floor(duration / 60)}-minute session of {currentTechnique.name}.
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => {
                  setSessionCompleted(false);
                  reset();
                }}
                className="w-full py-2 px-4 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                Practice Again
              </button>
              <button
                onClick={() => navigate('/')}
                className={`w-full py-2 px-4 rounded-lg font-medium ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                } transition-colors`}
              >
                Back to Techniques
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-lg mx-auto">
          <div className={`mb-6 p-4 rounded-xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-md`}>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold flex items-center">
                <span 
                  className="inline-block w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: currentTechnique.color }}
                />
                {currentTechnique.name}
              </h1>
              
              <button
                onClick={() => setShowDetails(!showDetails)}
                className={`p-2 rounded-full ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                } transition-colors`}
                aria-label={showDetails ? 'Hide details' : 'Show details'}
              >
                {showDetails ? <X size={20} /> : <Info size={20} />}
              </button>
            </div>
            
            {showDetails && (
              <div className={`p-4 rounded-lg mb-4 text-sm ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <p className="mb-3">{currentTechnique.description}</p>
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <span className="font-semibold">Pattern: </span>
                    {currentTechnique.pattern}
                  </div>
                  <div>
                    <span className="font-semibold">Use Cases: </span>
                    {currentTechnique.useCases}
                  </div>
                  <div>
                    <span className="font-semibold">Evidence: </span>
                    {currentTechnique.evidence}
                  </div>
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <BreathingAnimation 
                phase={currentPhase}
                progress={phaseProgress}
                color={currentTechnique.color}
                isActive={isActive}
              />
            </div>
            
            <div className="text-center mb-6">
              <div className="text-sm font-medium mb-1">Completed Cycles</div>
              <div className="text-3xl font-bold">{completedCycles}</div>
            </div>
            
            <SessionControls 
              isActive={isActive}
              onStart={start}
              onPause={pause}
              onReset={reset}
              elapsedTime={elapsedTime}
              remainingTime={remainingTime}
              totalDuration={duration}
              onChangeDuration={(newDuration) => {
                setDuration(newDuration);
                reset();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exercise;