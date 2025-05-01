import { useState, useEffect, useRef } from 'react';
import { BreathingTechnique } from '../types';

type BreathingPhase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

interface UseBreathingTimerProps {
  technique: BreathingTechnique;
  totalDuration?: number; // in seconds, optional
  onComplete?: () => void;
}

interface UseBreathingTimerReturn {
  isActive: boolean;
  currentPhase: BreathingPhase;
  progress: number; // 0 to 1
  phaseProgress: number; // 0 to 1
  elapsedTime: number; // in seconds
  remainingTime: number; // in seconds
  completedCycles: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export const useBreathingTimer = ({
  technique,
  totalDuration = 180, // default 3 minutes
  onComplete
}: UseBreathingTimerProps): UseBreathingTimerReturn => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('inhale');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);

  const timerRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number | null>(null);
  const lastPhaseRef = useRef<BreathingPhase>('inhale');

  const cycleDuration = (
    technique.inhaleTime + 
    technique.holdInTime + 
    technique.exhaleTime + 
    technique.holdOutTime
  );

  const getCurrentPhaseDuration = () => {
    switch (currentPhase) {
      case 'inhale': return technique.inhaleTime;
      case 'holdIn': return technique.holdInTime;
      case 'exhale': return technique.exhaleTime;
      case 'holdOut': return technique.holdOutTime;
    }
  };

  const nextPhase = () => {
    switch (currentPhase) {
      case 'inhale':
        return technique.holdInTime > 0 ? 'holdIn' : 'exhale';
      case 'holdIn':
        return 'exhale';
      case 'exhale':
        return technique.holdOutTime > 0 ? 'holdOut' : 'inhale';
      case 'holdOut':
        return 'inhale';
    }
  };

  useEffect(() => {
    if (!isActive) return;

    const updateTimer = () => {
      const now = Date.now();
      const delta = lastUpdateTimeRef.current ? (now - lastUpdateTimeRef.current) / 1000 : 0;
      lastUpdateTimeRef.current = now;

      setElapsedTime(prev => {
        const newElapsedTime = prev + delta;
        
        // Check if session is complete
        if (newElapsedTime >= totalDuration) {
          setIsActive(false);
          if (onComplete) onComplete();
          return totalDuration;
        }
        
        return newElapsedTime;
      });

      const phaseDuration = getCurrentPhaseDuration();
      
      setPhaseProgress(prev => {
        const newProgress = prev + (delta / phaseDuration);
        
        // Move to next phase if current phase is complete
        if (newProgress >= 1) {
          const nextPhaseType = nextPhase();
          setCurrentPhase(nextPhaseType);
          
          // Only increment cycle counter when completing a full cycle
          // (transitioning from holdOut/exhale back to inhale)
          if ((lastPhaseRef.current === 'holdOut' || lastPhaseRef.current === 'exhale') && 
              nextPhaseType === 'inhale') {
            setCompletedCycles(count => count + 1);
          }
          
          lastPhaseRef.current = nextPhaseType;
          return 0;
        }
        
        return newProgress;
      });

      timerRef.current = requestAnimationFrame(updateTimer);
    };

    lastUpdateTimeRef.current = Date.now();
    timerRef.current = requestAnimationFrame(updateTimer);

    return () => {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
    };
  }, [isActive, currentPhase, technique, totalDuration, onComplete]);

  const start = () => {
    setIsActive(true);
  };

  const pause = () => {
    setIsActive(false);
    lastUpdateTimeRef.current = null;
  };

  const reset = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setPhaseProgress(0);
    setElapsedTime(0);
    setCompletedCycles(0);
    lastUpdateTimeRef.current = null;
    lastPhaseRef.current = 'inhale';
  };

  return {
    isActive,
    currentPhase,
    progress: elapsedTime / totalDuration,
    phaseProgress,
    elapsedTime,
    remainingTime: totalDuration - elapsedTime,
    completedCycles,
    start,
    pause,
    reset
  };
};