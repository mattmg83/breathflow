import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BreathingTechnique } from '../types';
import { breathingTechniques } from '../data/techniques';

interface AppContextType {
  techniques: BreathingTechnique[];
  currentTechnique: BreathingTechnique | null;
  isDarkMode: boolean;
  sessionHistory: SessionRecord[];
  setCurrentTechnique: (technique: BreathingTechnique | null) => void;
  toggleDarkMode: () => void;
  addSessionRecord: (record: SessionRecord) => void;
  addCustomTechnique: (technique: Omit<BreathingTechnique, 'id' | 'isCustom'>) => void;
}

export interface SessionRecord {
  techniqueId: number;
  techniqueName: string;
  duration: number; // in seconds
  date: Date;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [techniques, setTechniques] = useState<BreathingTechnique[]>(breathingTechniques);
  const [currentTechnique, setCurrentTechnique] = useState<BreathingTechnique | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [sessionHistory, setSessionHistory] = useState<SessionRecord[]>([]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const addSessionRecord = (record: SessionRecord) => {
    setSessionHistory(prev => [record, ...prev]);
  };

  const addCustomTechnique = (technique: Omit<BreathingTechnique, 'id' | 'isCustom'>) => {
    const newTechnique: BreathingTechnique = {
      ...technique,
      id: Math.max(...techniques.map(t => t.id)) + 1,
      isCustom: true
    };
    setTechniques(prev => [...prev, newTechnique]);
    setCurrentTechnique(newTechnique);
  };

  return (
    <AppContext.Provider
      value={{
        techniques,
        currentTechnique,
        isDarkMode,
        sessionHistory,
        setCurrentTechnique,
        toggleDarkMode,
        addSessionRecord,
        addCustomTechnique
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};