import React, { useState, createContext } from "react";

// Create Context Object
export const TimerContext = React.createContext<any>([]);

// Create a provider for components to consume and subscribe to changes
export const TimerContextProvider = (props: any) => {
  const [activeId, setActiveId] = useState('');

  return (
    <TimerContext.Provider value={[activeId, setActiveId]}>
      {props.children}
    </TimerContext.Provider>
  );
};