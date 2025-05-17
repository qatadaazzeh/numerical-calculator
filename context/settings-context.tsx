"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type SettingsContextType = {
  decimalPlaces: number;
  setDecimalPlaces: (places: number) => void;
  showIterationSteps: boolean;
  setShowIterationSteps: (show: boolean) => void;
};

const defaultSettings: SettingsContextType = {
  decimalPlaces: 6,
  setDecimalPlaces: () => {},
  showIterationSteps: true,
  setShowIterationSteps: () => {},
};

const SettingsContext = createContext<SettingsContextType>(defaultSettings);

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [decimalPlaces, setDecimalPlacesState] = useState<number>(defaultSettings.decimalPlaces);
  const [showIterationSteps, setShowIterationStepsState] = useState<boolean>(defaultSettings.showIterationSteps);
  
  // Load settings from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDecimalPlaces = localStorage.getItem("decimalPlaces");
      const savedShowIterationSteps = localStorage.getItem("showIterationSteps");
      
      if (savedDecimalPlaces) {
        setDecimalPlacesState(parseInt(savedDecimalPlaces, 10));
      }
      
      if (savedShowIterationSteps) {
        setShowIterationStepsState(savedShowIterationSteps === "true");
      }
    }
  }, []);
  
  // Save settings to localStorage whenever they change
  const setDecimalPlaces = (places: number) => {
    setDecimalPlacesState(places);
    localStorage.setItem("decimalPlaces", places.toString());
  };
  
  const setShowIterationSteps = (show: boolean) => {
    setShowIterationStepsState(show);
    localStorage.setItem("showIterationSteps", show.toString());
  };
  
  return (
    <SettingsContext.Provider value={{ 
      decimalPlaces, 
      setDecimalPlaces,
      showIterationSteps,
      setShowIterationSteps 
    }}>
      {children}
    </SettingsContext.Provider>
  );
}
