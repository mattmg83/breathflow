import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Clock, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SessionControlsProps {
  isActive: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  elapsedTime: number;
  remainingTime: number;
  totalDuration: number;
  onChangeDuration: (duration: number) => void;
}

const SessionControls: React.FC<SessionControlsProps> = ({
  isActive,
  onStart,
  onPause,
  onReset,
  elapsedTime,
  remainingTime,
  totalDuration,
  onChangeDuration
}) => {
  const navigate = useNavigate();
  const [showDurationSelector, setShowDurationSelector] = useState(false);
  
  // Format time in mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const durationOptions = [
    { value: 60, label: '1 minute' },
    { value: 180, label: '3 minutes' },
    { value: 300, label: '5 minutes' },
    { value: 600, label: '10 minutes' },
    { value: 900, label: '15 minutes' }
  ];
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3 text-sm font-medium">
        <div>Elapsed: {formatTime(elapsedTime)}</div>
        <div>Remaining: {formatTime(remainingTime)}</div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full transition-all duration-300 ease-linear"
          style={{ 
            width: `${(elapsedTime / totalDuration) * 100}%`,
            backgroundColor: isActive ? '#3B82F6' : '#9CA3AF'
          }}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onReset}
            className="flex items-center justify-center p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            aria-label="Reset"
          >
            <RotateCcw size={20} />
          </button>
          
          <button
            onClick={isActive ? onPause : onStart}
            className={`flex items-center justify-center p-4 rounded-full ${
              isActive 
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            } transition-colors shadow-md`}
            aria-label={isActive ? 'Pause' : 'Start'}
          >
            {isActive ? <Pause size={24} /> : <Play size={24} />}
          </button>
          
          <button
            onClick={() => setShowDurationSelector(!showDurationSelector)}
            className="flex items-center justify-center p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            aria-label="Set duration"
          >
            <Clock size={20} />
          </button>
        </div>
        
        <div className="w-8" /> {/* For balance */}
      </div>
      
      {/* Duration selector */}
      {showDurationSelector && (
        <div className="mt-6 p-4 rounded-lg bg-white shadow-md">
          <h4 className="text-sm font-medium mb-3">Session Duration</h4>
          <div className="flex flex-wrap gap-2">
            {durationOptions.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  onChangeDuration(option.value);
                  setShowDurationSelector(false);
                }}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  totalDuration === option.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionControls;