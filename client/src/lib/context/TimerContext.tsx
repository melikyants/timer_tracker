import React, { useState, createContext } from "react";

// Create Context Object
export const TimerContext = React.createContext<any>([]);

// Create a provider for components to consume and subscribe to changes
export const TimerContextProvider = (props: any) => {
  const [timerDetailsId, setTimerDetailsId] = useState(null);
  console.log("TimerContextProvider -> timerDetailsId", timerDetailsId)

  return (
    <TimerContext.Provider value={[timerDetailsId, setTimerDetailsId]}>
      {props.children}
    </TimerContext.Provider>
  );
};